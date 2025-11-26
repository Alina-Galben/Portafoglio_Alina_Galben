import { createClient } from 'contentful';

const client = createClient({
  space: import.meta.env.VITE_CONTENTFUL_SPACE_ID,
  accessToken: import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN,
  environment: import.meta.env.VITE_CONTENTFUL_ENVIRONMENT || 'master',
});

const extractTextFromRichText = (richText) => {
  if (!richText || !richText.content) {
    return 'Descrizione non disponibile';
  }

  let text = '';
  
  const extractFromNode = (node) => {
    if (node.nodeType === 'text') {
      return node.value;
    }
    
    if (node.content && Array.isArray(node.content)) {
      return node.content.map(extractFromNode).join('');
    }
    
    return '';
  };

  richText.content.forEach(node => {
    text += extractFromNode(node) + ' ';
  });

  return text.trim() || 'Descrizione non disponibile';
};

export const fetchProjects = async () => {
  try {
    console.log('🔍 Fetching projects from Contentful...');
    
    const response = await client.getEntries({
      content_type: 'project',
      order: 'fields.order,-sys.createdAt',
      limit: 20,
    });

    console.log(`✅ Found ${response.items.length} projects from Contentful`);
    
    if (response.items.length > 0) {
      console.log('🔍 First project fields:', Object.keys(response.items[0].fields));
      console.log('🔍 Sample project data:', response.items[0].fields);
    }
    
    return response.items;
  } catch (error) {
    console.error('❌ Error fetching projects from Contentful:', error);
    throw new Error('Impossibile recuperare i progetti da Contentful');
  }
};

export const fetchProjectById = async (projectId) => {
  try {
    const entry = await client.getEntry(projectId);
    
    return {
      id: entry.sys.id,
      name: entry.fields.title || 'Progetto Senza Nome',
      description: extractTextFromRichText(entry.fields.description),
      technologies: entry.fields.technologies || [],
      githubLink: entry.fields.gitHubUrl || null,
      websiteLink: entry.fields.liveDemoUr || null,
      image: entry.fields.coverImage ? {
        url: entry.fields.coverImage.fields.file.url,
        alt: entry.fields.coverImage.fields.title || entry.fields.title || 'Project Image',
      } : null,
      featured: entry.fields.featured || false,
      order: entry.fields.order || 0,
      createdAt: entry.sys.createdAt,
      updatedAt: entry.sys.updatedAt,
    };
  } catch (error) {
    console.error(`❌ Error fetching project ${projectId}:`, error);
    throw new Error(`Impossibile recuperare il progetto ${projectId}`);
  }
};

export { client };

export default {
  fetchProjects,
  fetchProjectById,
  client,
};