import { createClient } from 'contentful';

// Funzione per creare il client Contentful (lazy initialization)
const getContentfulClient = () => {
  return createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  });
};

// Opzioni per la cache (5 minuti)
const CACHE_DURATION = 5 * 60 * 1000;
let cache = {
  blogPosts: { data: null, timestamp: 0 },
  singlePost: new Map()
};

/**
 * Ottieni tutti i blog posts pubblicati
 */
const getAllBlogPosts = async (req, res) => {
  try {
    const now = Date.now();
    
    // Controlla cache
    if (cache.blogPosts.data && (now - cache.blogPosts.timestamp) < CACHE_DURATION) {
      return res.json(cache.blogPosts.data);
    }

    const { limit = 10, skip = 0, order = '-fields.date' } = req.query;

    const client = getContentfulClient();
    const response = await client.getEntries({
      content_type: 'blogPost',
      'fields.status': 'Published',
      limit: parseInt(limit),
      skip: parseInt(skip),
      order: order,
      include: 2
    });

    // Processa i risultati
    const processedItems = response.items.map(item => ({
      sys: {
        id: item.sys.id,
        createdAt: item.sys.createdAt,
        updatedAt: item.sys.updatedAt
      },
      fields: {
        title: item.fields.title,
        slug: item.fields.slug,
        date: item.fields.date,
        tags: item.fields.tags || [],
        author: item.fields.author || 'Alina Galben',
        coverImage: item.fields.coverImage ? {
          fields: {
            file: {
              url: `https:${item.fields.coverImage.fields.file.url}`
            },
            title: item.fields.coverImage.fields.title
          }
        } : null,
        description: item.fields.description,
        status: item.fields.status,
        readingTime: item.fields.readingTime || calculateReadingTime(item.fields.content),
        views: item.fields.views || 0
      }
    }));

    const result = {
      items: processedItems,
      total: response.total,
      limit: response.limit,
      skip: response.skip
    };

    // Aggiorna cache
    cache.blogPosts = { data: result, timestamp: now };

    res.json(result);
  } catch (error) {
    console.error('Errore nel recupero dei blog posts:', error);
    res.status(500).json({
      error: 'Errore interno del server',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Impossibile recuperare i blog posts'
    });
  }
};

/**
 * Ottieni un singolo blog post per slug
 */
const getBlogPostBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const now = Date.now();

    // Controlla cache per il singolo post
    const cachedPost = cache.singlePost.get(slug);
    if (cachedPost && (now - cachedPost.timestamp) < CACHE_DURATION) {
      return res.json(cachedPost.data);
    }

    const client = getContentfulClient();
    const response = await client.getEntries({
      content_type: 'blogPost',
      'fields.slug': slug,
      'fields.status': 'Published',
      limit: 1,
      include: 3
    });

    if (response.items.length === 0) {
      return res.status(404).json({
        error: 'Post non trovato',
        message: 'Il blog post richiesto non esiste o non è pubblicato'
      });
    }

    const item = response.items[0];
    
    const processedItem = {
      sys: {
        id: item.sys.id,
        createdAt: item.sys.createdAt,
        updatedAt: item.sys.updatedAt
      },
      fields: {
        title: item.fields.title,
        slug: item.fields.slug,
        date: item.fields.date,
        tags: item.fields.tags || [],
        author: item.fields.author || 'Alina Galben',
        coverImage: item.fields.coverImage ? {
          fields: {
            file: {
              url: `https:${item.fields.coverImage.fields.file.url}`
            },
            title: item.fields.coverImage.fields.title
          }
        } : null,
        description: item.fields.description,
        content: item.fields.content,
        status: item.fields.status,
        readingTime: item.fields.readingTime || calculateReadingTime(item.fields.content),
        views: (item.fields.views || 0) + 1 // Incrementa visualizzazioni
      }
    };

    const result = {
      items: [processedItem],
      total: 1
    };

    // Aggiorna cache
    cache.singlePost.set(slug, { data: result, timestamp: now });

    // TODO: In un'applicazione reale, incrementare le visualizzazioni nel CMS
    // await updateViewCount(item.sys.id, processedItem.fields.views);

    res.json(result);
  } catch (error) {
    console.error('Errore nel recupero del blog post:', error);
    res.status(500).json({
      error: 'Errore interno del server',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Impossibile recuperare il blog post'
    });
  }
};

/**
 * Cerca blog posts
 */
const searchBlogPosts = async (req, res) => {
  try {
    const { q, tags, limit = 10, skip = 0 } = req.query;

    if (!q && !tags) {
      return res.status(400).json({
        error: 'Parametri di ricerca mancanti',
        message: 'Fornire almeno un termine di ricerca (q) o tag'
      });
    }

    const searchQuery = {
      content_type: 'blogPost',
      'fields.status': 'Published',
      limit: parseInt(limit),
      skip: parseInt(skip),
      order: '-fields.date',
      include: 2
    };

    // Ricerca per testo
    if (q) {
      searchQuery.query = q;
    }

    // Filtro per tag
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      searchQuery['fields.tags[in]'] = tagArray.join(',');
    }

    const client = getContentfulClient();
    const response = await client.getEntries(searchQuery);

    const processedItems = response.items.map(item => ({
      sys: {
        id: item.sys.id,
        createdAt: item.sys.createdAt,
        updatedAt: item.sys.updatedAt
      },
      fields: {
        title: item.fields.title,
        slug: item.fields.slug,
        date: item.fields.date,
        tags: item.fields.tags || [],
        author: item.fields.author || 'Alina Galben',
        coverImage: item.fields.coverImage ? {
          fields: {
            file: {
              url: `https:${item.fields.coverImage.fields.file.url}`
            },
            title: item.fields.coverImage.fields.title
          }
        } : null,
        description: item.fields.description,
        status: item.fields.status,
        readingTime: item.fields.readingTime || calculateReadingTime(item.fields.content)
      }
    }));

    res.json({
      items: processedItems,
      total: response.total,
      limit: response.limit,
      skip: response.skip,
      query: { q, tags }
    });
  } catch (error) {
    console.error('Errore nella ricerca dei blog posts:', error);
    res.status(500).json({
      error: 'Errore interno del server',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Errore nella ricerca'
    });
  }
};

/**
 * Ottieni tutti i tag disponibili
 */
const getBlogTags = async (req, res) => {
  try {
    const client = getContentfulClient();
    const response = await client.getEntries({
      content_type: 'blogPost',
      'fields.status': 'Published',
      select: 'fields.tags',
      limit: 1000
    });

    const allTags = new Set();
    response.items.forEach(item => {
      if (item.fields.tags) {
        item.fields.tags.forEach(tag => allTags.add(tag));
      }
    });

    const tagsArray = Array.from(allTags).sort();
    
    res.json({
      tags: tagsArray,
      total: tagsArray.length
    });
  } catch (error) {
    console.error('Errore nel recupero dei tag:', error);
    res.status(500).json({
      error: 'Errore interno del server',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Impossibile recuperare i tag'
    });
  }
};

/**
 * Invalida la cache (per webhook)
 */
const invalidateCache = () => {
  cache.blogPosts = { data: null, timestamp: 0 };
  cache.singlePost.clear();
  console.log('💾 Cache blog posts invalidata');
};

/**
 * Calcola il tempo di lettura approssimativo
 */
const calculateReadingTime = (content) => {
  if (!content) return 1;
  
  // Estrai il testo dal rich text di Contentful
  const extractText = (node) => {
    if (!node) return '';
    if (typeof node === 'string') return node;
    if (Array.isArray(node)) return node.map(extractText).join(' ');
    if (node.content) return extractText(node.content);
    if (node.value) return node.value;
    return '';
  };

  const text = extractText(content);
  const wordsPerMinute = 200;
  const wordCount = text.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  
  return Math.max(1, readingTime);
};

export {
  getAllBlogPosts,
  getBlogPostBySlug,
  searchBlogPosts,
  getBlogTags,
  invalidateCache
};