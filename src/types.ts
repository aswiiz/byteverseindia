export interface Project {
  _id?: string;
  id?: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  category: 'Web Applications' | 'Mobile & AI' | 'Cloud & DevOps' | 'Open Source' | 'Enterprise Tools';
  technologies: string[];
  features: string[];
  mainImage: string;
  screenshots: string[];
  githubUrl?: string;
  demoUrl?: string;
  status: 'Production' | 'Beta' | 'In Development' | 'Completed' | 'Archived';
  isFeatured: boolean;
  isPublished: boolean;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Enquiry {
  _id?: string;
  id?: string;
  fullName: string;
  email: string;
  phone?: string;
  projectType: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  telegramDelivered?: boolean;
  telegramError?: string;
  createdAt?: string;
}

export interface AdminStats {
  totalProjects: number;
  featuredProjects: number;
  publishedProjects: number;
  totalEnquiries: number;
  unreadEnquiries: number;
  categoriesCount: Record<string, number>;
  databaseConnected: boolean;
  telegramConfigured: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}
