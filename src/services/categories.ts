import { api } from './api';
import { ApiResponse, Category, CategoriesResponse, CategoryFormData } from '../types/api';
import { withFallback, fallbackService } from './fallbackData';
import { safeApiCall, createFallbackData } from '../utils/errorPrevention';

export const categoriesService = {
  // Public endpoints
  getCategories: async (): Promise<ApiResponse<CategoriesResponse>> => {
    return safeApiCall(
      async () => {
        const response = await api.get<ApiResponse<CategoriesResponse>>('/categories');
        return response.data;
      },
      createFallbackData.categories(),
      'getCategories'
    );
  },

  getCategoryBySlug: async (slug: string): Promise<ApiResponse<{ category: Category }>> => {
    const response = await api.get<ApiResponse<{ category: Category }>>(`/categories/${slug}`);
    return response.data;
  },

  checkSlugAvailability: async (slug: string, excludeId?: string): Promise<ApiResponse<{ available: boolean }>> => {
    const params = excludeId ? `?excludeId=${excludeId}` : '';
    const response = await api.get<ApiResponse<{ available: boolean }>>(`/categories/check-slug/${slug}${params}`);
    return response.data;
  },

  getCategoryPreview: async (slug: string, limit: number = 5): Promise<ApiResponse<{ category: Category; articles: any[]; count: number }>> => {
    const response = await api.get<ApiResponse<{ category: Category; articles: any[]; count: number }>>(`/categories/${slug}/preview?limit=${limit}`);
    return response.data;
  },

  // Admin endpoints
  getAdminCategories: async (): Promise<ApiResponse<Category[]>> => {
    return withFallback(
      async () => {
        const response = await api.get<ApiResponse<Category[]>>('/admin/categories');
        return response.data;
      },
      () => fallbackService.getAdminCategories()
    );
  },

  createCategory: async (categoryData: CategoryFormData): Promise<ApiResponse<{ category: Category }>> => {
    const response = await api.post<ApiResponse<{ category: Category }>>('/categories', categoryData);
    return response.data;
  },

  updateCategory: async (id: string, categoryData: Partial<CategoryFormData>): Promise<ApiResponse<{ category: Category }>> => {
    const response = await api.put<ApiResponse<{ category: Category }>>(`/categories/${id}`, categoryData);
    return response.data;
  },

  deleteCategory: async (id: string, options?: { reassignTo?: string; forceDelete?: boolean }): Promise<ApiResponse<{}>> => {
    const response = await api.delete<ApiResponse<{}>>(`/categories/${id}`, {
      data: options
    });
    return response.data;
  },
};