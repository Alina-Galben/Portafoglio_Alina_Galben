import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Code, Heart, ArrowRight } from 'lucide-react';
import SkillCard from '../components/SkillCard';
import SectionTitle from '../components/SectionTitle';
import technicalSkillsData from '../data/technicalSkills.json';
import softSkillsData from '../data/softSkills.json';

interface TechnicalSkill {
  id: number;
  icon: string;
  title: string;
  description: string;
  category: string;
  level: number;
}

interface SoftSkill {
  id: number;
  icon: string;
  title: string;
  description: string;
  category: string;
}

const SkillsPage: React.FC = () => {
  const technicalSkills: TechnicalSkill[] = technicalSkillsData;
  const softSkills: SoftSkill[] = softSkillsData;

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Raggruppa le skills tecniche per categoria
  const groupedTechnicalSkills = technicalSkills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, TechnicalSkill[]>);

  // Raggruppa le soft skills per categoria
  const groupedSoftSkills = softSkills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, SoftSkill[]>);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12,
        duration: 0.6
      }
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  // Nomi delle categorie in italiano
  const categoryNames: Record<string, string> = {
    'frontend': 'Frontend Development',
    'backend': 'Backend Development', 
    'database': 'Database & Storage',
    'tools': 'Tools & Workflow',
    'cloud': 'Cloud & Deployment',
    'design': 'Design & UX',
    'cognitive': 'Capacità Cognitive',
    'interpersonal': 'Relazioni Interpersonali',
    'personal': 'Crescita Personale',
    'professional': 'Competenze Professionali',
    'creative': 'Creatività & Innovazione'
  };

  return (
    <>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>🧠 Competenze Tecniche & Soft Skills — Alina Galben Web Developer</title>
        <meta 
          name="description" 
          content="Le competenze tecniche e le soft skills che mi rappresentano come sviluppatrice full-stack: frontend, backend, UX e crescita personale." 
        />
        <meta name="keywords" content="competenze tecniche, soft skills, React, Node.js, frontend, backend, problem solving, team collaboration, web developer" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="🧠 Competenze Tecniche & Soft Skills — Alina Galben" />
        <meta property="og:description" content="Le competenze tecniche e personali che definiscono il mio approccio allo sviluppo web full-stack." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="/skills" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <SectionTitle
            emoji="🧠"
            title="Competenze Tecniche & Soft Skills"
            subtitle="Un equilibrio tra competenze tecniche all'avanguardia e soft skills umane che mi permettono di creare soluzioni digitali efficaci e collaborative."
            className="pt-8"
          />

          {/* Skills Overview Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
          >
            <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
              <div className="text-3xl font-bold text-blue-600 mb-2">{technicalSkills.length}</div>
              <div className="text-gray-600 text-sm font-medium">Competenze Tecniche</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
              <div className="text-3xl font-bold text-purple-600 mb-2">{softSkills.length}</div>
              <div className="text-gray-600 text-sm font-medium">Soft Skills</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
              <div className="text-3xl font-bold text-green-600 mb-2">1+</div>
              <div className="text-gray-600 text-sm font-medium">Anni di Esperienza</div>
            </div>
          </motion.div>

          {/* Technical Skills Section */}
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            className="mb-20"
          >
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-r from-blue-500 to-cyan-500 rounded-2xl mb-6"
              >
                <Code className="w-8 h-8 text-white" />
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">🔧 Competenze Tecniche</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Tecnologie e strumenti che utilizzo per trasformare idee in soluzioni digitali performanti e scalabili.
              </p>
            </div>

            {Object.entries(groupedTechnicalSkills).map(([category, skills], categoryIndex) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + categoryIndex * 0.1 }}
                className="mb-12"
              >
                <h3 className="text-2xl font-bold text-gray-800 mb-8 capitalize">
                  {categoryNames[category] || category}
                </h3>
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  {skills.map((skill) => (
                    <motion.div key={skill.id} variants={cardVariants}>
                      <SkillCard {...skill} />
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          {/* Soft Skills Section */}
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            className="mb-20"
          >
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-r from-purple-500 to-pink-500 rounded-2xl mb-6"
              >
                <Heart className="w-8 h-8 text-white" />
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">🤝 Soft Skills</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Le competenze umane e professionali che guidano il mio approccio al lavoro e alle relazioni collaborative.
              </p>
            </div>

            {Object.entries(groupedSoftSkills).map(([category, skills], categoryIndex) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + categoryIndex * 0.1 }}
                className="mb-12"
              >
                <h3 className="text-2xl font-bold text-gray-800 mb-8 capitalize">
                  {categoryNames[category] || category}
                </h3>
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  {skills.map((skill) => (
                    <motion.div key={skill.id} variants={cardVariants}>
                      <SkillCard {...skill} />
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          {/* Call-to-Action Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="bg-linear-to-r from-purple-600 via-pink-600 to-red-600 rounded-2xl p-10 md:p-12 text-center text-white mb-16"
          >
            <h2 className="text-4xl md:text-4xl font-bold mb-6">
              Vuoi vedere queste competenze in azione?
            </h2>
            <p className="text-xl md:text-xl opacity-90 mb-10 max-w-2xl mx-auto">
              Esplora i miei progetti per vedere come applico queste competenze nella creazione di soluzioni web innovative.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                window.location.href = '/progetti';
              }}
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

export default SkillsPage;