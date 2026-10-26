import apiClient from '../api-client';
import { Inquiry } from '../types';

export interface CreateInquiryData {
  name: string;
  email: string;
  phone: string;
  type?: 'Bespoke Commission' | 'Atelier Fitting' | 'Custom Measurement' | 'Order Inquiry' | 'General';
  subject?: string;
  message: string;
  preferredDate?: string;
  preferredTime?: string;
  productId?: string;
  productName?: string;
  measurements?: {
    chest?: number;
    waist?: number;
    length?: number;
    sleeve?: number;
    shoulder?: number;
    neck?: number;
    fitting?: string;
  };
}

export interface InquiriesResponse {
  success: boolean;
  inquiries: Inquiry[];
  total: number;
  page: number;
  pages: number;
  counts: {
    total: number;
    pending: number;
    scheduled: number;
    inProgress: number;
  };
}

export const inquiryService = {
  // Public: submit consultation or bespoke fitting inquiry
  createInquiry: async (data: CreateInquiryData): Promise<{ success: boolean; message: string; inquiry: Inquiry }> => {
    const response = await apiClient.post('/api/inquiries', data);
    return response.data;
  },

  // Admin: get all inquiries with filters & search
  getInquiries: async (params?: {
    page?: number;
    pageSize?: number;
    status?: string;
    type?: string;
    keyword?: string;
  }): Promise<InquiriesResponse> => {
    const response = await apiClient.get('/api/inquiries', { params });
    return response.data;
  },

  // Admin: get single inquiry
  getInquiryById: async (id: string): Promise<{ success: boolean; inquiry: Inquiry }> => {
    const response = await apiClient.get(`/api/inquiries/${id}`);
    return response.data;
  },

  // Admin: update inquiry status or staff notes
  updateInquiry: async (
    id: string,
    data: { status?: string; adminNotes?: string }
  ): Promise<{ success: boolean; message: string; inquiry: Inquiry }> => {
    const response = await apiClient.put(`/api/inquiries/${id}`, data);
    return response.data;
  },

  // Admin: delete inquiry
  deleteInquiry: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete(`/api/inquiries/${id}`);
    return response.data;
  },
};
