'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getChatSession, sendMessage, ChatSession, ChatMessage } from '@/lib/api/chat.service';

interface ChatContextType {
  session: ChatSession | null;
  messages: ChatMessage[];
  isOpen: boolean;
  isLoading: boolean;
  sessionId: string;
  openChat: () => void;
  closeChat: () => void;
  sendMessage: (message: string) => Promise<void>;
  startNewSession: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');

  // Generate a unique session ID on mount
  useEffect(() => {
    const newSessionId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setSessionId(newSessionId);
    
    // Try to load existing session
    loadSession(newSessionId);
  }, []);

  const loadSession = async (id: string) => {
    try {
      const data = await getChatSession(id);
      setSession(data);
      setMessages(data.messages);
    } catch (error) {
      // If session doesn't exist, that's fine - it will be created when first message is sent
      console.log('No existing chat session found');
    }
  };

  const openChat = () => {
    setIsOpen(true);
  };

  const closeChat = () => {
    setIsOpen(false);
  };

  const startNewSession = async () => {
    const newSessionId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setSessionId(newSessionId);
    setSession(null);
    setMessages([]);
    
    try {
      const data = await getChatSession(newSessionId);
      setSession(data);
      setMessages(data.messages);
    } catch (error) {
      // If session doesn't exist, that's fine - it will be created when first message is sent
      console.log('No existing chat session found');
    }
  };

  const sendMessageToBot = async (message: string) => {
    if (!message.trim()) return;
    
    try {
      setIsLoading(true);
      
      // Add user message to UI immediately
      const userMessage: ChatMessage = {
        role: 'user',
        content: message,
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      // Send message to backend
      const updatedSession = await sendMessage(sessionId, message, session?.context);
      
      setSession(updatedSession);
      setMessages(updatedSession.messages);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message to UI
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        session,
        messages,
        isOpen,
        isLoading,
        sessionId,
        openChat,
        closeChat,
        sendMessage: sendMessageToBot,
        startNewSession,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};