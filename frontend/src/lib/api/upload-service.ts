import apiClient from '../api-client';

export interface UploadedFile {
  url: string;
  filename: string;
  originalName?: string;
  size: number;
  mimetype?: string;
  createdAt?: string;
}

export const uploadService = {
  // Upload a single image file (JPG, PNG, WEBP, SVG)
  uploadImage: async (file: File): Promise<{ success: boolean; url: string; filename: string }> => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await apiClient.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Upload multiple images simultaneously (up to 10)
  uploadMultipleImages: async (files: File[]): Promise<{ success: boolean; count: number; files: UploadedFile[] }> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });

    const response = await apiClient.post('/api/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // List all media files in uploads gallery
  getMediaGallery: async (): Promise<{ success: boolean; count: number; files: UploadedFile[] }> => {
    const response = await apiClient.get('/api/upload');
    return response.data;
  },

  // Delete an image by filename
  deleteMediaFile: async (filename: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete(`/api/upload/${filename}`);
    return response.data;
  },
};
