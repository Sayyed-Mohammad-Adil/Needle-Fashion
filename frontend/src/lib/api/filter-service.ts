import apiClient from '../api-client';
import { FilterValue } from '../types';

interface Filter {
  _id: string;
  name: string;
  values: FilterValue[];
}

export const filterService = {
  // Get all filters
  getFilters: async (): Promise<Filter[]> => {
    const response = await apiClient.get('/api/filters');
    return response.data;
  },
  
  // Get filters by category
  getFiltersByCategory: async (categoryId: string): Promise<Filter[]> => {
    const response = await apiClient.get(`/api/filters/category/${categoryId}`);
    return response.data;
  },
};