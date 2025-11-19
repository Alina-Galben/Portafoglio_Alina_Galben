import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import ServiceCard from '../components/ServiceCard';
import SectionTitle from '../components/SectionTitle';
import servicesData from '../data/services.json';

interface Service {
  id: number;
  icon: string;
  title: string;
  description: string;
  category: string;
  cta: string;
}

const ServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const services: Service[] = servicesData;


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

  return (
    <>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>💡 Servizi di sviluppo web full-stack — Alina Galben</title>
        <meta 
          name="description" 
          content="Siti, app, chatbot e soluzioni digitali su misura. Scopri tutti i servizi offerti da Alina Galben, Web Developer Full-Stack." 
        />
        <meta name="keywords" content="sviluppo web, React, Node.js, chatbot, AI, full-stack developer, frontend, backend, UI/UX design" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="💡 Servizi di sviluppo web full-stack — Alina Galben" />
        <meta property="og:description" content="Siti, app, chatbot e soluzioni digitali su misura. Scopri tutti i servizi offerti da Alina Galben." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="/servizi" />
      </Helmet>

      <section className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <SectionTitle
            emoji="💡"
            title="I Miei Servizi"
            subtitle="Soluzioni digitali complete per trasformare le tue idee in realtà. Dallo sviluppo web full-stack alle automazioni intelligenti, offro servizi personalizzati con le tecnologie più moderne."
            className="pt-8"
          />

          {/* Services Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
          >
            <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
              <div className="text-3xl font-bold text-purple-600 mb-2">{services.length}+</div>
              <div className="text-gray-600 text-sm font-medium">Servizi Specializzati</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
              <div className="text-3xl font-bold text-pink-600 mb-2">10+</div>
              <div className="text-gray-600 text-sm font-medium">Progetti Completati</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
              <div className="text-3xl font-bold text-red-600 mb-2">100%</div>
              <div className="text-gray-600 text-sm font-medium">Dedizione e assistenza</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
              <div className="text-3xl font-bold text-red-600 mb-2">Disponibile</div>
              <div className="text-gray-600 text-sm font-medium">Per collaborazioni e richieste</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
              <div className="text-3xl font-bold text-red-600 mb-2">Sempre</div>
              <div className="text-gray-600 text-sm font-medium">Disponibile per nuovi progetti</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
              <div className="text-3xl font-bold text-red-600 mb-2">On Demand</div>
              <div className="text-gray-600 text-sm font-medium">Supporto su richiesta</div>
            </div>
          </motion.div>

          {/* Services Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-16"
          >
            {services.map((service) => (
              <motion.div
                key={service.id}
                variants={cardVariants}
              >
                <ServiceCard {...service} />
              </motion.div>
            ))}
          </motion.div>

          {/* Call-to-Action Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-linear-to-r from-purple-600 via-pink-600 to-red-600 rounded-2xl p-8 md:p-12 text-center text-white mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Pronto a trasformare la tua idea in realtà?
            </h2>
            <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Contattami per una consulenza gratuita e scopri come posso aiutarti a raggiungere i tuoi obiettivi digitali.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/contact')}
              className="bg-white text-purple-600 font-bold py-4 px-8 rounded-xl hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/30"
            >
              Inizia il tuo progetto
            </motion.button>
          </motion.div>

          {/* Technology Stack */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="text-center pb-16"
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-10">Tecnologie che utilizzo</h3>
            <div className="flex flex-wrap justify-center gap-6">
              {[
                'React', 'Node.js', 'TypeScript', 'MongoDB', 'Express',
                'TailwindCSS', 'Vite', 'Framer Motion', 'Lucide React', 'Contentful'
              ].map((tech, index) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 1.2 + index * 0.1 }}
                  className="bg-white px-6 py-3 rounded-full text-lg font-medium text-gray-700 shadow-sm border border-gray-200 hover:shadow-md hover:scale-105 transition-all duration-200"
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default ServicesPage;