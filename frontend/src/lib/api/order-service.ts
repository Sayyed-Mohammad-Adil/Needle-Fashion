import apiClient from '../api-client';
import { Order, OrderItem, ApiResponse, PaginatedResponse } from '../types';

export interface CreateOrderRequest {
  items: OrderItem[];
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    state: string;
    country: string;
  };
  paymentMethod: string;
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
}

export interface OrderFilters {
  status?: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  isPaid?: boolean;
  isDelivered?: boolean;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}

export const orderService = {
  // Create a new order
  createOrder: async (orderData: CreateOrderRequest): Promise<Order> => {
    const response = await apiClient.post('/api/orders', orderData);
    return response.data;
  },

  // Get order by ID
  getOrderById: async (id: string): Promise<Order> => {
    const response = await apiClient.get(`/api/orders/${id}`);
    return response.data;
  },

  // Get user's orders
  getMyOrders: async (filters?: OrderFilters): Promise<PaginatedResponse<Order>> => {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    
    const response = await apiClient.get('/api/orders/myorders', { params });
    return response.data;
  },

  // Get all orders (admin only)
  getOrders: async (filters?: OrderFilters): Promise<PaginatedResponse<Order>> => {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    
    const response = await apiClient.get('/api/orders', { params });
    return response.data;
  },

  // Update order to paid
  updateOrderToPaid: async (id: string, paymentResult: {
    id: string;
    status: string;
    updateTime: string;
    emailAddress: string;
  }): Promise<Order> => {
    const response = await apiClient.put(`/api/orders/${id}/pay`, { paymentResult });
    return response.data;
  },

  // Update order to delivered
  updateOrderToDelivered: async (id: string): Promise<Order> => {
    const response = await apiClient.put(`/api/orders/${id}/deliver`);
    return response.data;
  },

  // Update order status
  updateOrderStatus: async (id: string, status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'): Promise<Order> => {
    const response = await apiClient.put(`/api/orders/${id}/status`, { status });
    return response.data;
  },

  // Cancel order
  cancelOrder: async (id: string): Promise<Order> => {
    const response = await apiClient.put(`/api/orders/${id}/cancel`);
    return response.data;
  },

  // Generate invoice
  generateInvoice: async (id: string): Promise<Blob> => {
    const response = await apiClient.get(`/api/orders/${id}/invoice`, {
      responseType: 'blob'
    });
    return response.data;
  }
};