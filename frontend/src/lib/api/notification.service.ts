import apiClient from '../api-client';

export interface Notification {
  _id?: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  priority: 'low' | 'medium' | 'high';
  targetUsers: 'all' | 'specific' | 'admin';
  userIds?: string[];
  isRead: boolean;
  readBy: string[];
  expiresAt?: string;
  createdBy: string;
  createdAt?: string;
  updatedAt?: string;
}

// Get all notifications for current user
export const getNotifications = async (page: number = 1, pageSize: number = 10): Promise<{
  notifications: Notification[];
  page: number;
  pages: number;
  total: number;
}> => {
  const response = await apiClient.get(`/api/notifications?page=${page}&pageSize=${pageSize}`);
  return response.data;
};

// Get notification by ID
export const getNotificationById = async (id: string): Promise<Notification> => {
  const response = await apiClient.get(`/api/notifications/${id}`);
  return response.data;
};

// Create a new notification (admin only)
export const createNotification = async (notification: Omit<Notification, '_id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'readBy' | 'isRead'>): Promise<Notification> => {
  const response = await apiClient.post<Notification>('/api/notifications', notification);
  return response.data;
};

// Update a notification (admin only)
export const updateNotification = async (id: string, notification: Partial<Notification>): Promise<Notification> => {
  const response = await apiClient.put<Notification>(`/api/notifications/${id}`, notification);
  return response.data;
};

// Delete a notification (admin only)
export const deleteNotification = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/notifications/${id}`);
};

// Mark notification as read
export const markAsRead = async (id: string): Promise<Notification> => {
  const response = await apiClient.put<Notification>(`/api/notifications/${id}/read`);
  return response.data;
};

// Mark all notifications as read
export const markAllAsRead = async (): Promise<{ message: string }> => {
  const response = await apiClient.put<{ message: string }>('/api/notifications/read-all');
  return response.data;
};

// Get admin notifications
export const getAdminNotifications = async (page: number = 1, pageSize: number = 10): Promise<{
  notifications: Notification[];
  page: number;
  pages: number;
  total: number;
}> => {
  const response = await apiClient.get(`/api/notifications/admin?page=${page}&pageSize=${pageSize}`);
  return response.data;
};