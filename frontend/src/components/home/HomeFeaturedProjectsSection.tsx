import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, RefreshCw, AlertCircle, Star, FolderOpen } from "lucide-react";

import { fetchProjects } from "../../contentfulClient";
import ProjectCard from "../ProjectCard";

interface ContentfulProject {
  sys: {
    id: string;
    createdAt: string;
    updatedAt: string;
  };
  fields: {
    title: string;
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
    featured?: boolean;
    order?: number;
  };
}

type ProjectsApiPayload = {
  total?: number;
  limit?: number;
  skip?: number;
  items?: ContentfulProject[];
};

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { delayChildren: 0.12, staggerChildren: 0.1 },
  },
};

const card = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 120, damping: 14 },
  },
};

const safeNumber = (v: unknown, fallback: number) => {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const normalizeProjects = (data: unknown): ContentfulProject[] => {
  if (Array.isArray(data)) return data as ContentfulProject[];

  if (data && typeof data === "object" && "items" in (data as any)) {
    const payload = data as ProjectsApiPayload;
    return Array.isArray(payload.items) ? payload.items : [];
  }

  return [];
};

const normalizeLinksForCard = (p: ContentfulProject): ContentfulProject => ({
  ...p,
  fields: {
    ...p.fields,
    gitHubUrl: p.fields.gitHubUrl ?? '',
    liveDemoUr: p.fields.liveDemoUr ?? '',
  },
});

const sortProjects = (a: ContentfulProject, b: ContentfulProject) => {
  const ao = safeNumber(a.fields.order, 9999);
  const bo = safeNumber(b.fields.order, 9999);
  if (ao !== bo) return ao - bo;

  const ad = new Date(a.sys.updatedAt).getTime();
  const bd = new Date(b.sys.updatedAt).getTime();
  return bd - ad;
};

const HomeFeaturedProjectsSection: React.FC = () => {
  const navigate = useNavigate();

  const [projects, setProjects] = useState<ContentfulProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const load = async (silent = false) => {
    try {
      if (!silent) {
        setLoading(true);
        setError(null);
      }

      const res = await fetchProjects();
      const normalized = normalizeProjects(res).map(normalizeLinksForCard);

      setProjects(normalized);
      if (!silent) setLoading(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Errore sconosciuto";
      setError(msg);
      setLoading(false);
      console.error("❌ Error loading featured projects:", err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const featuredTop3 = useMemo(() => {
    const all = Array.isArray(projects) ? projects : [];
    const featured = all.filter((p) => Boolean(p.fields?.featured));

    const base = featured.length >= 3 ? featured : all;
    return [...base].sort(sortProjects).slice(0, 3);
  }, [projects]);

  const featuredCount = useMemo(
    () => projects.filter((p) => Boolean(p.fields?.featured)).length,
    [projects]
  );

  return (
    <section className="bg-[#f6f3ee]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-white/70 backdrop-blur-sm border border-white/30 rounded-3xl shadow-xl p-6 sm:p-10">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-50 border border-violet-100 text-violet-700 font-bold text-2xl">
              <Star className="w-4 h-4" />
              <span>Featured Projects</span>
            </div>

            <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-gray-900">
              Progetti in evidenza,{" "}
              <span className="bg-linear-to-r from-violet-600 to-rose-500 bg-clip-text text-transparent">
                scelti per impatto
              </span>
            </h2>

            <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
              3 progetti rappresentativi (UI, logica, performance e qualità del codice). Vuoi vedere l’intero portfolio?
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-700 text-sm font-semibold">
                <FolderOpen className="w-4 h-4 text-violet-700" />
                <span>{projects.length} totali</span>
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-700 text-sm font-semibold">
                <Star className="w-4 h-4 text-amber-500" />
                <span>{featuredCount} featured</span>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="py-10 text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
                className="w-14 h-14 mx-auto mb-4"
              >
                <div className="w-full h-full bg-linear-to-r from-violet-600 to-rose-500 rounded-2xl p-0.5">
                  <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center">
                    <Star className="w-7 h-7 text-violet-700" />
                  </div>
                </div>
              </motion.div>
              <p className="text-gray-600 font-medium">Caricamento progetti in evidenza...</p>
              <p className="text-gray-400 mt-2">Connessione a Contentful</p>
            </div>
          ) : error ? (
            <div className="py-10 text-center">
              <div className="w-14 h-14 mx-auto mb-4">
                <div className="w-full h-full bg-linear-to-r from-red-500 to-pink-500 rounded-2xl p-0.5">
                  <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center">
                    <AlertCircle className="w-7 h-7 text-red-500" />
                  </div>
                </div>
              </div>

              <p className="text-gray-900 font-bold text-lg">Non riesco a caricare i progetti</p>
              <p className="text-red-600 bg-red-50 border border-red-200 rounded-xl p-4 mt-3 max-w-2xl mx-auto">
                {error}
              </p>

              <button
                onClick={async () => {
                  setIsRefreshing(true);
                  await load(true);
                  setIsRefreshing(false);
                }}
                disabled={isRefreshing}
                className="mt-6 inline-flex items-center justify-center px-6 py-3 rounded-full font-bold
                  bg-linear-to-r from-violet-600 to-violet-800 text-white shadow-lg hover:shadow-xl transition-all
                  disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-5 h-5 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                Riprova
              </button>
            </div>
          ) : (
            <>
              <motion.div
                variants={container}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8"
              >
                {featuredTop3.map((project) => (
                  <motion.div key={project.sys.id} variants={card} className="relative">
                    {project.fields.featured && (
                      <div className="absolute -top-3 -right-3 z-10">
                        <div className="bg-linear-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                          ⭐ Featured
                        </div>
                      </div>
                    )}
                    <ProjectCard project={project} />
                  </motion.div>
                ))}
              </motion.div>

              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/progetti")}
                  className="inline-flex items-center justify-center px-7 py-4 rounded-full font-bold
                    bg-linear-to-r from-violet-600 to-violet-800 text-white shadow-lg hover:shadow-xl transition-all"
                >
                  Vedi tutti i progetti
                  <ArrowRight className="w-5 h-5 ml-2" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/contact")}
                  className="inline-flex items-center justify-center px-7 py-4 rounded-full font-bold
                    bg-white text-violet-700 border-2 border-violet-600 hover:bg-violet-50 transition-all shadow-sm"
                >
                  Parliamone
                  <ArrowRight className="w-5 h-5 ml-2" />
                </motion.button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default React.memo(HomeFeaturedProjectsSection);
