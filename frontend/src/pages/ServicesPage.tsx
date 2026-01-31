import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import ServiceCard from '../components/ServiceCard';
import SectionTitle from '../components/SectionTitle';
import servicesData from '../data/services.json';
import ElegantStatCard from '../components/ElegantStatCard';
import CtaSection from '../components/common/CtaSection';
import { Users, Headphones, Heart } from 'lucide-react';

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

      <section className="min-h-screen bg-[#f6f3ee] pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            emoji="💡"
            title="I Miei Servizi"
            subtitle="Soluzioni digitali complete per trasformare le tue idee in realtà. Dallo sviluppo web full-stack alle automazioni intelligenti, offro servizi personalizzati con le tecnologie più moderne."
            className="pt-8"
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
          >
            
            
            <ElegantStatCard value="100%" label="Dedizione e assistenza" color="pink" icon={<Heart className="w-6 h-6" />} />
            <ElegantStatCard value="Disponibile" label="Per collaborazioni e nuovi progetti" color="yellow" icon={<Users className="w-6 h-6" />} />
            
            <ElegantStatCard value="On Demand" label="Supporto su richiesta" color="red" icon={<Headphones className="w-6 h-6" />} />
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12"
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

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="text-center pb-4"
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

          <CtaSection
            id="services-cta"
            title="Pronto a trasformare la tua idea in realtà?"
            description="Contattami per una consulenza gratuita"
            gradient="from-violet-600 via-purple-600 to-blue-600"
            actions={[
              {
                label: 'Inizia il tuo progetto',
                onClick: () => navigate('/contact'),
                className: 'py-4 px-8 rounded-xl bg-white text-purple-600 hover:shadow-xl transition-all duration-300 text-lg',
              },
            ]}
          />
        </div>
      </section>
    </>
  );
};

export default ServicesPage;