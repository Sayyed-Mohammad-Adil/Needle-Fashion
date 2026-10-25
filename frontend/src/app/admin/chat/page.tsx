'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
    ChatBubbleLeftRightIcon,
    PaperAirplaneIcon,
    UserCircleIcon,
    MagnifyingGlassIcon,
    CheckBadgeIcon
} from '@heroicons/react/24/outline';
import io from 'socket.io-client';
import apiClient from '@/lib/api-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export default function ChatPage() {
    const [sessions, setSessions] = useState<any[]>([]);
    const [selectedSession, setSelectedSession] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [msgInput, setMsgInput] = useState('');
    const [loading, setLoading] = useState(true);
    const [isUserTyping, setIsUserTyping] = useState(false);
    const socketRef = useRef<any>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<any>(null);

    // Fetch sessions from API
    const fetchSessions = async () => {
        try {
            const response = await apiClient.get('/api/chat/sessions');
            setSessions(response.data);
        } catch (error) {
            console.error('Failed to fetch sessions:', error);
        } finally {
            setLoading(false);
        }
    };

    // Initialize Socket.io
    useEffect(() => {
        socketRef.current = io(SOCKET_URL);

        socketRef.current.on('new_message', (data: any) => {
            // Update the session list to show last message/timestamp
            setSessions(prev => prev.map(s => {
                if (s.sessionId === data.sessionId) {
                    // If message belongs to the current open chat, update messages too
                    if (selectedSession && s.sessionId === selectedSession.sessionId) {
                        setMessages(m => [...m, data]);
                    }
                    return { ...s, lastMessage: data };
                }
                return s;
            }));
        });

        socketRef.current.on('admin_notification', (data: any) => {
            // If it's a new session, refresh the list
            fetchSessions();
        });

        socketRef.current.on('typing', (data: any) => {
            if (selectedSession && data.sessionId === selectedSession.sessionId && data.role === 'user') {
                setIsUserTyping(true);
            }
        });

        socketRef.current.on('stop_typing', (data: any) => {
            if (selectedSession && data.sessionId === selectedSession.sessionId && data.role === 'user') {
                setIsUserTyping(false);
            }
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, [selectedSession]);

    // Autoscroll to bottom
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isUserTyping]);

    useEffect(() => {
        fetchSessions();
    }, []);

    const handleSelectSession = (session: any) => {
        setSelectedSession(session);
        setMessages(session.messages || []);
        socketRef.current.emit('join_room', session.sessionId);
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!msgInput.trim() || !selectedSession) return;

        socketRef.current.emit('send_message', {
            sessionId: selectedSession.sessionId,
            content: msgInput,
            role: 'admin'
        });

        socketRef.current.emit('stop_typing', {
            sessionId: selectedSession.sessionId,
            role: 'admin'
        });

        setMsgInput('');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMsgInput(e.target.value);

        if (!selectedSession) return;

        // Emit typing event
        socketRef.current.emit('typing', {
            sessionId: selectedSession.sessionId,
            role: 'admin',
            userName: 'Admin'
        });

        // Clear existing timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Set timeout to stop typing
        typingTimeoutRef.current = setTimeout(() => {
            socketRef.current.emit('stop_typing', {
                sessionId: selectedSession.sessionId,
                role: 'admin'
            });
        }, 3000);
    };

    return (
        <div className="py-6 h-[calc(100vh-160px)] flex flex-col space-y-4">
            <div className="flex-shrink-0">
                <h1 className="text-2xl font-semibold text-foreground">Customer Support Chat</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Real-time support for your customers. Respond to inquiries and resolve issues instantly.
                </p>
            </div>

            <div className="flex-1 flex bg-card border border-border shadow rounded-lg overflow-hidden">
                {/* Sidebar */}
                <div className="w-full sm:w-80 border-r border-border flex flex-col">
                    <div className="p-4 border-b border-border">
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <MagnifyingGlassIcon className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <input
                                type="text"
                                className="block w-full rounded-md border-border bg-background py-1.5 pl-9 text-foreground ring-1 ring-inset ring-border placeholder:text-muted-foreground focus:ring-2 focus:ring-primary sm:text-sm"
                                placeholder="Search conversations..."
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {loading ? (
                            <div className="p-4 text-center text-muted-foreground">Loading chats...</div>
                        ) : sessions.length === 0 ? (
                            <div className="p-4 text-center text-muted-foreground">No active chats</div>
                        ) : sessions.map((chat) => (
                            <button
                                key={chat._id}
                                onClick={() => handleSelectSession(chat)}
                                className={`w-full p-4 flex items-start gap-3 hover:bg-muted/50 transition-colors ${selectedSession?._id === chat._id ? 'bg-muted/80' : ''
                                    }`}
                            >
                                <div className="relative flex-shrink-0">
                                    <UserCircleIcon className="h-10 w-10 text-muted-foreground" />
                                    {chat.isActive && (
                                        <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-card" />
                                    )}
                                </div>
                                <div className="flex-1 text-left min-w-0">
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="text-sm font-semibold text-foreground truncate">{chat.userName || chat.userId?.name || 'Guest'}</h3>
                                        <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                            {chat.lastMessage ? new Date(chat.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground truncate mt-1">{chat.lastMessage?.content || 'Started a conversation'}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Chat Window */}
                <div className="flex-1 flex flex-col bg-background/50">
                    {selectedSession ? (
                        <>
                            {/* Header */}
                            <div className="p-4 border-b border-border bg-card flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <UserCircleIcon className="h-8 w-8 text-muted-foreground" />
                                    <div>
                                        <h2 className="text-sm font-semibold text-foreground flex items-center gap-1">
                                            {selectedSession.userName || selectedSession.userId?.name || 'Guest'}
                                            <CheckBadgeIcon className="h-4 w-4 text-primary" />
                                        </h2>
                                        <div className="flex items-center gap-1">
                                            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                                            <span className="text-[10px] text-muted-foreground">Active Session</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Messages Area */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {messages.map((msg, idx) => (
                                    <div
                                        key={idx}
                                        className={`flex flex-col ${msg.role === 'admin' || msg.role === 'assistant' ? 'items-end' : 'items-start'}`}
                                    >
                                        <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${msg.role === 'admin' || msg.role === 'assistant'
                                            ? 'bg-primary text-primary-foreground rounded-tr-none'
                                            : 'bg-card border border-border text-foreground rounded-tl-none'
                                            }`}>
                                            {msg.content}
                                        </div>
                                        <span className="text-[10px] text-muted-foreground mt-1 px-1">
                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                ))}
                                {isUserTyping && (
                                    <div className="flex flex-col items-start animate-pulse">
                                        <div className="bg-muted px-4 py-2 rounded-2xl rounded-tl-none text-xs text-muted-foreground italic">
                                            User is typing...
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <div className="p-4 bg-card border-t border-border">
                                <form
                                    className="flex gap-2"
                                    onSubmit={handleSendMessage}
                                >
                                    <input
                                        type="text"
                                        className="flex-1 rounded-full border-border bg-background py-2 px-4 text-sm text-foreground ring-1 ring-inset ring-border placeholder:text-muted-foreground focus:ring-2 focus:ring-primary"
                                        placeholder="Type your message..."
                                        value={msgInput}
                                        onChange={handleInputChange}
                                    />
                                    <button
                                        type="submit"
                                        className="p-2.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
                                    >
                                        <PaperAirplaneIcon className="h-5 w-5" />
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                            <ChatBubbleLeftRightIcon className="h-12 w-12 mb-4 opacity-20" />
                            <p>Select a conversation to start chatting</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
