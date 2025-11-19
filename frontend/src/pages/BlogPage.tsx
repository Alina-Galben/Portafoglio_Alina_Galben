import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, SortAsc, RefreshCw, Calendar, User, Hash, ArrowRight, X, ChevronDown } from 'lucide-react';
import useSWR from 'swr';
import { toast } from 'react-hot-toast';
import { useSSE } from '../hooks/useSSE';
import SectionTitle from '../components/SectionTitle';
import { getAllBlogPosts } from '../services/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3020';

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
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'a-z' | 'z-a'>('newest');
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isTagsDropdownOpen, setIsTagsDropdownOpen] = useState(false);

  // Fetcher for SWR - uses the API service
  const fetcher = async () => {
    try {
      return await getAllBlogPosts({ limit: 100 });
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      throw error;
    }
  };

  // Fetch blog posts from backend API
  const { data, error, isLoading, mutate } = useSWR(
    '/api/blog',
    fetcher,
    {
      refreshInterval: 60000,
      revalidateOnFocus: true,
      revalidateOnReconnect: true
    }
  );

  // SSE for real-time updates
  useSSE(`${API_BASE_URL}/api/events`, {
    onMessage: (event: any) => {
      if (event.type === 'blog-updated') {
        mutate();
        setLastUpdate(new Date());
        toast.success('✅ Blog Post aggiornati', {
          duration: 3000,
          position: 'top-right'
        });
      }
    }
  });

  const posts: BlogPost[] = useMemo(() => {
    if (!data) return [];
    // Handle both direct array response and { items: [...] } response
    return Array.isArray(data) ? data : (data.items || []);
  }, [data]);

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

      <div className="min-h-screen bg-gray-50 pt-8">
        <section className="min-h-screen bg-gray-50 pt-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Page Header */}
          <SectionTitle
            emoji="📝"
            title="Blog Tecnico & Insights"
            subtitle="Articoli, tutorial e riflessioni sul mondo dello sviluppo web moderno. Aggiornamenti in tempo reale da Contentful."
            className="pt-8"
          />

          {/* Search and Filters - Modern Minimal Style */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="max-w-4xl mx-auto mb-12" // Centrato e con larghezza limitata
          >
            <div className="flex flex-col md:flex-row gap-4 items-center">
              {/* Search Bar - Espansa */}
              <div className="relative grow w-full">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-violet-500" />
                </div>
                <input
                  type="text"
                  placeholder="Cerca un articolo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-11 pr-10 py-4 bg-white border-1 rounded-full shadow-lg shadow-violet-100/50 focus:ring-2 focus:ring-violet-500 text-gray-700 placeholder-gray-400 transition-all hover:shadow-xl"
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  >
                    <X className="h-5 w-5 text-gray-400 hover:text-red-500 transition-colors" />
                  </button>
                )}
              </div>

              {/* Filters Row - Compatta a destra */}
              <div className="flex flex-shrink-0 gap-3 w-full md:w-auto">
                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="appearance-none w-full md:w-48 bg-white py-4 pl-5 pr-10 rounded-full shadow-lg shadow-violet-100/50 border-1 text-gray-700 font-medium focus:ring-2 focus:ring-violet-500 cursor-pointer hover:bg-gray-50 transition-all"
                  >
                    <option value="newest">Più recenti</option>
                    <option value="oldest">Meno recenti</option>
                    <option value="a-z">Alfabetico A-Z</option>
                    <option value="z-a">Alfabetico Z-A</option>
                  </select>
                  <SortAsc className="absolute right-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-violet-500 pointer-events-none" />
                </div>

                {/* Tags Filter Button */}
                {allTags.length > 0 && (
                  <div className="relative">
                    <button
                      onClick={() => setIsTagsDropdownOpen(!isTagsDropdownOpen)}
                      className={`flex items-center justify-center w-12 h-full aspect-square bg-white rounded-full shadow-lg shadow-violet-100/50 text-gray-600 hover:text-violet-600 hover:bg-violet-50 transition-all ${isTagsDropdownOpen ? 'ring-2 ring-violet-500 text-violet-600' : ''}`}
                      title="Filtra per Tag"
                    >
                      <Filter className="h-5 w-5" />
                    </button>

                    {/* Dropdown Menu dei Tag */}
                    {isTagsDropdownOpen && (
                      <div className="absolute top-full right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl z-20 w-64 p-4 animate-in fade-in slide-in-from-top-2">
                        <h4 className="text-sm font-bold text-gray-900 mb-3">Filtra per argomenti</h4>
                        <div className="max-h-60 overflow-y-auto space-y-1 custom-scrollbar">
                          {allTags.map((tag) => (
                            <label key={tag} className="flex items-center space-x-3 p-2 hover:bg-violet-70 rounded-lg cursor-pointer transition-colors">
                              <input
                                type="checkbox"
                                checked={selectedTags.includes(tag)}
                                onChange={() => handleTagToggle(tag)}
                                className="w-4 h-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                              />
                              <span className="text-sm text-gray-700">#{tag}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Selected Tags & Clear Filters - Appaiono sotto se necessario */}
            {(searchTerm || selectedTags.length > 0 || sortBy !== 'newest') && (
              <div className="flex flex-wrap items-center gap-3 mt-4 justify-center md:justify-start px-2">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Filtri attivi:</span>
                
                {selectedTags.map((tag) => (
                  <motion.button
                    key={tag}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => handleTagToggle(tag)}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-violet-100 text-violet-700 hover:bg-violet-200 hover:text-violet-800 transition-colors"
                  >
                    #{tag}
                    <X className="w-3 h-3 ml-1.5" />
                  </motion.button>
                ))}
                
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-red-500 hover:text-red-700 hover:underline font-medium ml-auto"
                >
                  Cancella tutto
                </button>
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
                  onClick={() => navigate(`/blog/${post.fields.slug}`)}
                >
                  <div className="relative h-48 overflow-hidden">
                    {post.fields.coverImage ? (
                      <img
                        src={post.fields.coverImage.fields.file.url}
                        alt={post.fields.coverImage.fields.title || post.fields.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-violet-100 to-purple-200 flex items-center justify-center">
                        <Hash className="w-10 h-10 text-violet-400 opacity-50" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

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