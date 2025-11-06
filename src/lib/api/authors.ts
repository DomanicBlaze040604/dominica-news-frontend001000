import apiClient from './client';
import type { Author, ApiResponse } from './types';

export const authorsApi = {
  // Get all authors
  getAll: async (params?: { limit?: number; page?: number }) => {
    return apiClient.get('/api/authors', { params }) as Promise<ApiResponse<Author[]>>;
  },

  // Get author by ID
  getById: async (id: string) => {
    return apiClient.get(`/api/authors/${id}`) as Promise<ApiResponse<Author>>;
  },

  // Get author's articles
  getArticles: async (id: string, params?: { limit?: number; page?: number }) => {
    return apiClient.get(`/api/authors/${id}/articles`, { params });
  },
};

export default authorsApi;
