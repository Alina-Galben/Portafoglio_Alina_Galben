import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import useSWR from 'swr';
import { Github, ExternalLink, ArrowLeft, RefreshCw } from 'lucide-react';
import { getProjectBySlug } from '../services/api';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

interface Project {
  sys: {
    id: string;
    createdAt: string;
    updatedAt: string;
  };
  fields: {
    title: string;
    slug: string;
    description: any;
    technologies: string[];
    gitHubUrl?: string;
    liveDemoUr?: string;
    coverImage?: {
      fields: {
        file: { url: string };
        title?: string;
      };
    };
  };
}

const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { data, error, isLoading, mutate } = useSWR(
    slug ? `project-${slug}` : null,
    () => slug ? getProjectBySlug(slug) : null,
    { refreshInterval: 60000 }
  );

  const project: Project | undefined = (data as any)?.fields ? data : (data as any);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f6f3ee] flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600 text-lg">Caricamento progetto...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-[#f6f3ee] pt-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {error ? 'Errore nel caricamento' : 'Progetto non trovato'}
            </h1>
            <p className="text-gray-600 mb-8">
              {error ? 'Si è verificato un errore nel caricamento del progetto.' : 'Il progetto che stai cercando non esiste o non è più disponibile.'}
            </p>
            <button
              onClick={() => navigate('/projects')}
              className="px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
            >
              Torna ai Progetti
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { title, description, technologies, gitHubUrl, liveDemoUr, coverImage } = project.fields;
  const metaDescription =
  description
    ? String(documentToReactComponents(description)).slice(0, 150)
    : `Dettagli del progetto ${title}`;

  return (
    <>
      <Helmet>
        <title>{title} — Portfolio di Alina Galben</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={technologies?.join(', ') || 'progetto, portfolio, sviluppo'} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={`Scopri di più su ${title}, un progetto realizzato da Alina Galben.`} />
        {coverImage && <meta property="og:image" content={`https:${coverImage.fields.file.url}`} />}
        <meta property="og:type" content="website" />
        <link rel="canonical" href={`/projects/${project.fields.slug}`} />
      </Helmet>

      <div className="min-h-screen bg-[#f6f3ee] pt-10 pb-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
            <button
              onClick={() => navigate('/projects')}
              className="flex items-center space-x-1 hover:text-violet-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Progetti</span>
            </button>
            <span>/</span>
            <span className="text-gray-900 font-medium truncate">{title}</span>
          </div>

          {coverImage && (
            <div className="h-64 md:h-80 lg:h-96 mb-8 overflow-hidden rounded-xl shadow-lg">
              <img
                src={`https:${coverImage.fields.file.url}`}
                alt={coverImage.fields.title || title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex-1">
              {title}
            </h1>
            <div className="flex gap-2">
              <a
                href={gitHubUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                
                className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold text-sm ${gitHubUrl ? 'bg-gray-900 text-white hover:bg-gray-800' : 'bg-gray-100 text-gray-400 pointer-events-none'}`}
              >
                <Github className="w-4 h-4" /> <span>GitHub</span>
              </a>
              <a
                href={liveDemoUr || '#'}
                target="_blank"
                rel="noopener noreferrer"
                aria-disabled={!liveDemoUr}
                className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold text-sm ${liveDemoUr ? 'bg-white border-2 border-violet-600 text-violet-700 hover:bg-violet-50' : 'bg-gray-100 text-gray-400 pointer-events-none border border-gray-200'}`}
              >
                <ExternalLink className="w-4 h-4" /> <span>Live</span>
              </a>
            </div>
          </div>

          {technologies && technologies.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {technologies.map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-violet-100 text-violet-700"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}

          <article className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-12">
            {description ? (
              <div className="prose max-w-none">
                {documentToReactComponents(description)}
              </div>
            ) : (
              <p className="text-gray-600">Descrizione non disponibile.</p>
            )}
            <div className="mt-8 flex items-center space-x-3 text-sm text-gray-500">
              <RefreshCw className="w-4 h-4 text-green-600" />
              <span>Ultimo aggiornamento: {new Date(project.sys.updatedAt).toLocaleDateString('it-IT')}</span>
              <button
                onClick={() => mutate()}
                className="text-violet-600 hover:text-violet-700 font-medium"
              >
                Aggiorna 🔄
              </button>
            </div>
          </article>
        </div>
      </div>
    </>
  );
};

export default ProjectDetailPage;
