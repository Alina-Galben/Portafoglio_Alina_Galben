import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { RefreshCw, Calendar, Zap, AlertCircle, Wifi, WifiOff, Briefcase } from 'lucide-react';
import { fetchProjects } from '../contentfulClient';
import useSSE from '../hooks/useSSE';
import ProjectCard from '../components/ProjectCard';
import SectionTitle from '../components/SectionTitle';

// Tipo per i progetti direttamente da Contentful
interface ContentfulProject {
  sys: {
    id: string;
    createdAt: string;
    updatedAt: string;
  };
  fields: {
    title: string;
    description: any; // Rich text object
    technologies: string[];
    gitHubUrl?: string;
    liveDemoUr?: string;
    coverImage?: {
      fields: {
        file: {
          url: string;
        };
        title?: string;
      };
    };
    featured?: boolean;
    order?: number;
  };
}

const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<ContentfulProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [updateNotification, setUpdateNotification] = useState<string | null>(null);

  // Configurazione SSE per aggiornamenti in tempo reale
  const apiBaseUrl = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:3001';
  const { isConnected, lastEvent } = useSSE(`${apiBaseUrl}/api/events`, {
    onMessage: (data: any) => {
      if (data.topic === 'project-updated') {
        console.log('🔄 Projects updated via SSE, refreshing...');
        handleRefresh(true); // Auto-refresh silenzioso
        setUpdateNotification('Progetti aggiornati ✅');
        setTimeout(() => setUpdateNotification(null), 3000);
      }
    },
    onError: (error: any) => {
      console.warn('⚠️ SSE connection error:', error);
    }
  });

  // Fetch dei progetti da Contentful
  const loadProjects = async (silent = false) => {
    try {
      if (!silent) {
        setLoading(true);
        setError(null);
      }
      
      const fetchedProjects = await fetchProjects();
      setProjects(fetchedProjects);
      setLastUpdate(new Date());
      
      if (!silent) {
        setLoading(false);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Errore sconosciuto';
      setError(errorMessage);
      setLoading(false);
      console.error('❌ Error loading projects:', err);
    }
  };

  // Refresh manuale
  const handleRefresh = async (silent = false) => {
    if (!silent) {
      setIsRefreshing(true);
    }
    
    await loadProjects(silent);
    
    if (!silent) {
      setIsRefreshing(false);
    }
  };

  // Auto-fetch ogni 60 secondi e fetch iniziale
  useEffect(() => {
    loadProjects();
    
    const interval = setInterval(() => {
      console.log('🔄 Auto-refreshing projects...');
      loadProjects(true); // Refresh silenzioso
    }, 60000); // 60 secondi

    return () => clearInterval(interval);
  }, []);

  // Animazioni
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12
      }
    }
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>💼 Portfolio Progetti — Alina Galben</title>
          <meta name="description" content="Scopri i progetti realizzati da Alina Galben: applicazioni web moderne, dashboard interattive e soluzioni full-stack con React, Node.js e tecnologie all'avanguardia." />
        </Helmet>
        
        <div className="min-h-screen bg-gray-50 pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle
              emoji="💼"
              title="I Miei Progetti"
              subtitle="Una raccolta dei progetti che ho sviluppato utilizzando tecnologie moderne come React, Node.js, MongoDB e molto altro."
              className="pt-8"
            />
            
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-20 h-20 mx-auto mb-8"
                >
                  <div className="w-full h-full bg-linear-to-r from-purple-500 to-pink-500 rounded-2xl p-0.5">
                    <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center">
                      <Briefcase className="w-10 h-10 text-purple-600" />
                    </div>
                  </div>
                </motion.div>
                <p className="text-gray-600 text-xl font-medium">Caricamento progetti...</p>
                <p className="text-gray-400 text-lg mt-3">Connessione a Contentful in corso</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Helmet>
          <title>💼 Portfolio Progetti — Alina Galben</title>
          <meta name="description" content="Scopri i progetti realizzati da Alina Galben: applicazioni web moderne, dashboard interattive e soluzioni full-stack." />
        </Helmet>
        
        <div className="min-h-screen bg-gray-50 pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle
              emoji="💼"
              title="I Miei Progetti"
              subtitle="Errore nel caricamento dei progetti da Contentful"
              className="pt-8"
            />
            
            <div className="flex items-center justify-center py-20">
              <div className="text-center max-w-md">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="w-24 h-24 mx-auto mb-8"
                >
                  <div className="w-full h-full bg-linear-to-r from-red-500 to-pink-500 rounded-2xl p-0.5">
                    <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center">
                      <AlertCircle className="w-12 h-12 text-red-500" />
                    </div>
                  </div>
                </motion.div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Ops! Qualcosa è andato storto</h3>
                <p className="text-red-600 text-lg mb-8 bg-red-50 p-4 rounded-xl border border-red-200">{error}</p>
                
                <button
                  onClick={() => handleRefresh()}
                  disabled={isRefreshing}
                  className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-semibold rounded-xl text-white bg-linear-to-r from-purple-600 to-pink-600 hover:shadow-lg hover:shadow-purple-500/25 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  {isRefreshing ? (
                    <RefreshCw className="animate-spin -ml-1 mr-3 h-5 w-5" />
                  ) : (
                    <RefreshCw className="-ml-1 mr-3 h-5 w-5" />
                  )}
                  {isRefreshing ? 'Ricaricamento...' : 'Riprova ora'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>💼 Portfolio Progetti — Alina Galben</title>
        <meta name="description" content="Scopri i progetti realizzati da Alina Galben: applicazioni web moderne, dashboard interattive e soluzioni full-stack con React, Node.js e tecnologie all'avanguardia." />
        <meta name="keywords" content="portfolio progetti, React, Node.js, MongoDB, full-stack developer, web development, dashboard, applicazioni web" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="💼 Portfolio Progetti — Alina Galben" />
        <meta property="og:description" content="Scopri i progetti realizzati da Alina Galben: applicazioni web moderne e soluzioni full-stack." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="/progetti" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <SectionTitle
            emoji="💼"
            title="I Miei Progetti"
            subtitle="Una raccolta dei progetti che ho sviluppato utilizzando tecnologie moderne come React, Node.js, MongoDB e molto altro. Ogni progetto rappresenta una sfida superata e una soluzione innovativa."
            className="pt-8"
          />

          {/* Projects Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
          >
            <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
              <div className="text-3xl font-bold text-purple-600 mb-2">{projects.length}</div>
              <div className="text-gray-600 text-sm font-medium">Progetti Totali</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
              <div className="text-3xl font-bold text-pink-600 mb-2">{projects.filter(p => p.fields.featured).length}</div>
              <div className="text-gray-600 text-sm font-medium">Progetti in Evidenza</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
              <div className="text-3xl font-bold text-red-600 mb-2">
                {Array.from(new Set(projects.flatMap(p => p.fields.technologies || []))).length}
              </div>
              <div className="text-gray-600 text-sm font-medium">Tecnologie Utilizzate</div>
            </div>
          </motion.div>

          {/* Notification */}
          <AnimatePresence>
            {updateNotification && (
              <motion.div
                initial={{ opacity: 0, y: -50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -50, scale: 0.9 }}
                className="fixed top-20 right-4 z-30 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2"
              >
                <Zap className="h-5 w-5" />
                <span>{updateNotification}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Projects Grid */}
          {projects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center py-20"
            >
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-8">
                  <div className="w-full h-full bg-linear-to-r from-gray-400 to-gray-500 rounded-2xl p-0.5">
                    <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center">
                      <Briefcase className="w-12 h-12 text-gray-400" />
                    </div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Nessun progetto trovato</h3>
                <p className="text-gray-500 text-lg mb-3">I progetti verranno caricati automaticamente da Contentful.</p>
                <p className="text-gray-400 text-lg">Controlla la connessione e riprova.</p>
              </div>
            </motion.div>
          ) : (
            <>
              {/* Featured Projects First */}
              {projects.filter(p => p.fields.featured).length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="mb-12"
                >
                  <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                    🌟 Progetti in Evidenza
                  </h2>
                  <motion.div 
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8"
                  >
                    {projects
                      .filter(p => p.fields.featured)
                      .map((project) => (
                        <motion.div
                          key={project.sys.id}
                          variants={cardVariants}
                          className="relative"
                        >
                          <div className="absolute -top-3 -right-3 z-10">
                            <div className="bg-linear-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                              ⭐ Featured
                            </div>
                          </div>
                          <ProjectCard project={project} />
                        </motion.div>
                      ))}
                  </motion.div>
                </motion.div>
              )}

              {/* All Projects */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="mb-8"
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                  📁 Tutti i Progetti
                </h2>
                <motion.div 
                  initial="hidden"
                  animate="visible"
                  variants={containerVariants}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12"
                >
                  {projects.map((project) => (
                    <motion.div
                      key={project.sys.id}
                      variants={cardVariants}
                    >
                      <ProjectCard project={project} />
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>

              {/* Status Bar - Moved after all projects */}
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="flex flex-col sm:flex-row items-center justify-between mb-12 p-3 sm:p-4 bg-white rounded-lg shadow-sm border border-gray-100"
              >
                <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                  <div className="flex items-center space-x-2">
                    <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                    {isConnected ? (
                      <Wifi className="h-4 w-4 text-green-600" />
                    ) : (
                      <WifiOff className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-sm text-gray-600">
                      {isConnected ? 'Live Updates' : 'Disconnected'}
                    </span>
                  </div>
                  {lastUpdate && (
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>Aggiornato: {lastUpdate.toLocaleTimeString()}</span>
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => handleRefresh()}
                  disabled={isRefreshing}
                  className="mt-2 sm:mt-0 inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 w-full sm:w-auto justify-center sm:justify-start"
                >
                  <RefreshCw className={`h-4 w-4 mr-1.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Aggiorna
                </button>
              </motion.div>

              {/* Call-to-Action Section */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="bg-linear-to-r from-purple-600 via-pink-600 to-red-600 rounded-2xl p-10 md:p-16 text-center text-white mb-16"
              >
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Ti piace quello che vedi?
                </h2>
                <p className="text-xl md:text-2xl opacity-90 mb-10 max-w-2xl mx-auto">
                  Questi sono solo alcuni dei progetti che ho realizzato. Contattami per discutere del tuo prossimo progetto!
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/contact')}
                  className="bg-white text-purple-600 font-bold py-5 px-10 rounded-xl hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/30 text-lg"
                >
                  Iniziamo a collaborare
                </motion.button>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ProjectsPage;