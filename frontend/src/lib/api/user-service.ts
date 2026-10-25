import apiClient from '../api-client';
import { User, PaginatedResponse } from '../types';

export const userService = {
    // Get all users (admin only)
    getUsers: async (page = 1, pageSize = 10): Promise<PaginatedResponse<User>> => {
        const response = await apiClient.get(`/api/admin/users?page=${page}&pageSize=${pageSize}`);
        return response.data;
    },

    // Get user by ID (admin only)
    getUserById: async (id: string): Promise<User> => {
        const response = await apiClient.get(`/api/admin/users/${id}`);
        return response.data;
    },

    // Update user (admin only)
    updateUser: async (id: string, userData: Partial<User>): Promise<User> => {
        const response = await apiClient.put(`/api/admin/users/${id}`, userData);
        return response.data;
    },

    // Delete user (admin only)
    deleteUser: async (id: string): Promise<void> => {
        await apiClient.delete(`/api/admin/users/${id}`);
    },
};
