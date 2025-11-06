import apiClient from './client';
import type { Category, ApiResponse } from './types';

export const categoriesApi = {
  // Get all categories
  getAll: async () => {
    return apiClient.get('/api/categories') as Promise<ApiResponse<Category[]>>;
  },

  // Get category by slug
  getBySlug: async (slug: string) => {
    return apiClient.get(`/api/categories/${slug}`) as Promise<ApiResponse<Category>>;
  },
};

export default categoriesApi;
