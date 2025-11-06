export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  displayOrder: number;
  color: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
}

export interface Author {
  id: string;
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
  specialization: string[];
  expertise?: string[];
  isActive: boolean;
  articlesCount: number;
  location?: string;
  joinDate: string;
  profileUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featuredImage?: string;
  featuredImageAlt?: string;
  gallery?: string[];
  author: Author;
  category?: Category | null;
  tags?: string[];
  status: 'draft' | 'published';
  isPinned?: boolean;
  isFeatured?: boolean;
  isBreaking?: boolean;
  publishedAt?: string;
  scheduledFor?: string | null;
  createdAt: string;
  updatedAt: string;
  url: string;
  views?: number;
  likes?: number;
  shares?: number;
  comments?: any[];
  readingTime?: number;
  location?: string;
  language?: string;
  seo?: {
    keywords?: string[];
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    current: number;
    pages: number;
    total: number;
    limit: number;
  };
}

export interface ArticlesParams {
  limit?: number;
  page?: number;
  sort?: string;
  category?: string;
  author?: string;
  search?: string;
  status?: 'draft' | 'published';
  isPinned?: boolean;
}

export interface CreateArticleData {
  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  featuredImage?: string;
  featuredImageAlt?: string;
  authorId: string;
  categoryId?: string;
  tags?: string[];
  status: 'draft' | 'published';
  isPinned?: boolean;
  isFeatured?: boolean;
  isBreaking?: boolean;
  scheduledFor?: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
}
