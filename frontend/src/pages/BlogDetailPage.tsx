import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Hash, 
  Share2, 
  Eye, 
  Clock,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import useSWR from 'swr';
import { toast } from 'react-hot-toast';
import { useSSE } from '../hooks/useSSE';
import useDeviceOptimization from '../hooks/useDeviceOptimization';
import OptimizedImage from '../components/OptimizedImage';
import BlogLoadingSkeleton from '../components/BlogLoadingSkeleton';
import ArticleContent from '../components/ArticleContent';
import { getBlogPostBySlug, getAllBlogPosts } from '../services/api';

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
    readingTime?: number;
    views?: number;
  };
}

const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [isSharing, setIsSharing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  
  // Ottimizzazioni per dispositivi mobile
  const { isMobile, shouldReduceAnimations, animationConfig, imageConfig } = useDeviceOptimization();

  // Fetch specific blog post
  const { data, error, isLoading, mutate } = useSWR(
    slug ? `blog-post-${slug}` : null,
    () => slug ? getBlogPostBySlug(slug) : null,
    {
      refreshInterval: 60000,
      revalidateOnFocus: !isMobile, // Disabilita su mobile per performance
      revalidateOnReconnect: true,
      dedupingInterval: 5000,
      errorRetryCount: isMobile ? 2 : 3
    }
  );

  // Fetch related posts (lazy loading per mobile)
  const { data: relatedData } = useSWR(
    slug && data?.items?.[0] && !isMobile ? 
    `related-posts-${data.items[0].sys.id}` :
    null,
    () => getAllBlogPosts({ limit: 4, order: '-fields.date' }),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  );

  // SSE for real-time updates
  useSSE(`${API_BASE_URL}/api/events`, {
    onMessage: (event: any) => { 
      if (event.type === 'blog-updated') {
        mutate();
        setLastUpdate(new Date());
        toast.success('✅ Articolo aggiornato', {
          duration: 3000,
          position: 'top-right'
        });
      }
    }
  });

  const post: BlogPost | undefined = data?.items?.[0];
  const relatedPosts: BlogPost[] = relatedData?.items?.filter(
    (relatedPost: BlogPost) => relatedPost.sys.id !== post?.sys.id
  ) || [];

  const handleShare = async () => {
    setIsSharing(true);
    
    // Determine the base URL based on environment
    const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
    const baseUrl = isProduction 
      ? window.location.origin  // Uses the actual production URL
      : (import.meta as any).env.VITE_SITE_URL || 'https://alinagalben.vercel.app'; // Fallback URL
    
    const currentPath = window.location.pathname;
    const shareUrl = isProduction ? window.location.href : `${baseUrl}${currentPath}`;
    
    if (navigator.share && post) {
      try {
        await navigator.share({
          title: post.fields.title,
          text: post.fields.description || 'Leggi questo articolo interessante!',
          url: shareUrl,
        });
        toast.success('✅ Articolo condiviso!');
      } catch (error) {
        // User cancelled share or error occurred
        console.log('Share cancelled or error:', error);
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast.success('🔗 Link copiato negli appunti!');
        
        // Show additional info in development
        if (!isProduction) {
          toast('📝 Nota: URL di produzione copiato per condivisione futura', { 
            duration: 5000,
            icon: 'ℹ️'
          });
        }
      } catch (error) {
        toast.error('❌ Errore nella condivisione');
      }
    }
    setIsSharing(false);
  };

  const handleRefresh = () => {
    mutate();
    setLastUpdate(new Date());
  };

  const formatReadingTime = (minutes?: number) => {
    if (!minutes) return 'Lettura veloce';
    return `${minutes} min di lettura`;
  };

  if (isLoading) {
    return <BlogLoadingSkeleton />;
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {error ? 'Errore nel caricamento' : 'Articolo non trovato'}
            </h1>
            <p className="text-gray-600 mb-8">
              {error 
                ? 'Si è verificato un errore nel caricamento dell\'articolo.'
                : 'L\'articolo che stai cercando non esiste o non è più disponibile.'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/blog')}
                className="px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
              >
                Torna al Blog
              </button>
              {error && (
                <button
                  onClick={handleRefresh}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Riprova
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Dynamic SEO Meta Tags */}
      <Helmet>
        <title>{post.fields.title} — Blog Alina Galben</title>
        <meta name="description" content={post.fields.description || `Leggi ${post.fields.title} sul blog di Alina Galben`} />
        <meta name="keywords" content={post.fields.tags?.join(', ') || 'sviluppo web, programmazione'} />
        <meta name="author" content={post.fields.author || 'Alina Galben'} />
        <meta name="robots" content="index, follow" />
        
        {/* Open Graph */}
        <meta property="og:title" content={post.fields.title} />
        <meta property="og:description" content={post.fields.description || `Leggi ${post.fields.title} sul blog di Alina Galben`} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={window.location.href} />
        {post.fields.coverImage && (
          <meta property="og:image" content={post.fields.coverImage.fields.file.url} />
        )}
        <meta property="article:published_time" content={post.fields.date} />
        <meta property="article:author" content={post.fields.author || 'Alina Galben'} />
        {post.fields.tags?.map(tag => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.fields.title} />
        <meta name="twitter:description" content={post.fields.description || `Leggi ${post.fields.title} sul blog di Alina Galben`} />
        {post.fields.coverImage && (
          <meta name="twitter:image" content={post.fields.coverImage.fields.file.url} />
        )}
        
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb & Back Button */}
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-8 pt-8 sm:pt-0">
            <button
              onClick={() => navigate('/blog')}
              className="flex items-center space-x-1 hover:text-violet-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Blog</span>
            </button>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium truncate">{post.fields.title}</span>
          </div>

          
          {/* Article Header */}
          <header className="mb-8">
            {/* Cover Image */}
            {post.fields.coverImage && (
              <OptimizedImage
                src={post.fields.coverImage.fields.file.url}
                alt={post.fields.coverImage.fields.title || post.fields.title}
                className={isMobile ? "h-48 rounded-lg mb-6" : "h-64 md:h-80 lg:h-96 rounded-xl mb-8 shadow-lg"}
                isMobile={isMobile}
                priority={true}
              />
            )}

            {/* --- NUOVO LAYOUT: Titolo e Bottone Condividi affiancati --- */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight flex-1">
                {post.fields.title}
              </h1>
              {/* Share Button */}
              <button
                onClick={handleShare}
                disabled={isSharing}
                className="flex-shrink-0 flex items-center space-x-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-50 w-full sm:w-auto justify-center"
              >
                <Share2 className="w-4 h-4" />
                <span>{isSharing ? 'Condivisione...' : 'Condividi'}</span>
              </button>
            </div>

            {/* Description */}
            {post.fields.description && (
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                {post.fields.description}
              </p>
            )}

            {/* --- NUOVO BOX: Metadati e Tag raggruppati --- */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-8">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(post.fields.date).toLocaleDateString('it-IT', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  </div>
                  {post.fields.author && (
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>{post.fields.author}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{formatReadingTime(post.fields.readingTime)}</span>
                  </div>
                  {post.fields.views && (
                    <div className="flex items-center space-x-2">
                      <Eye className="w-4 h-4" />
                      <span>{post.fields.views.toLocaleString()} visualizzazioni</span>
                    </div>
                  )}
                </div>
                
                {/* Tags */}
                {post.fields.tags && post.fields.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.fields.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-violet-100 text-violet-700"
                      >
                        <Hash className="w-3 h-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </header>


          {/* Article Content */}
          <article className={`bg-white rounded-xl shadow-sm border border-gray-100 mb-12 ${isMobile ? 'p-4' : 'p-8'}`}>
            <ArticleContent content={post.fields.content} isMobile={isMobile} />

            {/* --- NUOVA POSIZIONE: Info di aggiornamento --- */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <RefreshCw className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-600">
                  Aggiornato: {new Date(post.sys.updatedAt).toLocaleTimeString('it-IT')}
                </span>
                <button
                  onClick={handleRefresh}
                  className="text-sm text-violet-600 hover:text-violet-700 font-medium"
                >
                  Aggiorna 🔄
                </button>
              </div>
            </div>
            
          </article>

          {/* Related Articles */}
          {relatedPosts.length > 0 && !isMobile && (
            <section className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Articoli correlati</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedPosts.slice(0, 4).map((relatedPost) => (
                  <article
                    key={relatedPost.sys.id}
                    onClick={() => navigate(`/blog/${relatedPost.fields.slug}`)}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-violet-200 transition-all duration-300 overflow-hidden cursor-pointer group"
                  >
                    {relatedPost.fields.coverImage && (
                      <div className="h-32 overflow-hidden">
                        <img
                          src={relatedPost.fields.coverImage.fields.file.url}
                          alt={relatedPost.fields.coverImage.fields.title || relatedPost.fields.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-violet-600 transition-colors">
                        {relatedPost.fields.title}
                      </h3>
                      {relatedPost.fields.description && (
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                          {relatedPost.fields.description}
                        </p>
                      )}
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>{new Date(relatedPost.fields.date).toLocaleDateString('it-IT')}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* Back to Blog Button */}
          <div className="text-center pb-16">
            <button
              onClick={() => navigate('/blog')}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Torna al Blog</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogDetailPage;