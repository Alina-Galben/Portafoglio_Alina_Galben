import { createClient } from 'contentful';

const getClient = () => {
  const { CONTENTFUL_SPACE_ID, CONTENTFUL_ACCESS_TOKEN } = process.env;
  
  if (!CONTENTFUL_SPACE_ID || !CONTENTFUL_ACCESS_TOKEN) return null;
  
  return createClient({
    space: CONTENTFUL_SPACE_ID,
    accessToken: CONTENTFUL_ACCESS_TOKEN,
  });
};

const cache = { projects: { data: null, ts: 0 }, slugs: new Map() };
const CACHE_TTL = 0;

const transformProject = ({ sys, fields }) => ({
  sys: { id: sys.id, createdAt: sys.createdAt, updatedAt: sys.updatedAt },
  fields: {
    ...fields,
    title: fields.title ?? 'Untitled',
    description: fields.description ?? '',
    technologies: fields.technologies ?? [],
    gitHubURL: fields.gitHubURL ?? '',
    liveDemoURL: fields.liveDemoURL ?? '',
    featured: fields.featured ?? false,
    order: fields.order ?? 0,
    coverImage: fields.coverImage ?? null
  }
});

export const getAllProjects = async (req, res) => {
  try {
    if (cache.projects.data && (Date.now() - cache.projects.ts < CACHE_TTL)) {
      return res.json(cache.projects.data);
    }

    const { limit = 10, skip = 0, order = 'fields.order' } = req.query;
    const client = getClient();

    if (!client) {
      return res.json({ total: 0, limit: +limit, skip: +skip, items: [] });
    }

    const response = await client.getEntries({
      content_type: 'project',
      limit: +limit,
      skip: +skip,
      order,
      include: 2
    });

    const payload = {
      total: response.total,
      limit: response.limit,
      skip: response.skip,
      items: response.items.map(transformProject)
    };

    cache.projects = { data: payload, ts: Date.now() };
    res.json(payload);
  } catch (error) {
    res.status(500).json({ error: 'Fetch Failed', message: error.message });
  }
};

export const getProjectBySlug = async (req, res) => {
  const { slug } = req.params;
  
  try {
    const cached = cache.slugs.get(slug);
    if (cached && (Date.now() - cached.ts < CACHE_TTL)) return res.json(cached.data);

    const client = getClient();
    if (!client) throw new Error('Contentful not configured');

    const entry = await client.getEntry(slug);
    const project = transformProject(entry);

    cache.slugs.set(slug, { data: project, ts: Date.now() });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Fetch Failed', message: error.message });
  }
};

export const getProjectTechnologies = async (_, res) => {
  try {
    const client = getClient();
    if (!client) return res.json({ technologies: [] });

    const { items } = await client.getEntries({ content_type: 'project', include: 2 });
    const uniqueTechs = new Set(items.flatMap(i => i.fields.technologies || []));

    res.json({ technologies: Array.from(uniqueTechs).sort() });
  } catch (error) {
    res.status(500).json({ error: 'Fetch Failed', message: error.message });
  }
};