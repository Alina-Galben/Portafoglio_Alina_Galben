import { useMemo } from "react";
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { Github, ExternalLink } from "lucide-react";
import { documentToPlainTextString } from "@contentful/rich-text-plain-text-renderer";

interface ProjectCardProps {
  project: {
    fields: {
      title: string;
      description: any;
      technologies: string[];
      gitHubUrl?: string;
      liveDemoUr?: string;
      coverImage?: { fields: { file: { url: string } } };
    };
  };
}

const safeArray = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);

export default function ProjectCard({ project }: ProjectCardProps) {
  const { title, description, technologies, gitHubUrl, liveDemoUr, coverImage, slug } = project.fields as any;

  const navigate = useNavigate();

  const imageUrl = coverImage?.fields?.file?.url ? `https:${coverImage.fields.file.url}` : "";

  const plainDescription = useMemo(() => {
    try {
      return documentToPlainTextString(description) || "Descrizione non disponibile.";
    } catch {
      return "Descrizione non disponibile.";
    }
  }, [description]);

  const techAll = useMemo(() => safeArray<string>(technologies), [technologies]);
  const techTop = useMemo(() => techAll.slice(0, 4), [techAll]);
  const techRemaining = Math.max(0, techAll.length - techTop.length);

  return (
    <motion.article
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      className="group relative bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden h-full flex flex-col cursor-pointer"
      onClick={() => slug && navigate(`/projects/${slug}`)}
    >
      <div className="h-1 w-full bg-linear-to-r from-violet-600 via-fuchsia-500 to-rose-500" />

      <div className="relative w-full h-52 bg-gray-100 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`Copertina ${title}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-violet-500 to-rose-500 flex items-center justify-center text-4xl">
            💻
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="p-4 flex flex-col grow">
        <h3 className="text-base sm:text-lg font-extrabold text-gray-900 line-clamp-2 min-h-12" title={title}>
          {title}
        </h3>

        <p className="mt-2 text-gray-600 text-sm leading-relaxed line-clamp-2 min-h-10">
          {plainDescription}
        </p>

        <div className="mt-3 h-10 overflow-hidden flex flex-wrap gap-2">
          {techTop.map((tech) => (
            <span
              key={tech}
              className="inline-flex items-center h-6 px-2.5 rounded-lg text-[11px] font-bold
    bg-violet-50 text-violet-900 border border-violet-100"
            >
              {tech}
            </span>
          ))}
          {techRemaining > 0 && (
            <span
              className="inline-flex items-center h-6 px-2.5 rounded-lg text-[11px] font-bold
    bg-gray-50 text-gray-700 border border-gray-200"
              title={techAll.slice(techTop.length).join(", ")}
            >
              +{techRemaining}
            </span>
          )}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <a
            href={gitHubUrl || "#"}
            onClick={(e) => e.stopPropagation()} 
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={!gitHubUrl}
            className={[
              "inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl font-semibold text-sm transition-all",
              gitHubUrl ? "bg-gray-900 text-white hover:bg-gray-950" : "bg-gray-100 text-gray-400 pointer-events-none",
            ].join(" ")}
          >
            <Github className="w-4 h-4" />
            GitHub
          </a>

          <a
            href={liveDemoUr || "#"}
            onClick={(e) => e.stopPropagation()} 
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={!liveDemoUr}
            className={[
              "inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl font-semibold text-sm transition-all",
              liveDemoUr
                ? "bg-white border-2 border-violet-600 text-violet-700 hover:bg-violet-50"
                : "bg-gray-100 text-gray-400 pointer-events-none border border-gray-200",
            ].join(" ")}
          >
            <ExternalLink className="w-4 h-4" />
            Live
          </a>
        </div>
      </div>
    </motion.article>
  );
}
