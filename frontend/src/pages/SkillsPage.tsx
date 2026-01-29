import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, Variants } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Code, Heart, ArrowRight, Cpu, MessageCircle, Calendar, LucideIcon } from 'lucide-react';

import SkillCard from '../components/SkillCard';
import SectionTitle from '../components/SectionTitle';
import ElegantStatCard from '../components/ElegantStatCard';
import technicalSkillsData from '../data/technicalSkills.json';
import softSkillsData from '../data/softSkills.json';

interface Skill {
  id: number;
  icon: string;
  title: string;
  description: string;
  category: string;
  level?: number;
}

interface SkillSectionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBgGradient: string;
  skills: Skill[];
  delayOffset: number;
}

const CATEGORY_LABELS: Record<string, string> = {
  frontend: 'Frontend Development',
  backend: 'Backend Development',
  database: 'Database & Storage',
  tools: 'Tools & Workflow',
  cloud: 'Cloud & Deployment',
  design: 'Design & UX',
  cognitive: 'Capacità Cognitive',
  interpersonal: 'Relazioni Interpersonali',
  personal: 'Crescita Personale',
  professional: 'Competenze Professionali',
  creative: 'Creatività & Innovazione'
};

const ANIMATION: Record<string, Variants> = {
  container: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } }
  },
  card: {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 12, duration: 0.6 } }
  },
  section: {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } }
  }
};

const SEO_METADATA = {
  title: "🧠 Competenze Tecniche & Soft Skills — Alina Galben Web Developer",
  description: "Le competenze tecniche e le soft skills che mi rappresentano come sviluppatrice full-stack: frontend, backend, UX e crescita personale.",
  keywords: "competenze tecniche, soft skills, React, Node.js, frontend, backend, problem solving, team collaboration, web developer",
  ogTitle: "🧠 Competenze Tecniche & Soft Skills — Alina Galben",
  ogDesc: "Le competenze tecniche e personali che definiscono il mio approccio allo sviluppo web full-stack."
};

const groupByCategory = <T extends { category: string }>(items: T[]) =>
  items.reduce((acc, item) => ({
    ...acc,
    [item.category]: [...(acc[item.category] ?? []), item]
  }), {} as Record<string, T[]>);

const SkillCategorySection: React.FC<SkillSectionProps> = ({ 
  title, description, icon, iconBgGradient, skills, delayOffset 
}) => {
  const groupedSkills = useMemo(() => groupByCategory(skills), [skills]);

  return (
    <motion.div
      variants={ANIMATION.section}
      initial="hidden"
      animate="visible"
      className="mb-20"
    >
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`inline-flex items-center justify-center w-16 h-16 bg-linear-to-r ${iconBgGradient} rounded-2xl mb-6 shadow-lg`}
        >
          {icon}
        </motion.div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">{description}</p>
      </div>

      {Object.entries(groupedSkills).map(([category, categorySkills], idx) => (
        <motion.div
          key={category}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: delayOffset + idx * 0.1 }}
          className="mb-12"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-8 capitalize">
            {CATEGORY_LABELS[category] ?? category}
          </h3>
          <motion.div
            variants={ANIMATION.container}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {categorySkills.map((skill) => (
              <motion.div key={skill.id} variants={ANIMATION.card}>
                <SkillCard {...skill} />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      ))}
    </motion.div>
  );
};

const SkillsPage: React.FC = () => {
  const navigate = useNavigate();
  const techSkills = technicalSkillsData as Skill[];
  const personalSkills = softSkillsData as Skill[];

  return (
    <>
      <Helmet>
        <title>{SEO_METADATA.title}</title>
        <meta name="description" content={SEO_METADATA.description} />
        <meta name="keywords" content={SEO_METADATA.keywords} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={SEO_METADATA.ogTitle} />
        <meta property="og:description" content={SEO_METADATA.ogDesc} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="/skills" />
      </Helmet>

      <div className="min-h-screen bg-[#f6f3ee] pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <SectionTitle
            emoji="🧠"
            title="Competenze Tecniche & Soft Skills"
            subtitle="Un equilibrio tra competenze tecniche all'avanguardia e soft skills umane che mi permettono di creare soluzioni digitali efficaci e collaborative."
            className="pt-8"
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
          >
            <ElegantStatCard value={techSkills.length} label="Competenze Tecniche" color="blue" icon={<Cpu className="w-6 h-6" />} />
            <ElegantStatCard value={personalSkills.length} label="Soft Skills" color="pink" icon={<MessageCircle className="w-6 h-6" />} />
            <ElegantStatCard value="1+" label="Anni di Esperienza" color="green" icon={<Calendar className="w-6 h-6" />} />
          </motion.div>

          <SkillCategorySection
            title="🔧 Competenze Tecniche"
            description="Tecnologie e strumenti che utilizzo per trasformare idee in soluzioni digitali performanti e scalabili."
            icon={<Code className="w-8 h-8 text-white" />}
            iconBgGradient="from-blue-500 to-cyan-500"
            skills={techSkills}
            delayOffset={0.6}
          />

          <SkillCategorySection
            title="🤝 Soft Skills"
            description="Le competenze umane e professionali che guidano il mio approccio al lavoro e alle relazioni collaborative."
            icon={<Heart className="w-8 h-8 text-white" />}
            iconBgGradient="from-purple-500 to-pink-500"
            skills={personalSkills}
            delayOffset={0.8}
          />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="bg-linear-to-r from-violet-600 via-purple-600 to-blue-600 rounded-2xl p-10 md:p-12 text-center text-white mb-16 shadow-2xl shadow-purple-900/20"
          >
            <h2 className="text-4xl md:text-4xl font-bold mb-6">Vuoi vedere queste competenze in azione?</h2>
            <p className="text-xl md:text-xl opacity-90 mb-10 max-w-2xl mx-auto">
              Esplora i miei progetti per vedere come applico queste competenze nella creazione di soluzioni web innovative.
            </p>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/projects')}
              className="inline-flex items-center bg-white text-purple-600 font-bold py-5 px-10 rounded-xl hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/30 text-lg"
            >
              Esplora i miei progetti
              <ArrowRight className="ml-2 w-6 h-6" />
            </motion.button>
          </motion.div>

        </div>
      </div>
    </>
  );
};

export default React.memo(SkillsPage);