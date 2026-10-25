import apiClient from '../api-client';
import { Expense, ApiResponse, PaginatedResponse } from '../types';

export interface ExpenseFilters {
  category?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  page?: number;
  pageSize?: number;
}

export interface ExpenseSummary {
  totalAmount: number;
  totalCount: number;
  byCategory: Array<{ _id: string; total: number; count: number }>;
  byDate: Array<{ _id: string; total: number; count: number }>;
}

export const expenseService = {
  // Get all expenses
  getExpenses: async (filters?: ExpenseFilters): Promise<PaginatedResponse<Expense>> => {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    
    const response = await apiClient.get('/api/expenses', { params });
    return response.data;
  },

  // Get expense by ID
  getExpenseById: async (id: string): Promise<Expense> => {
    const response = await apiClient.get(`/api/expenses/${id}`);
    return response.data;
  },

  // Create expense
  createExpense: async (expenseData: Omit<Expense, '_id' | 'createdAt' | 'updatedAt'>): Promise<Expense> => {
    const response = await apiClient.post('/api/expenses', expenseData);
    return response.data;
  },

  // Update expense
  updateExpense: async (id: string, expenseData: Partial<Expense>): Promise<Expense> => {
    const response = await apiClient.put(`/api/expenses/${id}`, expenseData);
    return response.data;
  },

  // Delete expense
  deleteExpense: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/expenses/${id}`);
  },

  // Get expense summary
  getExpenseSummary: async (filters?: { startDate?: string; endDate?: string }): Promise<ExpenseSummary> => {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    
    const response = await apiClient.get('/api/expenses/summary', { params });
    return response.data;
  },

  // Get expense categories
  getExpenseCategories: async (): Promise<string[]> => {
    const response = await apiClient.get('/api/expenses/categories');
    return response.data;
  }
};