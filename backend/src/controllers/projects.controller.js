import { createClient } from 'contentful';

// Funzione per creare il client Contentful (lazy initialization)
const getContentfulClient = () => {
  return createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  });
};

// Opzioni per la cache (5 minuti)
const CACHE_DURATION = 0;
let cache = {
  projects: { data: null, timestamp: 0 },
  singleProject: new Map()
};

/**
 * Ottieni tutti i progetti pubblicati
 */
const getAllProjects = async (req, res) => {
  try {
    const now = Date.now();
    
    // Controlla cache
    if (cache.projects.data && (now - cache.projects.timestamp) < CACHE_DURATION) {
      return res.json(cache.projects.data);
    }

    const { limit = 10, skip = 0, order = 'fields.order' } = req.query;

    const client = getContentfulClient();
    
    // Verifica che il client sia configurato
    if (!process.env.CONTENTFUL_SPACE_ID || !process.env.CONTENTFUL_ACCESS_TOKEN) {
      console.warn('⚠️ Credenziali Contentful non configurate');
      // Ritorna array vuoto se credenziali non presenti
      const emptyData = {
        total: 0,
        limit: parseInt(limit),
        skip: parseInt(skip),
        items: []
      };
      cache.projects = { data: emptyData, timestamp: now };
      return res.json(emptyData);
    }

    const response = await client.getEntries({
      content_type: 'project',
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
        title: item.fields.title || 'Senza titolo',
        description: item.fields.description || '',
        coverImage: item.fields.coverImage || null,
        technologies: item.fields.technologies || [],
        gitHubURL: item.fields.gitHubURL || '',
        liveDemoURL: item.fields.liveDemoURL || '',
        featured: item.fields.featured || false,
        order: item.fields.order || 0
      }
    }));

    // Salva in cache
    const processedData = {
      total: response.total,
      limit: response.limit,
      skip: response.skip,
      items: processedItems
    };

    cache.projects = { data: processedData, timestamp: now };

    res.json(processedData);
  } catch (error) {
    // Ritorna errore con dettagli
    res.status(500).json({
      error: 'Errore nel recupero dei progetti',
      message: error.message,
      code: error.code,
      status: error.status,
      details: error.response?.data || null
    });
  }
};

/**
 * Ottieni un singolo progetto per ID
 */
const getProjectBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    
    // Controlla cache per questo ID
    if (cache.singleProject.has(slug)) {
      const cached = cache.singleProject.get(slug);
      if (Date.now() - cached.timestamp < CACHE_DURATION) {
        return res.json(cached.data);
      }
    }

    const client = getContentfulClient();
    const response = await client.getEntry(slug);

    const item = response;
    const processedItem = {
      sys: {
        id: item.sys.id,
        createdAt: item.sys.createdAt,
        updatedAt: item.sys.updatedAt
      },
      fields: {
        title: item.fields.title || 'Senza titolo',
        description: item.fields.description || '',
        coverImage: item.fields.coverImage || null,
        technologies: item.fields.technologies || [],
        gitHubURL: item.fields.gitHubURL || '',
        liveDemoURL: item.fields.liveDemoURL || '',
        featured: item.fields.featured || false,
        order: item.fields.order || 0
      }
    };

    // Salva in cache
    cache.singleProject.set(slug, { 
      data: processedItem, 
      timestamp: Date.now() 
    });

    res.json(processedItem);
  } catch (error) {
    console.error('❌ Errore nel recupero del progetto:', error.message);
    res.status(500).json({
      error: 'Errore nel recupero del progetto',
      message: error.message
    });
  }
};

/**
 * Ottieni le tecnologie utilizzate nei progetti
 */
const getProjectTechnologies = async (req, res) => {
  try {
    const client = getContentfulClient();
    const response = await client.getEntries({
      content_type: 'project',
      include: 2
    });

    const technologies = new Set();
    response.items.forEach(item => {
      if (item.fields.technologies && Array.isArray(item.fields.technologies)) {
        item.fields.technologies.forEach(tech => technologies.add(tech));
      }
    });

    res.json({
      technologies: Array.from(technologies).sort()
    });
  } catch (error) {
    console.error('❌ Errore nel recupero delle tecnologie:', error.message);
    res.status(500).json({
      error: 'Errore nel recupero delle tecnologie',
      message: error.message
    });
  }
};

export {
  getAllProjects,
  getProjectBySlug,
  getProjectTechnologies
};
