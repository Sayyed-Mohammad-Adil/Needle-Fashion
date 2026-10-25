import apiClient from '../api-client';
import { SearchAnalytics, ViewAnalytics, SalesAnalytics } from '../types';

export interface AnalyticsFilters {
  startDate?: string;
  endDate?: string;
  period?: 'day' | 'week' | 'month' | 'year';
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  recentOrders: any[];
  revenueByDate: Array<{ _id: string; total: number }>;
  topSellingProducts: Array<{ _id: string; name: string; totalSold: number; totalRevenue: number }>;
  orderStatusCounts: Array<{ _id: string; count: number }>;
  lowStockProducts?: any[];
}

export interface SalesAnalyticsData {
  salesByDate: Array<{ _id: string; totalSales: number; orderCount: number; itemsSold: number }>;
  salesByCategory: Array<{ _id: string; categoryName: string; totalSales: number; itemsSold: number }>;
  averageOrderValue: number;
}

export interface ProductAnalyticsData {
  topViewedProducts: Array<any>;
  topSearchTerms: Array<any>;
  productConversionRate: Array<any>;
}

export interface UserAnalyticsData {
  userRegistrationByDate: Array<any>;
  topCustomers: Array<any>;
}

export const analyticsService = {
  // Get dashboard statistics
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get('/api/analytics/dashboard');
    return response.data;
  },

  // Get sales analytics
  getSalesAnalytics: async (filters?: AnalyticsFilters): Promise<SalesAnalyticsData> => {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }

    const response = await apiClient.get('/api/analytics/sales', { params });
    return response.data;
  },

  // Get product analytics
  getProductAnalytics: async (): Promise<ProductAnalyticsData> => {
    const response = await apiClient.get('/api/analytics/products');
    return response.data;
  },

  // Get user analytics
  getUserAnalytics: async (): Promise<UserAnalyticsData> => {
    const response = await apiClient.get('/api/analytics/users');
    return response.data;
  },

  // Get search analytics
  getSearchAnalytics: async (filters?: AnalyticsFilters): Promise<SearchAnalytics[]> => {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }

    const response = await apiClient.get('/api/analytics/search', { params });
    return response.data;
  },

  // Get view analytics
  getViewAnalytics: async (filters?: AnalyticsFilters): Promise<ViewAnalytics[]> => {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }

    const response = await apiClient.get('/api/analytics/views', { params });
    return response.data;
  },

  // Get sales analytics
  getSalesAnalyticsOld: async (filters?: AnalyticsFilters): Promise<SalesAnalytics[]> => {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }

    const response = await apiClient.get('/api/analytics/sales-old', { params });
    return response.data;
  },
};