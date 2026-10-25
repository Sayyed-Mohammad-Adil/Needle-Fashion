"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocket = void 0;
const chatbot_model_1 = require("../models/chatbot.model");
const setupSocket = (io) => {
    io.on('connection', (socket) => {
        console.log('New client connected:', socket.id);
        socket.on('join_room', (sessionId) => {
            socket.join(sessionId);
            console.log(`Socket ${socket.id} joined room ${sessionId}`);
        });
        socket.on('send_message', (data) => __awaiter(void 0, void 0, void 0, function* () {
            const { sessionId, content, role, context, userName } = data;
            try {
                // Find or Create session
                let session = yield chatbot_model_1.ChatSession.findOne({ sessionId });
                if (!session) {
                    session = new chatbot_model_1.ChatSession({
                        sessionId,
                        userId: data.userId || null,
                        userName: data.userName || 'Guest',
                        messages: [],
                        context: context || {},
                        isActive: true
                    });
                }
                else if (data.userId && !session.userId) {
                    // Link guest session to user if they log in
                    session.userId = data.userId;
                    session.userName = data.userName;
                }
                const newMessage = {
                    role: role === 'admin' ? 'admin' : 'user',
                    content,
                    timestamp: new Date()
                };
                session.messages.push(newMessage);
                session.lastMessage = newMessage;
                session.isActive = true;
                session.updatedAt = new Date();
                yield session.save();
                // Broadcast to the room
                io.to(sessionId).emit('new_message', Object.assign(Object.assign({}, newMessage), { sessionId }));
                // Auto-replies
                if (role === 'user') {
                    const lowerContent = content.toLowerCase();
                    let autoReply = '';
                    if (lowerContent.includes('hello') || lowerContent.includes('hi')) {
                        autoReply = "Hello! How can we help you with your fashion needs today?";
                    }
                    else if (lowerContent.includes('order')) {
                        autoReply = "You can track your orders in the 'My Orders' section of your profile. Do you have a specific order number?";
                    }
                    else if (lowerContent.includes('shipping')) {
                        autoReply = "We offer free shipping on orders over ₹1000. Standard delivery takes 3-5 business days.";
                    }
                    else if (lowerContent.includes('size')) {
                        autoReply = "We provide detailed size charts on every product page. We also offer 'Make to Order' for custom sizing!";
                    }
                    if (autoReply) {
                        const replyMsg = {
                            role: 'assistant',
                            content: autoReply,
                            timestamp: new Date()
                        };
                        session.messages.push(replyMsg);
                        session.lastMessage = replyMsg;
                        yield session.save();
                        io.to(sessionId).emit('new_message', Object.assign(Object.assign({}, replyMsg), { sessionId }));
                    }
                    // Notify admin
                    io.emit('admin_notification', {
                        type: 'NEW_MESSAGE',
                        sessionId,
                        content,
                        userName: data.userName || 'Guest'
                    });
                }
            }
            catch (error) {
                console.error('Socket error:', error);
            }
        }));
        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });
};
exports.setupSocket = setupSocket;
//# sourceMappingURL=index.js.map