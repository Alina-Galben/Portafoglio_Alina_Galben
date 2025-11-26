import { useState } from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink, ChevronDown } from 'lucide-react';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

interface ProjectCardProps {
  project: {
    fields: {
      title: string;
      description: any;
      technologies: string[];
      gitHubUrl?: string;
      liveDemoUr?: string;
      coverImage?: {
        fields: { file: { url: string } };
      };
    };
  };
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const { 
    title, 
    description, 
    technologies, 
    gitHubUrl, 
    liveDemoUr: demoLink,
    coverImage 
  } = project.fields;

  const [isExpanded, setIsExpanded] = useState(false);
  const imageUrl = coverImage?.fields?.file?.url;

  return (
    <motion.div
      layout
      className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-full border border-gray-100"
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {imageUrl ? (
        <img 
          src={`https:${imageUrl}`} 
          alt={`Copertina ${title}`}
          className="w-full h-48 object-cover" 
        />
      ) : (
        <div className="w-full h-48 bg-linear-to-br from-purple-400 to-pink-400 flex items-center justify-center text-6xl">
          💻
        </div>
      )}
      
      <div className="p-6 flex flex-col grow">
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2" title={title}>
          {title}
        </h3>

        <div className={`relative overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-none' : 'max-h-40'}`}>
          <div className="text-gray-600 mb-4 grow">
            {description ? documentToReactComponents(description) : <p>Nessuna descrizione.</p>}
          </div>
          {!isExpanded && <div className="absolute bottom-0 left-0 w-full h-12 bg-linear-to-t from-white to-transparent" />}
        </div>
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-purple-600 font-semibold self-start flex items-center gap-1 mb-4 hover:text-purple-700 transition-colors"
        >
          {isExpanded ? 'Meno dettagli' : 'Più dettagli'}
          <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>

        <div className="flex flex-wrap gap-2 mb-6 mt-auto">
          {technologies?.map((tech) => (
            <span key={tech} className="px-2 py-0.5 bg-purple-100 text-purple-700 text-sm font-semibold rounded-full">
              {tech}
            </span>
          ))}
        </div>
        
        <div className="flex gap-4">
          {gitHubUrl && (
            <a 
              href={gitHubUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-gray-800 text-white font-semibold px-4 py-2 rounded-md hover:bg-gray-900 transition-colors"
            >
              <Github className="w-4 h-4" /> GitHub
            </a>
          )}
          {demoLink && (
            <a 
              href={demoLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-purple-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
            >
              <ExternalLink className="w-4 h-4" /> Visita
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}