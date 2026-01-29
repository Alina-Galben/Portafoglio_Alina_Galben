
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3020';


class ApiError extends Error {
  constructor(message, { status, data, endpoint } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
    this.endpoint = endpoint;
  }
}

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

  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, config);

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message = data?.message || `HTTP Error: ${response.status}`;
      throw new ApiError(message, { status: response.status, data, endpoint });
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const submitContactForm = async (formData) => {
  return fetchJSON('/api/contact', {
    method: 'POST',
    body: formData,
  });
};

export const checkHealth = async () => {
  return fetchJSON('/health');
};

export const getAllBlogPosts = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const endpoint = query ? `/api/blog?${query}` : '/api/blog';
  return fetchJSON(endpoint);
};

export const getBlogPostBySlug = async (slug) => {
  return fetchJSON(`/api/blog/${slug}`);
};

export const searchBlogPosts = async (params) => {
  const query = new URLSearchParams(params).toString();
  return fetchJSON(`/api/blog/search?${query}`);
};

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