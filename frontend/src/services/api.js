// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3020';

/**
 * Generic fetch wrapper with error handling
 */
const fetchJSON = async (endpoint, options = {}) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

/**
 * Contact form submission
 */
export const submitContactForm = async (formData) => {
  return fetchJSON('/api/contact', {
    method: 'POST',
    body: formData,
  });
};

/**
 * Health check
 */
export const checkHealth = async () => {
  return fetchJSON('/health');
};

/**
 * Get all blog posts
 */
export const getAllBlogPosts = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const endpoint = query ? `/api/blog?${query}` : '/api/blog';
  return fetchJSON(endpoint);
};

/**
 * Get single blog post by slug
 */
export const getBlogPostBySlug = async (slug) => {
  return fetchJSON(`/api/blog/${slug}`);
};

/**
 * Search blog posts
 */
export const searchBlogPosts = async (params) => {
  const query = new URLSearchParams(params).toString();
  return fetchJSON(`/api/blog/search?${query}`);
};

/**
 * Get blog tags
 */
export const getBlogTags = async () => {
  return fetchJSON('/api/blog/tags');
};

export default {
  submitContactForm,
  checkHealth,
  getAllBlogPosts,
  getBlogPostBySlug,
  searchBlogPosts,
  getBlogTags,
};