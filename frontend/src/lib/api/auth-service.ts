import apiClient from '../api-client';
import { User, ApiResponse } from '../types';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  // Login user
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post('/api/users/login', credentials);
    return response.data;
  },

  // Register user
  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post('/api/users/register', userData);
    return response.data;
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get('/api/users/me');
    return response.data;
  },

  // Update user profile
  updateProfile: async (userData: Partial<{
    name: string;
    email: string;
    password: string;
    currentPassword: string;
  }>): Promise<User> => {
    const response = await apiClient.put('/api/users/me', userData);
    return response.data;
  },

  // Logout user
  logout: async (): Promise<void> => {
    // Stateless JWT auth: frontend can just clear tokens
    return Promise.resolve();
  }
};