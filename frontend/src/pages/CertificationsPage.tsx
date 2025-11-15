import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Award, BookOpen, ArrowRight, Mail, Download } from 'lucide-react';
import CertificationCard from '../components/CertificationCard';
import CourseCard from '../components/CourseCard';
import SectionTitle from '../components/SectionTitle';
import certificationsData from '../data/certifications.json';
import coursesData from '../data/courses.json';

interface Certification {
  id: number;
  icon: string;
  title: string;
  date: string;
  institution: string;
  description: string;
  file: string;
}

interface Course {
  id: number;
  icon: string;
  title: string;
  institution: string;
  duration: string;
  description: string;
  certificate: string;
}

const CertificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const certifications: Certification[] = certificationsData;
  const courses: Course[] = coursesData;

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const handleRequestAllCertificates = () => {
    // Naviga direttamente alla pagina contatti
    navigate('/contact');
  };

  return (
    <>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>📜 Certificazioni & Formazione — Alina Galben Web Developer</title>
        <meta 
          name="description" 
          content="Tutti i certificati e i corsi di formazione completati da Alina Galben: HTML, CSS, JavaScript, React, Node.js, API e sviluppo full-stack." 
        />
        <meta name="keywords" content="certificazioni web developer, corso Epicode, HTML CSS JavaScript, React Node.js, full stack developer, formazione programmazione" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="📜 Certificazioni & Formazione — Alina Galben" />
        <meta property="og:description" content="Il percorso formativo e le certificazioni professionali di Alina Galben come Full Stack Web Developer." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="/certificazioni" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <SectionTitle
            emoji="📜"
            title="Certificazioni & Formazione"
            subtitle="Un percorso di apprendimento continuo, costruito con passione e curiosità per le tecnologie web moderne."
            className="pt-8"
          />

          {/* Overview Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
          >
            <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
              <div className="text-3xl font-bold text-violet-600 mb-2">{certifications.length}</div>
              <div className="text-gray-600 text-sm font-medium">Certificazioni Conseguite</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
              <div className="text-3xl font-bold text-blue-600 mb-2">{courses.length}</div>
              <div className="text-gray-600 text-sm font-medium">Corsi di Formazione</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
              <div className="text-3xl font-bold text-green-600 mb-2">2024-2025</div>
              <div className="text-gray-600 text-sm font-medium">Periodo di Studio</div>
            </div>
          </motion.div>

          {/* Certifications Section */}
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
                className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-violet-500 to-rose-500 rounded-2xl mb-6"
              >
                <Award className="w-8 h-8 text-white" />
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">🏆 Certificazioni Professionali</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Certificati ufficiali che attestano le competenze acquisite durante il percorso di formazione Full Stack Web Developer.
              </p>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
            >
              {certifications.map((certification) => (
                <motion.div key={certification.id} variants={cardVariants}>
                  <CertificationCard {...certification} />
                </motion.div>
              ))}
            </motion.div>

            {/* Request All Certificates CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRequestAllCertificates}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-violet-600 to-rose-500 text-white font-semibold rounded-xl hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-violet-500/30 text-lg"
              >
                <Mail className="w-6 h-6 mr-3" />
                Richiedi tutti i PDF via Email
                <ArrowRight className="w-6 h-6 ml-3" />
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Courses Section */}
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
                className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl mb-8"
              >
                <BookOpen className="w-10 h-10 text-white" />
              </motion.div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">🎓 Formazione & Corsi</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Percorsi formativi, corsi specialistici e apprendimento continuo per rimanere sempre aggiornata sulle ultime tecnologie.
              </p>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              {courses.map((course) => (
                <motion.div key={course.id} variants={cardVariants}>
                  <CourseCard {...course} />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Call-to-Action Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 rounded-2xl p-10 md:p-12 text-center text-white mb-16"
          >
            <h2 className="text-4xl md:text-4xl font-bold mb-6">
              Interessato alle mie competenze?
            </h2>
            <p className="text-xl md:text-xl opacity-90 mb-10 max-w-2xl mx-auto">
              Ogni certificazione rappresenta ore di studio, progetti pratici e competenze concrete. Parliamo di come posso aiutarti!
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/projects')}
                className="inline-flex items-center bg-white text-violet-600 font-bold py-5 px-10 rounded-xl hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/30 text-lg"
              >
                Vedi i miei progetti
                <ArrowRight className="ml-3 w-6 h-6" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/contact')}
                className="inline-flex items-center bg-transparent border-2 border-white text-white font-bold py-5 px-10 rounded-xl hover:bg-white hover:text-violet-600 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/30 text-lg"
              >
                <Mail className="mr-3 w-6 h-6" />
                Contattami
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default CertificationsPage;