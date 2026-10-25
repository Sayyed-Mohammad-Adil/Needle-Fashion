'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
    ChatBubbleLeftRightIcon,
    XMarkIcon,
    PaperAirplaneIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';
import io from 'socket.io-client';
import { useAuth } from '@/contexts/AuthContext';

const SOCKET_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<any[]>([]);
    const [msgInput, setMsgInput] = useState('');
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [isAdminTyping, setIsAdminTyping] = useState(false);
    const socketRef = useRef<any>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<any>(null);
    const { user, isAuthenticated } = useAuth();

    useEffect(() => {
        // Generate or retrieve sessionId
        let id = localStorage.getItem('chat_session_id');
        if (!id) {
            id = 'sess_' + Math.random().toString(36).substring(2, 15);
            localStorage.setItem('chat_session_id', id);
        }
        setSessionId(id);

        // Setup Socket
        socketRef.current = io(SOCKET_URL);
        socketRef.current.emit('join_room', id);

        socketRef.current.on('new_message', (data: any) => {
            setMessages(prev => [...prev, data]);
        });

        socketRef.current.on('typing', (data: any) => {
            if (data.sessionId === id && data.role === 'admin') {
                setIsAdminTyping(true);
            }
        });

        socketRef.current.on('stop_typing', (data: any) => {
            if (data.sessionId === id && data.role === 'admin') {
                setIsAdminTyping(false);
            }
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen, isAdminTyping]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!msgInput.trim() || !sessionId) return;

        socketRef.current.emit('send_message', {
            sessionId,
            content: msgInput,
            role: 'user',
            userId: user?._id || null,
            userName: user?.name || 'Guest',
            userEmail: user?.email || null
        });

        socketRef.current.emit('stop_typing', {
            sessionId,
            role: 'user'
        });

        setMsgInput('');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMsgInput(e.target.value);

        if (!sessionId) return;

        socketRef.current.emit('typing', {
            sessionId,
            role: 'user',
            userName: user?.name || 'Guest'
        });

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            socketRef.current.emit('stop_typing', {
                sessionId,
                role: 'user'
            });
        }, 3000);
    };

    return (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
            {/* Glassmorphic Chat Window */}
            {isOpen ? (
                <div className="glass-panel-gold rounded-3xl w-[calc(100vw-32px)] sm:w-96 max-w-sm flex flex-col overflow-hidden mb-3 shadow-2xl border border-[#C5A059]/40 animate-in slide-in-from-bottom-5 duration-300">
                    {/* Header */}
                    <div className="p-4 flex justify-between items-center bg-black/40 backdrop-blur-md border-b border-[#C5A059]/30 text-white">
                        <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full btn-glass-gold flex items-center justify-center font-serif font-bold text-sm">
                                N
                            </div>
                            <div>
                                <div className="flex items-center gap-1.5">
                                    <SparklesIcon className="w-3 h-3 text-[#C5A059]" />
                                    <h3 className="text-xs font-bold font-serif uppercase tracking-widest text-[#F3E7C4]">
                                        Atelier Concierge
                                    </h3>
                                </div>
                                <span className="text-[10px] font-medium text-emerald-400 flex items-center gap-1">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    Stylist Online
                                </span>
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsOpen(false)} 
                            className="glass-pill h-7 w-7 flex items-center justify-center text-white/80 hover:text-white transition-colors"
                        >
                            <XMarkIcon className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Messages Body */}
                    <div ref={scrollRef} className="h-72 sm:h-80 overflow-y-auto p-4 space-y-3 bg-background/60 backdrop-blur-md">
                        {messages.length === 0 && (
                            <div className="text-center py-8 px-4">
                                <div className="w-12 h-12 rounded-full glass-pill mx-auto flex items-center justify-center text-[#C5A059] mb-3">
                                    <ChatBubbleLeftRightIcon className="h-6 w-6" />
                                </div>
                                <p className="text-xs font-serif font-bold text-foreground">
                                    Needle Fashion Concierge
                                </p>
                                <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                                    Inquire about 24K gold zari weaves, wedding ensembles, bespoke sizing, or private salon appointments.
                                </p>
                            </div>
                        )}
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-xs ${
                                    msg.role === 'user'
                                        ? 'btn-glass-gold rounded-tr-none shadow-md font-medium'
                                        : 'glass-panel rounded-tl-none border border-border/60 text-foreground shadow-sm'
                                    }`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {isAdminTyping && (
                            <div className="flex justify-start">
                                <div className="glass-panel px-3 py-1.5 rounded-2xl rounded-tl-none text-[10px] text-[#C5A059] italic animate-pulse">
                                    Stylist is composing response...
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Field */}
                    <form onSubmit={handleSendMessage} className="p-3 border-t border-border/50 bg-background/70 backdrop-blur-md flex gap-2">
                        <input
                            type="text"
                            className="flex-1 glass-pill text-xs py-2.5 px-4 focus:outline-none focus:border-[#C5A059] text-foreground placeholder:text-muted-foreground"
                            placeholder="Type inquiry..."
                            value={msgInput}
                            onChange={handleInputChange}
                        />
                        <button 
                            type="submit" 
                            className="btn-glass-gold p-2.5 rounded-full shadow-md hover:scale-105 transition-transform flex-shrink-0"
                            aria-label="Send message"
                        >
                            <PaperAirplaneIcon className="h-4 w-4" />
                        </button>
                    </form>
                </div>
            ) : null}

            {/* Floating Glassmorphic Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="btn-glass-gold p-3 sm:p-4 rounded-full shadow-2xl hover:scale-110 transition-transform active:scale-95 flex items-center justify-center relative group"
                aria-label="Open Atelier Concierge"
            >
                <span className="absolute -top-1 -right-1 h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-emerald-500 border-2 border-white animate-pulse" />
                <ChatBubbleLeftRightIcon className="h-5 w-5 sm:h-6 sm:w-6 text-foreground" />
            </button>
        </div>
    );
}
