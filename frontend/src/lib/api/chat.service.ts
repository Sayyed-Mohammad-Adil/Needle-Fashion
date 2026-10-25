import apiClient from '../api-client';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatSession {
  _id?: string;
  userId?: string;
  sessionId: string;
  messages: ChatMessage[];
  context: {
    productId?: string;
    orderId?: string;
    category?: string;
  };
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  expiresAt?: string;
}

// Get chat session
export const getChatSession = async (sessionId: string): Promise<ChatSession> => {
  const response = await apiClient.get<ChatSession>(`/api/chat/sessions/${sessionId}`);
  return response.data;
};

// Send message to chatbot
export const sendMessage = async (sessionId: string, message: string, context?: any): Promise<ChatSession> => {
  const response = await apiClient.post<ChatSession>(`/api/chat/sessions/${sessionId}/messages`, {
    message,
    context,
  });
  return response.data;
};

// End chat session
export const endChatSession = async (sessionId: string): Promise<ChatSession> => {
  const response = await apiClient.put<ChatSession>(`/api/chat/sessions/${sessionId}/end`);
  return response.data;
};

// Get chat history for user
export const getChatHistory = async (page: number = 1, pageSize: number = 10): Promise<{
  sessions: ChatSession[];
  page: number;
  pages: number;
  total: number;
}> => {
  const response = await apiClient.get(`/api/chat/history?page=${page}&pageSize=${pageSize}`);
  return response.data;
};