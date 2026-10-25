import apiClient from '../api-client';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  border: string;
}

export interface ThemeFonts {
  heading: string;
  body: string;
}

export interface ThemeLayout {
  borderRadius: string;
  spacing: string;
}

export interface Theme {
  _id?: string;
  name: string;
  description?: string;
  isDefault: boolean;
  colors: ThemeColors;
  fonts: ThemeFonts;
  layout: ThemeLayout;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Get all themes
export const getThemes = async (): Promise<Theme[]> => {
  const response = await apiClient.get<Theme[]>('/api/themes');
  return response.data;
};

// Get default theme
export const getDefaultTheme = async (): Promise<Theme> => {
  const response = await apiClient.get<Theme>('/api/themes/default');
  return response.data;
};

// Get theme by ID
export const getThemeById = async (id: string): Promise<Theme> => {
  const response = await apiClient.get<Theme>(`/api/themes/${id}`);
  return response.data;
};

// Create a new theme (admin only)
export const createTheme = async (theme: Omit<Theme, '_id' | 'createdAt' | 'updatedAt'>): Promise<Theme> => {
  const response = await apiClient.post<Theme>('/api/themes', theme);
  return response.data;
};

// Update a theme (admin only)
export const updateTheme = async (id: string, theme: Partial<Theme>): Promise<Theme> => {
  const response = await apiClient.put<Theme>(`/api/themes/${id}`, theme);
  return response.data;
};

// Delete a theme (admin only)
export const deleteTheme = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/themes/${id}`);
};

// Set theme as default (admin only)
export const setDefaultTheme = async (id: string): Promise<Theme> => {
  const response = await apiClient.put<Theme>(`/api/themes/${id}/default`);
  return response.data;
};