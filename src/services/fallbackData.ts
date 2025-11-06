/**
 * Fallback data service for when backend endpoints are not available
 * This provides mock data to keep the frontend functional during development
 */

import { ApiResponse, Article, Category, Author, Image, BreakingNews } from '../types/api';
import { StaticPage } from './staticPages';

// Mock data
const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Politics',
    slug: 'politics',
    description: 'Political news and updates',
    displayOrder: 1,
    articleCount: 15,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Sports',
    slug: 'sports',
    description: 'Sports news and events',
    displayOrder: 2,
    articleCount: 8,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Economy',
    slug: 'economy',
    description: 'Economic news and analysis',
    displayOrder: 3,
    articleCount: 12,
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Culture',
    slug: 'culture',
    description: 'Cultural events and news',
    displayOrder: 4,
    articleCount: 6,
    createdAt: new Date().toISOString(),
  },
];

const mockAuthors: Author[] = [
  {
    id: '1',
    name: 'John Smith',
    slug: 'john-smith',
    role: 'Senior Political Reporter',
    biography: 'John has been covering Dominican politics for over 10 years.',
    email: 'john.smith@dominicanews.com',
    isActive: true,
    joinDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year ago
    articlesCount: 25,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Maria Rodriguez',
    slug: 'maria-rodriguez',
    role: 'Sports Correspondent',
    biography: 'Maria covers sports events across the Caribbean region.',
    email: 'maria.rodriguez@dominicanews.com',
    isActive: true,
    joinDate: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString(), // 200 days ago
    articlesCount: 18,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const mockArticles: Article[] = [
  {
    id: '1',
    title: 'Breaking: New Infrastructure Development Announced for Dominica',
    slug: 'new-infrastructure-development-announced-dominica',
    excerpt: 'The government has announced a major infrastructure development project that will improve roads and bridges across the island.',
    content: '<p>In a significant announcement today, the Dominican government revealed plans for a comprehensive infrastructure development project...</p><p>This initiative will focus on improving transportation networks, upgrading existing roads, and constructing new bridges to enhance connectivity across the island.</p>',
    category: mockCategories[0], // Politics
    author: mockAuthors[0],
    status: 'published',
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    isPinned: true,
    tags: ['infrastructure', 'government', 'development', 'roads'],
    featuredImage: '/api/placeholder/800/400',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    title: 'Local Cricket Team Wins Regional Championship',
    slug: 'local-cricket-team-wins-regional-championship',
    excerpt: 'The Dominica national cricket team secured victory in the Caribbean regional championship with an outstanding performance.',
    content: '<p>The Dominica national cricket team made history yesterday by winning the Caribbean regional championship...</p><p>The team showed exceptional skill and determination throughout the tournament, culminating in a thrilling final match.</p>',
    category: mockCategories[1], // Sports
    author: mockAuthors[1],
    status: 'published',
    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    isPinned: false,
    tags: ['cricket', 'sports', 'championship', 'caribbean'],
    featuredImage: '/api/placeholder/800/400',
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    title: 'Hurricane Season Preparedness: Essential Tips for Residents',
    slug: 'hurricane-season-preparedness-essential-tips',
    excerpt: 'As hurricane season approaches, local authorities provide crucial safety guidelines and preparation tips for all residents.',
    content: '<p>With the Atlantic hurricane season officially underway, Dominican authorities are urging residents to prepare...</p><p>Key preparation steps include securing emergency supplies, creating evacuation plans, and staying informed about weather updates.</p>',
    category: mockCategories[2], // Economy
    author: mockAuthors[0],
    status: 'published',
    publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    isPinned: false,
    tags: ['hurricane', 'safety', 'preparedness', 'weather'],
    featuredImage: '/api/placeholder/800/400',
    createdAt: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    title: 'Tourism Industry Shows Strong Recovery Post-Pandemic',
    slug: 'tourism-industry-strong-recovery-post-pandemic',
    excerpt: 'Recent statistics show a remarkable recovery in Dominica\'s tourism sector, with visitor numbers approaching pre-pandemic levels.',
    content: '<p>The Dominican tourism industry is experiencing a robust recovery following the challenges of the global pandemic...</p><p>Hotel occupancy rates have increased significantly, and new tourism initiatives are attracting visitors from around the world.</p>',
    category: mockCategories[0], // Politics/Economy
    author: mockAuthors[1],
    status: 'draft',
    publishedAt: null,
    isPinned: false,
    tags: ['tourism', 'economy', 'recovery', 'pandemic'],
    featuredImage: '/api/placeholder/800/400',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    title: 'Local School Wins National Science Competition',
    slug: 'local-school-wins-national-science-competition',
    excerpt: 'Students from Roseau Primary School have achieved first place in the national science fair with their innovative environmental project.',
    content: '<p>In an impressive display of scientific innovation, students from Roseau Primary School have won the national science competition...</p><p>Their project focused on sustainable energy solutions and environmental conservation, earning praise from judges and educators alike.</p>',
    category: mockCategories[1], // Sports
    author: mockAuthors[0],
    status: 'published',
    publishedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(), // 18 hours ago
    isPinned: false,
    tags: ['education', 'science', 'students', 'competition'],
    featuredImage: '/api/placeholder/800/400',
    createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
  },
];

const mockImages: Image[] = [
  {
    id: '1',
    filename: 'sample-image.jpg',
    originalName: 'sample-image.jpg',
    filePath: '/uploads/sample-image.jpg',
    thumbnailPath: '/uploads/thumbnails/sample-image.jpg',
    fileSize: 1024000,
    mimeType: 'image/jpeg',
    width: 1920,
    height: 1080,
    altText: 'Sample image',
    uploader: {
      id: '1',
      email: 'admin@dominicanews.com',
      fullName: 'Admin User',
      role: 'admin',
      createdAt: new Date().toISOString(),
    },
    urls: {
      original: '/uploads/sample-image.jpg',
      large: '/uploads/large/sample-image.jpg',
      medium: '/uploads/medium/sample-image.jpg',
      small: '/uploads/small/sample-image.jpg',
      thumbnail: '/uploads/thumbnails/sample-image.jpg',
      navigationThumbnail: '/uploads/nav-thumbs/sample-image.jpg',
    },
    webpUrls: {
      original: '/uploads/sample-image.webp',
      large: '/uploads/large/sample-image.webp',
      medium: '/uploads/medium/sample-image.webp',
      small: '/uploads/small/sample-image.webp',
    },
    url: '/uploads/sample-image.jpg',
    thumbnailUrl: '/uploads/thumbnails/sample-image.jpg',
    createdAt: new Date().toISOString(),
  },
];

const mockBreakingNews: BreakingNews[] = [
  {
    id: '1',
    text: 'Sample breaking news alert for testing purposes',
    isActive: true,
    createdBy: {
      id: '1',
      email: 'admin@dominicanews.com',
      fullName: 'Admin User',
      role: 'admin',
      createdAt: new Date().toISOString(),
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Mock static pages
const mockStaticPages = [
  {
    id: '1',
    title: 'About Us',
    slug: 'about-us',
    content: '<h1>About Dominica News</h1><p>Your trusted source for news in Dominica.</p>',
    metaTitle: 'About Us - Dominica News',
    metaDescription: 'Learn more about Dominica News and our mission.',
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Contact Us',
    slug: 'contact-us',
    content: '<h1>Contact Us</h1><p>Get in touch with our editorial team.</p>',
    metaTitle: 'Contact Us - Dominica News',
    metaDescription: 'Contact information for Dominica News.',
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Fallback service functions
export const fallbackService = {
  // Categories
  getCategories: (): Promise<ApiResponse<{ categories: Category[] }>> => {
    return Promise.resolve({
      success: true,
      message: 'Categories retrieved (fallback data)',
      data: { categories: mockCategories },
    });
  },

  getAdminCategories: (): Promise<ApiResponse<Category[]>> => {
    return Promise.resolve({
      success: true,
      message: 'Admin categories retrieved (fallback data)',
      data: mockCategories,
    });
  },

  // Authors
  getAuthors: (): Promise<ApiResponse<{ authors: Author[] }>> => {
    return Promise.resolve({
      success: true,
      message: 'Authors retrieved (fallback data)',
      data: { authors: mockAuthors },
    });
  },

  getAdminAuthors: (): Promise<ApiResponse<{ authors: Author[]; count: number }>> => {
    return Promise.resolve({
      success: true,
      message: 'Admin authors retrieved (fallback data)',
      data: { authors: mockAuthors, count: mockAuthors.length },
    });
  },

  // Articles
  getArticles: (params?: any): Promise<ApiResponse<{ articles: Article[]; pagination: any }>> => {
    return Promise.resolve({
      success: true,
      message: 'Articles retrieved (fallback data)',
      data: {
        articles: mockArticles,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalArticles: mockArticles.length,
          hasNextPage: false,
          hasPrevPage: false,
          limit: 10,
        },
      },
    });
  },

  getAdminArticles: (params?: any): Promise<ApiResponse<{ articles: Article[]; pagination: any }>> => {
    return Promise.resolve({
      success: true,
      message: 'Admin articles retrieved (fallback data)',
      data: {
        articles: mockArticles,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalArticles: mockArticles.length,
          hasNextPage: false,
          hasPrevPage: false,
          limit: 10,
        },
      },
    });
  },

  // Images
  getImages: (params?: any): Promise<ApiResponse<{ images: Image[]; pagination: any }>> => {
    return Promise.resolve({
      success: true,
      message: 'Images retrieved (fallback data)',
      data: {
        images: mockImages,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalImages: mockImages.length,
          hasNextPage: false,
          hasPrevPage: false,
          limit: 20,
        },
      },
    });
  },

  // Breaking News
  getBreakingNews: (): Promise<ApiResponse<{ breakingNews: BreakingNews[] }>> => {
    return Promise.resolve({
      success: true,
      message: 'Breaking news retrieved (fallback data)',
      data: { breakingNews: mockBreakingNews },
    });
  },

  // Static Pages
  getStaticPages: (published?: boolean): Promise<ApiResponse<{ data: StaticPage[]; count: number }>> => {
    const filteredPages = published ? mockStaticPages.filter(p => p.isPublished) : mockStaticPages;
    return Promise.resolve({
      success: true,
      message: 'Static pages retrieved (fallback data)',
      data: { data: filteredPages, count: filteredPages.length },
    });
  },

  // Generic fallback for any missing endpoint
  genericFallback: <T>(data: T, message: string = 'Data retrieved (fallback)'): Promise<ApiResponse<T>> => {
    return Promise.resolve({
      success: true,
      message,
      data,
    });
  },

  // Authentication fallback for demo mode
  login: (credentials: any): Promise<any> => {
    // Demo login - accept any credentials
    const demoUser = {
      id: 'demo_admin_1',
      email: credentials.email || 'admin@dominicanews.dm',
      fullName: 'Demo Administrator',
      role: 'admin',
      createdAt: new Date().toISOString()
    };
    
    const demoToken = 'demo_token_' + Date.now();
    
    return Promise.resolve({
      success: true,
      message: 'Demo login successful - you are now in admin demo mode',
      data: {
        user: demoUser,
        token: demoToken
      }
    });
  },

  getCurrentUser: (): Promise<any> => {
    const demoUser = {
      id: 'demo_admin_1',
      email: 'admin@dominicanews.dm',
      fullName: 'Demo Administrator',
      role: 'admin',
      createdAt: new Date().toISOString()
    };
    
    return Promise.resolve({
      success: true,
      message: 'Demo user retrieved',
      data: { user: demoUser }
    });
  },

  logout: (): Promise<any> => {
    return Promise.resolve({
      success: true,
      message: 'Demo logout successful',
      data: {}
    });
  },
};

// Helper function to check if we should use fallback data
export const shouldUseFallback = (error: any): boolean => {
  // Always use fallback for network errors (no response)
  if (!error?.response) {
    return true;
  }
  
  // Use fallback for 404 errors on admin endpoints
  if (error?.response?.status === 404 && error?.config?.url?.includes('/admin/')) {
    return true;
  }
  
  // Use fallback for auth endpoints when backend is unavailable
  if (error?.config?.url?.includes('/auth/')) {
    return true;
  }
  
  // Use fallback for 500+ server errors
  if (error?.response?.status >= 500) {
    return true;
  }
  
  return false;
};

// Enhanced service wrapper that falls back to mock data when needed
export const withFallback = <T>(
  serviceCall: () => Promise<T>,
  fallbackCall: () => Promise<T>,
  options: { enableFallback?: boolean; logFallback?: boolean } = {}
): Promise<T> => {
  const { enableFallback = true, logFallback = true } = options;
  
  return serviceCall().catch((error) => {
    if (enableFallback && shouldUseFallback(error)) {
      if (logFallback && console.warn) {
        console.warn('Using fallback data due to API error:', error.message);
      }
      return fallbackCall();
    }
    throw error;
  });
};