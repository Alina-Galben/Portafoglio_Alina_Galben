// Contentful Types
export interface ContentfulProject {
  sys: {
    id: string;
  };
  fields: {
    title: string;
    description: string;
    longDescription?: string;
    technologies: string[];
    images: any[];
    liveUrl?: string;
    githubUrl?: string;
    featured: boolean;
    completionDate: string;
  };
}

export interface ContentfulBlogPost {
  sys: {
    id: string;
  };
  fields: {
    title: string;
    slug: string;
    excerpt: string;
    content: any;
    publishDate: string;
    tags: string[];
    featured: boolean;
    coverImage?: any;
  };
}

// Local Data Types
export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  pricing?: {
    from: number;
    currency: string;
  };
}

export interface TechnicalSkill {
  id: string;
  name: string;
  level: number; // 1-5
  icon: string;
  category: 'frontend' | 'backend' | 'database' | 'tools' | 'cloud';
}

export interface SoftSkill {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  badgeUrl?: string;
  pdfUrl?: string;
}

export interface Course {
  id: string;
  name: string;
  provider: string;
  completionDate: string;
  certificateUrl?: string;
  skills: string[];
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  honeypot?: string; // for spam protection
}

// SSE Event Types
export interface SSEEvent {
  type: 'blog-updated' | 'project-updated' | 'stats-updated' | 'connected' | 'heartbeat';
  data?: any;
  timestamp: string;
}