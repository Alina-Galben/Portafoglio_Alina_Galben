import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Search, Filter, SortAsc, RefreshCw, Calendar, User, Hash, ArrowRight, X, ChevronDown } from 'lucide-react';
import useSWR from 'swr';
import { toast } from 'react-hot-toast';
import { useSSE } from '../hooks/useSSE';
import SectionTitle from '../components/SectionTitle';

interface BlogPost {
  sys: {
    id: string;
    createdAt: string;
    updatedAt: string;
  };
  fields: {
    title: string;
    slug: string;
    date: string;
    tags?: string[];
    author?: string;
    coverImage?: {
      fields: {
        file: {
          url: string;
        };
        title: string;
      };
    };
    description?: string;
    content: any;
    status: string;
  };
}

const BlogPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'a-z' | 'z-a'>('newest');
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isTagsDropdownOpen, setIsTagsDropdownOpen] = useState(false);

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetcher for SWR
  const fetcher = (url: string) => fetch(url).then(res => res.json());

  // Fetch blog posts from Contentful
  const { data, error, isLoading, mutate } = useSWR(
    '/api/contentful/entries?content_type=blogPost&fields.status=Published&order=-fields.date',
    fetcher,
    {
      refreshInterval: 60000,
      revalidateOnFocus: true,
      revalidateOnReconnect: true
    }
  );

  // SSE for real-time updates
  useSSE('/api/events', (event: any) => {
    if (event.type === 'blog-updated') {
      mutate();
      setLastUpdate(new Date());
      toast.success('✅ Blog Post aggiornati', {
        duration: 3000,
        position: 'top-right'
      });
    }
  });

  const posts: BlogPost[] = data?.items || [];

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    posts.forEach(post => {
      if (post.fields.tags) {
        post.fields.tags.forEach(tag => tagSet.add(tag));
      }
    });
    return Array.from(tagSet).sort();
  }, [posts]);

  // Filter and sort posts
  const filteredAndSortedPosts = useMemo(() => {
    let filtered = posts;

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(post => 
        post.fields.title.toLowerCase().includes(searchLower) ||
        post.fields.description?.toLowerCase().includes(searchLower) ||
        post.fields.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(post =>
        post.fields.tags?.some(tag => selectedTags.includes(tag))
      );
    }

    // Sort posts
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.fields.date).getTime() - new Date(a.fields.date).getTime();
        case 'oldest':
          return new Date(a.fields.date).getTime() - new Date(b.fields.date).getTime();
        case 'a-z':
          return a.fields.title.localeCompare(b.fields.title);
        case 'z-a':
          return b.fields.title.localeCompare(a.fields.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [posts, searchTerm, selectedTags, sortBy]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedTags([]);
    setSortBy('newest');
  };

  const handleRefresh = () => {
    mutate();
    setLastUpdate(new Date());
  };

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
        <title>📝 Blog Tecnico & Insights — Alina Galben Web Developer</title>
        <meta 
          name="description" 
          content="Articoli tecnici, tutorial e insights sullo sviluppo web da Alina Galben. React, Node.js, JavaScript e tecnologie moderne." 
        />
        <meta name="keywords" content="blog sviluppo web, tutorial React, JavaScript, Node.js, frontend, backend, web developer" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="📝 Blog Tecnico — Alina Galben" />
        <meta property="og:description" content="Articoli tecnici e insights sullo sviluppo web moderno da Alina Galben." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="/blog" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 pt-16">
        <section className="min-h-screen bg-gray-50 pt-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Page Header */}
          <SectionTitle
            emoji="📝"
            title="Blog Tecnico & Insights"
            subtitle="Articoli, tutorial e riflessioni sul mondo dello sviluppo web moderno. Aggiornamenti in tempo reale da Contentful."
            className="pt-8"
          />

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-5 mb-8"
          >
            {/* Search Bar */}
            <div className="relative mb-4 sm:mb-5">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Cerca un articolo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-10 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors text-sm sm:text-base"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <X className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>

            {/* Filters Row */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              {/* Sort Dropdown */}
              <div className="flex items-center space-x-2 sm:space-x-3">
                <SortAsc className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="border border-gray-300 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                >
                  <option value="newest">Più recenti</option>
                  <option value="oldest">Meno recenti</option>
                  <option value="a-z">Alfabetico A-Z</option>
                  <option value="z-a">Alfabetico Z-A</option>
                </select>
              </div>

              {/* Tags Dropdown */}
              {allTags.length > 0 && (
                <div className="relative">
                  <button
                    onClick={() => setIsTagsDropdownOpen(!isTagsDropdownOpen)}
                    className="inline-flex items-center space-x-1.5 sm:space-x-2 px-2.5 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-xs sm:text-sm"
                  >
                    <Filter className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                    <span className="text-gray-700 font-medium">Tag ({selectedTags.length})</span>
                    <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 text-gray-600 transition-transform ${isTagsDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isTagsDropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10 w-48 sm:w-56">
                      <div className="p-3 sm:p-4 max-h-64 overflow-y-auto">
                        {allTags.map((tag) => (
                          <label key={tag} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer mb-1 last:mb-0">
                            <input
                              type="checkbox"
                              checked={selectedTags.includes(tag)}
                              onChange={() => handleTagToggle(tag)}
                              className="w-4 h-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                            />
                            <span className="text-xs sm:text-sm text-gray-700">#{tag}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Clear All Filters */}
              {(searchTerm || selectedTags.length > 0 || sortBy !== 'newest') && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs sm:text-sm text-gray-600 hover:text-gray-800 underline"
                >
                  Cancella filtri
                </button>
              )}
            </div>

            {/* Selected Tags */}
            {selectedTags.length > 0 && (
              <div className="mt-3 sm:mt-4">
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  {selectedTags.map((tag) => (
                    <motion.button
                      key={tag}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onClick={() => handleTagToggle(tag)}
                      className="inline-flex items-center px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-xs bg-violet-100 text-violet-700 hover:bg-violet-200 transition-colors"
                    >
                      #{tag}
                      <X className="w-3 h-3 ml-1 sm:ml-1.5" />
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Blog Posts Grid */}
          {isLoading ? (
            // Loading Skeleton
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            // Error State
            <div className="text-center py-12">
              <div className="text-red-600 text-lg font-semibold mb-2">Errore nel caricamento</div>
              <p className="text-gray-600 mb-4">Non è stato possibile caricare gli articoli.</p>
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
              >
                Riprova
              </button>
            </div>
          ) : filteredAndSortedPosts.length === 0 ? (
            // No Results State
            <div className="text-center py-12">
              <div className="text-gray-600 text-lg font-semibold mb-2">
                {posts.length === 0 ? 'Nessun articolo pubblicato' : 'Nessun risultato trovato'}
              </div>
              <p className="text-gray-500 mb-4">
                {posts.length === 0 
                  ? 'Gli articoli verranno mostrati automaticamente una volta pubblicati.'
                  : 'Prova a modificare i filtri di ricerca.'
                }
              </p>
              {posts.length > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Mostra tutti gli articoli
                </button>
              )}
            </div>
          ) : (
            // Posts Grid
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
            >
              {filteredAndSortedPosts.map((post) => (
                <motion.article
                  key={post.sys.id}
                  variants={cardVariants}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-violet-200 transition-all duration-300 overflow-hidden group cursor-pointer"
                  onClick={() => window.location.href = `/blog/${post.fields.slug}`}
                >
                  {/* Cover Image */}
                  {post.fields.coverImage && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={post.fields.coverImage.fields.file.url}
                        alt={post.fields.coverImage.fields.title || post.fields.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6">
                    {/* Meta Info */}
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(post.fields.date).toLocaleDateString('it-IT')}</span>
                      </div>
                      {post.fields.author && (
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>{post.fields.author}</span>
                        </div>
                      )}
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-violet-600 transition-colors line-clamp-2">
                      {post.fields.title}
                    </h2>

                    {/* Description */}
                    {post.fields.description && (
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {post.fields.description}
                      </p>
                    )}

                    {/* Tags */}
                    {post.fields.tags && post.fields.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.fields.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
                          >
                            <Hash className="w-3 h-3 mr-1" />
                            {tag}
                          </span>
                        ))}
                        {post.fields.tags.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{post.fields.tags.length - 3} altri
                          </span>
                        )}
                      </div>
                    )}

                    {/* Read More */}
                    <div className="flex items-center text-violet-600 font-medium group-hover:text-violet-700">
                      <span>Leggi di più</span>
                      <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          )}

          {/* Update Info & Controls - Bottom */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 sm:p-4 mb-12"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                <span className="text-xs sm:text-sm text-gray-600">
                  Ultimo aggiornamento: {lastUpdate.toLocaleTimeString('it-IT')}
                </span>
                <button
                  onClick={handleRefresh}
                  className="text-xs sm:text-sm text-violet-600 hover:text-violet-700 font-medium whitespace-nowrap"
                >
                  Aggiorna
                </button>
              </div>
              
              <div className="text-xs sm:text-sm text-gray-500">
                {filteredAndSortedPosts.length} articoli {filteredAndSortedPosts.length !== posts.length && `di ${posts.length}`}
              </div>
            </div>
          </motion.div>
        </div>
        </section>
      </div>
    </>
  );
};

export default BlogPage;