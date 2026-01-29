import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import servicesData from "../../data/services.json";

type Service = {
  id: number;
  icon: string;
  title: string;
  description: string;
  category: string;
  cta: string;
};

type Accent = "violet" | "rose" | "amber" | "blue";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { delayChildren: 0.15, staggerChildren: 0.12 },
  },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 120, damping: 14 },
  },
};

const ACCENTS: Record<Accent, { ring: string; iconBg: string; icon: string }> = {
  violet: { ring: "hover:border-violet-200", iconBg: "bg-violet-100", icon: "text-violet-700" },
  rose: { ring: "hover:border-rose-200", iconBg: "bg-rose-100", icon: "text-rose-700" },
  amber: { ring: "hover:border-amber-200", iconBg: "bg-amber-100", icon: "text-amber-700" },
  blue: { ring: "hover:border-blue-200", iconBg: "bg-blue-100", icon: "text-blue-700" },
};

const getIcon = (iconName: string) => {
  const LucideIcon = (Icons as any)[iconName] as React.ComponentType<any> | undefined;
  return LucideIcon ?? Icons.Sparkles;
};

const pickTopServices = (all: Service[]) => {
  
  const TOP_CATEGORIES: string[] = ["frontend", "webapp", "backend", "automation"];

  const accentByCategory: Record<string, Accent> = {
    frontend: "violet",
    webapp: "blue",
    backend: "rose",
    automation: "amber",
  };

  const chosen: Array<Service & { accent: Accent }> = [];

  for (const cat of TOP_CATEGORIES) {
    const found = all.find((s) => s.category === cat);
    if (found) chosen.push({ ...found, accent: accentByCategory[cat] ?? "violet" });
  }

  if (chosen.length < 4) {
    const remaining = all.filter((s) => !chosen.some((c) => c.id === s.id));
    remaining.slice(0, 4 - chosen.length).forEach((s, idx) => {
      const fallbackAccents: Accent[] = ["violet", "blue", "rose", "amber"];
      chosen.push({ ...s, accent: fallbackAccents[(chosen.length + idx) % fallbackAccents.length] });
    });
  }

  return chosen.slice(0, 4);
};

const HomeServicesSection: React.FC = () => {
  const navigate = useNavigate();
  const services = servicesData as Service[];

  const topServices = useMemo(() => pickTopServices(services), [services]);

  return (
    <section className="bg-[#f6f3ee]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="bg-white/70 backdrop-blur-sm border border-white/30 rounded-3xl shadow-2xl p-6 sm:p-10"
        >
          {/* Header */}
          <motion.div variants={item} className="text-center max-w-3xl mx-auto mb-10">
            
            <h2 className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-violet-50 border border-violet-100 text-violet-700 font-bold text-4xl ">🚀 Come posso aiutarti</h2>
            

            <h3 className="mt-6 text-2xl sm:text-5xl font-extrabold text-gray-900">
              Soluzioni web pensate per essere usate davvero
              
            </h3>

            <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
              In Home ti mostro solo i servizi principali. Nella pagina “Servizi” trovi il dettaglio completo.
            </p>
          </motion.div>

          <motion.div variants={container} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {topServices.map((s) => {
              const Icon = getIcon(s.icon);
              const a = ACCENTS[s.accent];

              return (
                <motion.button
                  key={s.id}
                  type="button"
                  variants={item}
                  onClick={() => navigate("/servizi")}
                  className={[
                    "group text-left bg-white rounded-2xl border border-gray-100 shadow-sm p-6",
                    "hover:shadow-xl transition-all duration-300",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2",
                    a.ring,
                  ].join(" ")}
                >
                  <div className={`w-12 h-12 rounded-xl ${a.iconBg} flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 ${a.icon}`} />
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2">{s.title}</h3>

                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base line-clamp-4">
                    {s.description}
                  </p>

                  <div className="mt-5 flex items-center text-violet-700 font-semibold text-sm">
                    <span className="opacity-80 group-hover:opacity-100 transition-opacity">Scopri di più</span>
                    <Icons.ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.button>
              );
            })}
          </motion.div>

          <motion.div variants={item} className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/servizi")}
              className="inline-flex items-center justify-center px-7 py-4 rounded-full font-bold
                bg-linear-to-r from-violet-600 to-violet-800 text-white shadow-lg hover:shadow-xl transition-all"
            >
              Vedi tutti i servizi
              <Icons.ArrowRight className="w-5 h-5 ml-2" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/contact")}
              className="inline-flex items-center justify-center px-7 py-4 rounded-full font-bold
                bg-white text-violet-700 border-2 border-violet-600 hover:bg-violet-50 transition-all shadow-sm"
            >
              <Icons.MessageCircle className="w-5 h-5 mr-2" />
              Parliamone
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default React.memo(HomeServicesSection);
