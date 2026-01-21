import { createClient } from 'contentful';

const getClient = () => {
  const { CONTENTFUL_SPACE_ID, CONTENTFUL_ACCESS_TOKEN } = process.env;
  if (!CONTENTFUL_SPACE_ID || !CONTENTFUL_ACCESS_TOKEN) throw new Error('Contentful config missing');
  
  return createClient({
    space: CONTENTFUL_SPACE_ID,
    accessToken: CONTENTFUL_ACCESS_TOKEN,
  });
};

const cache = { list: { data: null, ts: 0 }, slugs: new Map() };
const CACHE_TTL = 0;

const extractText = (node) => {
  if (!node) return '';
  if (typeof node === 'string') return node;
  if (Array.isArray(node)) return node.map(extractText).join(' ');
  return extractText(node.content || node.value);
};

const calculateReadingTime = (content) => {
  if (!content) return 1;
  const words = extractText(content).split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
};

const transformEntry = ({ sys, fields }) => ({
  sys: { id: sys.id, createdAt: sys.createdAt, updatedAt: sys.updatedAt },
  fields: {
    ...fields,
    author: fields.author ?? 'Alina Galben',
    tags: fields.tags ?? [],
    views: fields.views ?? 0,
    readingTime: fields.readingTime ?? calculateReadingTime(fields.content),
    coverImage: fields.coverImage?.fields?.file ? {
      fields: {
        file: { url: `https:${fields.coverImage.fields.file.url}` },
        title: fields.coverImage.fields.title
      }
    } : null
  }
});

export const getAllBlogPosts = async (req, res) => {
  try {
    if (cache.list.data && (Date.now() - cache.list.ts < CACHE_TTL)) {
      return res.json(cache.list.data);
    }

    const { limit = 10, skip = 0, order = '-fields.date' } = req.query;
    const client = getClient();

    const response = await client.getEntries({
      content_type: 'blogPost',
      'fields.status': 'Published',
      limit: +limit,
      skip: +skip,
      order,
      include: 2
    });

    const payload = {
      items: response.items.map(transformEntry),
      total: response.total,
      limit: response.limit,
      skip: response.skip
    };

    cache.list = { data: payload, ts: Date.now() };
    res.json(payload);
  } catch (error) {
    res.status(500).json({ error: 'Provider Error', message: error.message });
  }
};

export const getBlogPostBySlug = async (req, res) => {
  const { slug } = req.params;
  
  try {
    const cached = cache.slugs.get(slug);
    if (cached && (Date.now() - cached.ts < CACHE_TTL)) return res.json(cached.data);

    const client = getClient();
    const { items } = await client.getEntries({
      content_type: 'blogPost',
      'fields.slug': slug,
      'fields.status': 'Published',
      limit: 1,
      include: 3
    });

    if (!items.length) return res.status(404).json({ error: 'Not Found' });

    const post = transformEntry(items[0]);
    
    post.fields.views += 1;

    const payload = { items: [post], total: 1 };
    cache.slugs.set(slug, { data: payload, ts: Date.now() });
    
    res.json(payload);
  } catch (error) {
    res.status(500).json({ error: 'Provider Error', message: error.message });
  }
};

export const searchBlogPosts = async (req, res) => {
  const { q, tags, limit = 10, skip = 0 } = req.query;
  if (!q && !tags) return res.status(400).json({ error: 'Missing params' });

  try {
    const client = getClient();
    const query = {
      content_type: 'blogPost',
      'fields.status': 'Published',
      limit: +limit,
      skip: +skip,
      order: '-fields.date',
      include: 2,
      ...(q && { query: q }),
      ...(tags && { 'fields.tags[in]': Array.isArray(tags) ? tags.join(',') : tags })
    };

    const { items, total, limit: resLimit, skip: resSkip } = await client.getEntries(query);

    res.json({
      items: items.map(transformEntry),
      total,
      limit: resLimit,
      skip: resSkip,
      query: { q, tags }
    });
  } catch (error) {
    res.status(500).json({ error: 'Search Failed', details: error.message });
  }
};

export const getBlogTags = async (_, res) => {
  try {
    const client = getClient();
    const { items } = await client.getEntries({
      content_type: 'blogPost',
      'fields.status': 'Published',
      select: 'fields.tags',
      limit: 1000
    });

    const uniqueTags = new Set(items.flatMap(i => i.fields.tags || []));
    const tags = Array.from(uniqueTags).sort();
    
    res.json({ tags, total: tags.length });
  } catch (error) {
    res.status(500).json({ error: 'Tags Error', details: error.message });
  }
};

export const invalidateCache = () => {
  cache.list = { data: null, ts: 0 };
  cache.slugs.clear();
};