import apiClient from '../api-client';
import { Category } from '../types';

export const categoryService = {
  // Get all categories
  getCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get('/api/categories');
    return response.data;
  },

  // Get a single category by ID
  getCategoryById: async (id: string): Promise<Category> => {
    const response = await apiClient.get(`/api/categories/${id}`);
    return response.data;
  },

  // Create a new category (admin only)
  createCategory: async (categoryData: Partial<Category>): Promise<Category> => {
    const response = await apiClient.post('/api/categories', categoryData);
    return response.data;
  },

  // Update a category (admin only)
  updateCategory: async (id: string, categoryData: Partial<Category>): Promise<Category> => {
    const response = await apiClient.put(`/api/categories/${id}`, categoryData);
    return response.data;
  },

  // Delete a category (admin only)
  deleteCategory: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/categories/${id}`);
  },
};