import apiClient from '../api-client';
import { Product } from '../types';

interface ProductsResponse {
  products: Product[];
  page: number;
  pages: number;
  total: number;
}

interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  size?: number;
  inStock?: boolean;
  isMakeToOrder?: boolean;
  keyword?: string;
  sortBy?: 'priceAsc' | 'priceDesc' | 'newest' | 'rating' | 'popularity';
  page?: number;
  pageSize?: number;
  filters?: Record<string, string[]>;
}

// Interface for creating/updating products
interface ProductInput {
  name: string;
  description: string;
  price: number;
  images: { data: string; alt?: string }[];
  category: string;
  filters: Record<string, string[]>;
  sizes: number[];
  isMakeToOrder: boolean;
  fittingOptions: string[];
  stock: number;
}

export const productService = {
  // Get all products with filtering, sorting, and pagination
  getProducts: async (filters: ProductFilters = {}): Promise<ProductsResponse> => {
    const params = new URLSearchParams();
    
    // Add all filters to params
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'filters' && typeof value === 'object') {
          // Handle nested filters
          Object.entries(value).forEach(([filterKey, filterValues]) => {
            if (Array.isArray(filterValues)) {
              filterValues.forEach(val => {
                params.append(`filters[${filterKey}][]`, val);
              });
            }
          });
        } else {
          params.append(key, String(value));
        }
      }
    });
    
    const response = await apiClient.get(`/api/products`, { params });
    return response.data;
  },
  
  // Get a single product by ID
  getProductById: async (id: string): Promise<Product> => {
    const response = await apiClient.get(`/api/products/${id}`);
    return response.data;
  },
  
  // Create a new product (admin only)
  createProduct: async (productData: ProductInput): Promise<Product> => {
    const response = await apiClient.post('/api/products', productData);
    return response.data;
  },
  
  // Update a product (admin only)
  updateProduct: async (id: string, productData: Partial<ProductInput>): Promise<Product> => {
    const response = await apiClient.put(`/api/products/${id}`, productData);
    return response.data;
  },
  
  // Delete a product (admin only)
  deleteProduct: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/products/${id}`);
  },
  
  // Get top rated products
  getTopProducts: async (): Promise<Product[]> => {
    const response = await apiClient.get('/api/products/top');
    return response.data;
  },
  
  // Track product view
  trackProductView: async (productId: string): Promise<void> => {
    await apiClient.post(`/api/products/${productId}/view`);
  },
};