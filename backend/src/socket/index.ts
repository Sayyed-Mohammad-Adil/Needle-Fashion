import { Server, Socket } from 'socket.io';
import { ChatSession } from '../models/chatbot.model';

export const setupSocket = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        console.log('New client connected:', socket.id);

        socket.on('join_room', (sessionId: string) => {
            socket.join(sessionId);
            console.log(`Socket ${socket.id} joined room ${sessionId}`);
        });

        socket.on('send_message', async (data: any) => {
            const { sessionId, content, role, context, userName } = data;

            try {
                // Find or Create session
                let session = await ChatSession.findOne({ sessionId });

                if (!session) {
                    session = new ChatSession({
                        sessionId,
                        userId: data.userId || null,
                        userName: data.userName || 'Guest',
                        messages: [],
                        context: context || {},
                        isActive: true
                    });
                } else if (data.userId && !session.userId) {
                    // Link guest session to user if they log in
                    session.userId = data.userId;
                    session.userName = data.userName;
                }

                const newMessage = {
                    role: role === 'admin' ? 'admin' : 'user',
                    content,
                    timestamp: new Date()
                };

                session.messages.push(newMessage as any);
                session.lastMessage = newMessage;
                session.isActive = true;
                session.updatedAt = new Date();

                await session.save();

                // Broadcast to the room
                io.to(sessionId).emit('new_message', {
                    ...newMessage,
                    sessionId
                });

                // Auto-replies
                if (role === 'user') {
                    const lowerContent = content.toLowerCase();
                    let autoReply = '';

                    if (lowerContent.includes('hello') || lowerContent.includes('hi')) {
                        autoReply = "Hello! How can we help you with your fashion needs today?";
                    } else if (lowerContent.includes('order')) {
                        autoReply = "You can track your orders in the 'My Orders' section of your profile. Do you have a specific order number?";
                    } else if (lowerContent.includes('shipping')) {
                        autoReply = "We offer free shipping on orders over ₹1000. Standard delivery takes 3-5 business days.";
                    } else if (lowerContent.includes('size')) {
                        autoReply = "We provide detailed size charts on every product page. We also offer 'Make to Order' for custom sizing!";
                    }

                    if (autoReply) {
                        const replyMsg = {
                            role: 'assistant',
                            content: autoReply,
                            timestamp: new Date()
                        };
                        session.messages.push(replyMsg as any);
                        session.lastMessage = replyMsg;
                        await session.save();

                        io.to(sessionId).emit('new_message', {
                            ...replyMsg,
                            sessionId
                        });
                    }

                    // Notify admin
                    io.emit('admin_notification', {
                        type: 'NEW_MESSAGE',
                        sessionId,
                        content,
                        userName: data.userName || 'Guest'
                    });
                }
            } catch (error) {
                console.error('Socket error:', error);
            }
        });

        socket.on('typing', (data: any) => {
            const { sessionId, userName, role } = data;
            socket.to(sessionId).emit('typing', { sessionId, userName, role });
        });

        socket.on('stop_typing', (data: any) => {
            const { sessionId, role } = data;
            socket.to(sessionId).emit('stop_typing', { sessionId, role });
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });
};
