import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { format, parseISO, startOfMonth, eachMonthOfInterval, subMonths } from 'date-fns';
import { it } from 'date-fns/locale';
import { 
  BookOpen, 
  FolderOpen, 
  Award, 
  Target, 
  TrendingUp, 
  Calendar,
  Tag,
  Clock,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import useSWR from 'swr';
import { toast } from 'react-hot-toast';

import StatCard from '../components/StatCard';
import StatChart from '../components/StatChart';
import LegendPill from '../components/LegendPill';
import SectionTitle from '../components/SectionTitle';
import { useSSE } from '../hooks/useSSE';

// Import local data
import certificationsData from '../data/certifications.json';
import coursesData from '../data/courses.json';
import personalGoalsData from '../data/personalGoals.json';
import servicesData from '../data/services.json';
import technicalSkillsData from '../data/technicalSkills.json';

interface BlogPost {
  sys: { id: string; createdAt: string; updatedAt: string };
  fields: {
    title: string;
    slug: string;
    date: string;
    tags?: string[];
    status: string;
  };
}

interface Project {
  sys: { id: string; createdAt: string; updatedAt: string };
  fields: {
    title: string;
    description: string;
    technologies?: string[];
    coverImage?: any;
    gitHubURL?: string;
    liveDemoURL?: string;
    featured?: boolean;
    order?: number;
  };
}

const StatisticsPage: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState<'7d' | '1m' | '6m' | 'all'>('all');
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetcher functions for SWR
  const fetcher = (url: string) => fetch(url).then(res => res.json());

  // Fetch blog posts
  const { data: blogPostsData, mutate: mutateBlogPosts } = useSWR(
    '/api/blog',
    fetcher,
    {
      refreshInterval: 60000,
      revalidateOnFocus: true
    }
  );

  // Fetch projects
  const { data: projectsData, mutate: mutateProjects } = useSWR(
    '/api/projects',
    fetcher,
    {
      refreshInterval: 60000,
      revalidateOnFocus: true
    }
  );

  // SSE for real-time updates
  useSSE('/api/events', (event: any) => {
    if (event.type === 'stats-updated') {
      mutateBlogPosts();
      mutateProjects();
      setLastUpdate(new Date());
      toast.success('✅ Statistiche aggiornate', {
        duration: 3000,
        position: 'top-right'
      });
    }
  });

  // Process blog posts data
  const blogPosts: BlogPost[] = blogPostsData?.items || [];
  const projects: Project[] = projectsData?.items || [];

  // Calculate statistics
  const stats = {
    articles: blogPosts.length,
    projects: projects.length,
    certifications: certificationsData.length,
    courses: coursesData.length,
    goals: personalGoalsData.filter(goal => goal.achieved).length,
    totalGoals: personalGoalsData.length,
    services: servicesData.length,
    skills: technicalSkillsData.length
  };

  // Calculate training hours (estimated)
  const trainingHours = certificationsData.length * 40 + coursesData.length * 20;

  // Process tags from blog posts
  const tagFrequency = blogPosts.reduce((acc, post) => {
    if (post.fields.tags) {
      post.fields.tags.forEach(tag => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
    }
    return acc;
  }, {} as Record<string, number>);

  const topTags = Object.entries(tagFrequency)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 8)
    .map(([name, value]) => ({ name, value }));

  // Process publication timeline
  const getTimelineData = () => {
    const now = new Date();
    let startDate: Date;

    switch (timeFilter) {
      case '7d':
        startDate = subMonths(now, 0);
        break;
      case '1m':
        startDate = subMonths(now, 1);
        break;
      case '6m':
        startDate = subMonths(now, 6);
        break;
      default:
        startDate = subMonths(now, 12);
    }

    const months = eachMonthOfInterval({ start: startDate, end: now });
    
    return months.map(month => {
      const monthStr = format(month, 'yyyy-MM');
      const articlesCount = blogPosts.filter(post => 
        format(parseISO(post.fields.date), 'yyyy-MM') === monthStr
      ).length;
      
      return {
        name: format(month, 'MMM yyyy', { locale: it }),
        articles: articlesCount,
        month: monthStr
      };
    });
  };

  const timelineData = getTimelineData();

  // Process technology usage from projects
  const techUsage = projects.reduce((acc, project) => {
    if (project.fields.technologies) {
      project.fields.technologies.forEach(tech => {
        acc[tech] = (acc[tech] || 0) + 1;
      });
    }
    return acc;
  }, {} as Record<string, number>);

  const topTechnologies = Object.entries(techUsage)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 6)
    .map(([name, value]) => ({ name, value }));

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
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>📈 Statistiche Personali & Crescita Professionale — Alina Galben Web Developer</title>
        <meta 
          name="description" 
          content="Progetti, articoli, formazione e crescita tecnica di Alina Galben. Una dashboard dinamica con dati da Contentful e JSON locali." 
        />
        <meta name="keywords" content="statistiche sviluppatore, crescita professionale, portfolio dati, analytics web developer, trend progetti" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="📈 Statistiche & Crescita Professionale — Alina Galben" />
        <meta property="og:description" content="Dashboard dinamica che mostra la crescita professionale e i risultati di Alina Galben come Full Stack Developer." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="/statistiche" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <SectionTitle
            emoji="📈"
            title="Statistiche & Crescita Professionale"
            subtitle="Un percorso fatto di codice, passione e apprendimento continuo: qui trovi numeri e trend che raccontano la mia crescita professionale."
            className="pt-8"
          />

          {/* Last Update Info - Moved to bottom */}

          {/* Main Stats Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            <motion.div variants={cardVariants} className="h-full">
              <StatCard
                icon="BookOpen"
                title="Articoli Pubblicati"
                value={stats.articles}
                description="Articoli tecnici su blog e piattaforme"
                gradient="from-blue-500 to-cyan-500"
                onClick={() => window.location.href = '/blog'}
              />
            </motion.div>

            <motion.div variants={cardVariants} className="h-full">
              <StatCard
                icon="FolderOpen"
                title="Progetti Completati"
                value={stats.projects}
                description="Progetti full-stack e applicazioni web"
                gradient="from-violet-500 to-purple-600"
                onClick={() => window.location.href = '/projects'}
              />
            </motion.div>

            <motion.div variants={cardVariants} className="h-full">
              <StatCard
                icon="Award"
                title="Certificazioni"
                value={stats.certifications}
                description="Certificati professionali conseguiti"
                gradient="from-green-500 to-emerald-600"
                onClick={() => window.location.href = '/certifications'}
              />
            </motion.div>

            <motion.div variants={cardVariants} className="h-full">
              <StatCard
                icon="Target"
                title="Obiettivi Raggiunti"
                value={stats.goals}
                suffix={`/${stats.totalGoals}`}
                description="Milestone personali e professionali"
                gradient="from-orange-500 to-red-500"
              />
            </motion.div>
          </motion.div>

          {/* Secondary Stats */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            <motion.div variants={cardVariants} className="h-full">
              <StatCard
                icon="Clock"
                title="Ore di Formazione"
                value={trainingHours}
                suffix="+"
                description="Stima ore di studio e certificazioni"
                gradient="from-purple-500 to-pink-500"
              />
            </motion.div>

            <motion.div variants={cardVariants} className="h-full">
              <StatCard
                icon="TrendingUp"
                title="Servizi Offerti"
                value={stats.services}
                description="Servizi professionali disponibili"
                gradient="from-yellow-500 to-orange-500"
                onClick={() => window.location.href = '/servizi'}
              />
            </motion.div>

            <motion.div variants={cardVariants} className="h-full">
              <StatCard
                icon="BookOpen"
                title="Competenze Tecniche"
                value={stats.skills}
                description="Tecnologie e framework padroneggiati"
                gradient="from-indigo-500 to-blue-500"
                onClick={() => window.location.href = '/competenze'}
              />
            </motion.div>
          </motion.div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Publication Timeline */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="min-h-[400px]"
            >
              <StatChart
                type="area"
                data={timelineData}
                title="📅 Timeline Pubblicazioni"
                description="Trend delle pubblicazioni nel tempo"
                dataKey="articles"
                xAxisKey="name"
                colors={['#8b5cf6']}
                height={300}
              />
            </motion.div>

            {/* Top Technologies */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="min-h-[400px]"
            >
              <StatChart
                type="bar"
                data={topTechnologies}
                title="🔧 Tecnologie Più Usate"
                description="Distribuzione tecnologie nei progetti"
                dataKey="value"
                xAxisKey="name"
                colors={['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#f97316']}
                height={300}
              />
            </motion.div>
          </div>

          {/* Tags Section */}
          {topTags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-12"
            >
              <div className="flex items-center space-x-3 mb-6">
                <Tag className="w-6 h-6 text-violet-600" />
                <h2 className="text-2xl font-bold text-gray-900">🏷️ Argomenti Più Trattati</h2>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {topTags.map((tag, index) => (
                  <LegendPill
                    key={tag.name}
                    label={tag.name}
                    count={tag.value}
                    color={['violet', 'blue', 'green', 'yellow', 'red', 'purple', 'pink', 'orange'][index % 8] as any}
                    onClick={() => window.location.href = `/blog?tag=${encodeURIComponent(tag.name)}`}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Last Update Info - Above CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 py-3 sm:py-4 bg-white border border-gray-200 rounded-lg p-3 sm:p-4 mb-12"
          >
            <div className="flex items-center space-x-2 sm:space-x-3">
              <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              <span className="text-xs sm:text-sm text-gray-600">
                Ultimo aggiornamento: {format(lastUpdate, 'dd/MM/yyyy HH:mm', { locale: it })}
              </span>
            </div>
            
            {/* Time Filter */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              <span className="text-xs sm:text-sm text-gray-600">Periodo:</span>
              {(['7d', '1m', '6m', 'all'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setTimeFilter(filter)}
                  className={`px-2 sm:px-3 py-0.5 sm:py-1 text-xs rounded-full transition-colors ${
                    timeFilter === filter
                      ? 'bg-violet-100 text-violet-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {filter === '7d' && 'Ultimi 7gg'}
                  {filter === '1m' && 'Ultimo mese'}
                  {filter === '6m' && 'Ultimi 6 mesi'}
                  {filter === 'all' && 'Tutto'}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="bg-linear-to-r from-violet-600 via-purple-600 to-blue-600 rounded-2xl p-8 md:p-12 text-center text-white mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Crescita continua, risultati concreti
            </h2>
            <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Ogni numero racconta una storia di dedizione, apprendimento e passione per lo sviluppo web. Scopri di più sui miei progetti!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/projects'}
                className="inline-flex items-center bg-white text-violet-600 font-bold py-4 px-8 rounded-xl hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/30"
              >
                Esplora i progetti
                <ArrowRight className="ml-2 w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/contact'}
                className="inline-flex items-center bg-transparent border-2 border-white text-white font-bold py-4 px-8 rounded-xl hover:bg-white hover:text-violet-600 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/30"
              >
                Parliamone insieme
                <ArrowRight className="ml-2 w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default StatisticsPage;