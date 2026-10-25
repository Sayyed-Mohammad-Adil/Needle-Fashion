import apiClient from '../api-client';
import { FAQ, ApiResponse, PaginatedResponse } from '../types';

export interface FAQFilters {
  page?: number;
  pageSize?: number;
  search?: string;
}

export const faqService = {
  // Get all FAQs
  getFAQs: async (filters?: FAQFilters): Promise<PaginatedResponse<FAQ>> => {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    
    const response = await apiClient.get('/api/faqs', { params });
    return response.data;
  },

  // Get FAQ by ID
  getFAQById: async (id: string): Promise<FAQ> => {
    const response = await apiClient.get(`/api/faqs/${id}`);
    return response.data;
  },

  // Create FAQ
  createFAQ: async (faqData: Omit<FAQ, '_id' | 'createdAt' | 'updatedAt'>): Promise<FAQ> => {
    const response = await apiClient.post('/api/faqs', faqData);
    return response.data;
  },

  // Update FAQ
  updateFAQ: async (id: string, faqData: Partial<FAQ>): Promise<FAQ> => {
    const response = await apiClient.put(`/api/faqs/${id}`, faqData);
    return response.data;
  },

  // Delete FAQ
  deleteFAQ: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/faqs/${id}`);
  },

  // Search FAQs
  searchFAQs: async (query: string): Promise<FAQ[]> => {
    const response = await apiClient.get(`/api/faqs/search?q=${encodeURIComponent(query)}`);
    return response.data;
  }
};