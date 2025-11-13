import { useState } from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink, Image as ImageIcon, ChevronDown } from 'lucide-react';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

interface ProjectCardProps {
  project: {
    sys: {
      id: string;
      createdAt: string;
      updatedAt: string;
    };
    fields: {
      title: string;
      description: any; // Rich text object
      technologies: string[];
      gitHubUrl?: string;
      liveDemoUr?: string;
      coverImage?: {
        fields: {
          file: {
            url: string;
          };
          title?: string;
        };
      };
      featured?: boolean;
      order?: number;
    };
  };
}

export default function ProjectCard({ project }: ProjectCardProps) {
  // Facciamo combaciare i nomi del codice con i Field ID di Contentful
  const { 
    title, 
    description, 
    technologies, 
    gitHubUrl: githubLink, // "Prendi 'gitHubUrl' e chiamalo 'githubLink'"
    liveDemoUr: demoLink,  // "Prendi 'liveDemoUr' e chiamalo 'demoLink'"
    coverImage 
  } = project.fields;

  const imageUrl = coverImage?.fields?.file?.url;

  // Stato per "Vedi di più"
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      layout // Animiamo il cambio di layout (altezza)
      className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-full border border-gray-100"
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {imageUrl ? (
        <img 
          src={`https:${imageUrl}`} 
          alt={`Copertina del progetto ${title}`}
          className="w-full h-48 object-cover" 
        />
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
          <span className="text-6xl">💻</span>
        </div>
      )}
      
      <div className="p-6 flex flex-col flex-grow">
        
        {/* Titolo con gestione testo lungo */}
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2" title={title}>
          {title}
        </h3>

        {/* Descrizione con expand/collapse */}
        <div 
          className={`relative overflow-hidden transition-all duration-500 ease-in-out ${
            isExpanded ? 'max-h-none' : 'max-h-40'
          }`}
        >
          <div className="text-gray-600 mb-4 flex-grow">
            {description ? (
              documentToReactComponents(description)
            ) : (
              <p>Nessuna descrizione disponibile.</p>
            )}
          </div>
          {/* Sfumatura che appare solo se il testo è contratto */}
          {!isExpanded && (
            <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white to-transparent" />
          )}
        </div>
        
        {/* Pulsante "Vedi di più" */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-purple-600 font-semibold self-start flex items-center gap-1 mb-4 hover:text-purple-700 transition-colors"
        >
          {isExpanded ? 'Vedi di meno' : 'Vedi di più'}
          <ChevronDown 
            className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
          />
        </button>

        {/* Tecnologie */}
        <div className="flex flex-wrap gap-2 mb-6 mt-auto">
          {technologies && technologies.map((tech) => (
            <span 
              key={tech}
              className="px-2 py-0.5 bg-purple-100 text-purple-700 text-sm font-semibold rounded-full"
            >
              {tech}
            </span>
          ))}
        </div>
        
        {/* Bottoni di azione */}
        <div className="flex gap-4">
          {githubLink && (
            <a 
              href={githubLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-gray-800 text-white font-semibold px-4 py-2 rounded-md hover:bg-gray-900 transition-colors"
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>
          )}
          {demoLink && (
            <a 
              href={demoLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-purple-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Visita
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}