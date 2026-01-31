import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, Variants } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Award, BookOpen, ArrowRight, Mail, CalendarRange, LucideIcon } from 'lucide-react';
import CertificationCard from '../components/CertificationCard';
import CourseCard from '../components/CourseCard';
import SectionTitle from '../components/SectionTitle';
import ElegantStatCard from '../components/ElegantStatCard';
import CtaSection from '../components/common/CtaSection';
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

interface StatMetric {
  id: string;
  value: string | number;
  label: string;
  color: 'violet' | 'blue' | 'green';
  Icon: LucideIcon;
}

const ANIMATION_VARIANTS: Record<string, Variants> = {
  container: {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.1, delayChildren: 0.3 } 
    }
  },
  card: {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { type: "spring", stiffness: 100, damping: 12, duration: 0.6 } 
    }
  },
  section: {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: "easeInOut" } 
    }
  }
};

const SEO_METADATA = {
  title: "📜 Certificazioni & Formazione — Alina Galben Web Developer",
  description: "Tutti i certificati e i corsi di formazione completati da Alina Galben: HTML, CSS, JavaScript, React, Node.js, API e sviluppo full-stack.",
  keywords: "certificazioni web developer, corso Epicode, HTML CSS JavaScript, React Node.js, full stack developer, formazione programmazione",
  ogTitle: "📜 Certificazioni & Formazione — Alina Galben",
  ogDesc: "Il percorso formativo e le certificazioni professionali di Alina Galben come Full Stack Web Developer."
};

const CertificationsPage: React.FC = () => {
  const navigate = useNavigate();

  const certifications = certificationsData as Certification[];
  const courses = coursesData as Course[];

  const statsMetrics: StatMetric[] = useMemo(() => [
    { id: 'certs', value: certifications.length, label: "Certificazioni Conseguite", color: "violet", Icon: Award },
    { id: 'courses', value: courses.length, label: "Corsi di Formazione", color: "blue", Icon: BookOpen },
    { id: 'period', value: "2024-2025", label: "Periodo di Studio", color: "green", Icon: CalendarRange }
  ], [certifications.length, courses.length]);

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
        <link rel="canonical" href="/certificazioni" />
      </Helmet>

      <div className="min-h-screen bg-[#f6f3ee] pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <SectionTitle
            emoji="📜"
            title="Certificazioni & Formazione"
            subtitle="Un percorso di apprendimento continuo, costruito con passione e curiosità per le tecnologie web moderne."
            className="pt-8"
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
          >
            {statsMetrics.map(({ id, value, label, color, Icon }) => (
              <ElegantStatCard 
                key={id}
                value={value} 
                label={label} 
                color={color} 
                icon={<Icon className="w-6 h-6" />} 
              />
            ))}
          </motion.div>

          <motion.section
            variants={ANIMATION_VARIANTS.section}
            initial="hidden"
            animate="visible"
            className="mb-20"
          >
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-r from-violet-500 to-rose-500 rounded-2xl mb-6 shadow-lg shadow-violet-500/20"
              >
                <Award className="w-8 h-8 text-white" />
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">🏆 Certificazioni Professionali</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Certificati ufficiali che attestano le competenze acquisite durante il percorso di formazione Full Stack Web Developer.
              </p>
            </div>

            <motion.div
              variants={ANIMATION_VARIANTS.container}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
            >
              {certifications.map((cert) => (
                <motion.div key={cert.id} variants={ANIMATION_VARIANTS.card}>
                  <CertificationCard {...cert} />
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/contact')}
                className="inline-flex items-center px-8 py-4 bg-linear-to-r from-violet-600 to-rose-500 text-white font-semibold rounded-xl hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-violet-500/30 text-lg"
              >
                <Mail className="w-6 h-6 mr-3" />
                Richiedi tutti i PDF via Email
                <ArrowRight className="w-6 h-6 ml-3" />
              </motion.button>
            </motion.div>
          </motion.section>

          <motion.section
            variants={ANIMATION_VARIANTS.section}
            initial="hidden"
            animate="visible"
            className="mb-8"
          >
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-r from-blue-500 to-cyan-500 rounded-2xl mb-8 shadow-lg shadow-blue-500/20"
              >
                <BookOpen className="w-10 h-10 text-white" />
              </motion.div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">🎓 Formazione & Corsi</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Percorsi formativi, corsi specialistici e apprendimento continuo per rimanere sempre aggiornata sulle ultime tecnologie.
              </p>
            </div>

            <motion.div
              variants={ANIMATION_VARIANTS.container}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              {courses.map((course) => (
                <motion.div key={course.id} variants={ANIMATION_VARIANTS.card}>
                  <CourseCard {...course} />
                </motion.div>
              ))}
            </motion.div>
          </motion.section>

          <CtaSection
            id="cetification-cta"
            title="Interessato alle mie competenze?"
            description="Ogni certificazione rappresenta ore di studio, progetti pratici e competenze concrete. Parliamo di come posso aiutarti!"
            gradient="from-violet-600 via-purple-600 to-blue-600"
            actions={[
              {
                label: 'Esplora i progetti',
                onClick: () => navigate('/projects'),
                icon: ArrowRight,
                className:
                  'px-7 py-4 rounded-full bg-white text-violet-700 border-2 border-white hover:bg-violet-50 transition-all shadow-sm',
              },
              {
                label: 'Contattami',
                onClick: () => navigate('/contact'),
                icon: Mail,
                className:
                  'px-7 py-4 rounded-full bg-white/20 text-white border-2 border-white hover:bg-white/30 transition-all shadow-sm',
              },
            ]}
          />


        </div>
      </div>
    </>
  );
};

export default React.memo(CertificationsPage);