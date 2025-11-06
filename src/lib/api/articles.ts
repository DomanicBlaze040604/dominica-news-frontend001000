import apiClient from './client';
import type { Article, ApiResponse, ArticlesParams, CreateArticleData } from './types';

export const articlesApi = {
  // Get all articles with filters
  getAll: async (params?: ArticlesParams) => {
    return apiClient.get('/api/articles', { params }) as Promise<ApiResponse<Article[]>>;
  },

  // Get featured articles
  getFeatured: async (limit = 3) => {
    return apiClient.get('/api/articles', {
      params: { limit, isFeatured: true },
    }) as Promise<ApiResponse<Article[]>>;
  },

  // Get single article by slug
  getBySlug: async (slug: string) => {
    return apiClient.get(`/api/articles/${slug}`) as Promise<ApiResponse<Article>>;
  },

  // Get articles by category
  getByCategory: async (categorySlug: string, params?: ArticlesParams) => {
    return apiClient.get(`/api/categories/${categorySlug}/articles`, {
      params,
    }) as Promise<ApiResponse<Article[]>>;
  },

  // Create new article
  create: async (data: CreateArticleData) => {
    return apiClient.post('/api/articles', data) as Promise<ApiResponse<Article>>;
  },

  // Update article
  update: async (id: string, data: Partial<CreateArticleData>) => {
    return apiClient.put(`/api/articles/${id}`, data) as Promise<ApiResponse<Article>>;
  },

  // Delete article
  delete: async (id: string) => {
    return apiClient.delete(`/api/articles/${id}`) as Promise<ApiResponse<void>>;
  },

  // Increment view count
  incrementViews: async (slug: string): Promise<void> => {
    await apiClient.post(`/api/articles/${slug}/views`);
  },
};

export default articlesApi;
