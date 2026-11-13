import { Server, Socket } from 'socket.io';
import { prisma } from '../lib/prisma';

export const setupSocket = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log('New client connected:', socket.id);

    socket.on('join_room', (sessionId: string) => {
      socket.join(sessionId);
      console.log(`Socket ${socket.id} joined room ${sessionId}`);
    });

    socket.on('send_message', async (data: any) => {
      const { sessionId, content, role, context } = data;

      try {
        let session = await prisma.chatSession.findUnique({
          where: { sessionId },
        });

        const existingMessages: any[] = Array.isArray(session?.messages)
          ? (session!.messages as any[])
          : [];

        const newMessage = {
          role: role === 'admin' ? 'admin' : 'user',
          content,
          timestamp: new Date().toISOString(),
        };

        const updatedMessages = [...existingMessages, newMessage];

        if (!session) {
          session = await prisma.chatSession.create({
            data: {
              sessionId,
              userId: data.userId || null,
              userName: data.userName || 'Guest',
              messages: updatedMessages,
              lastMessage: newMessage,
              context: context || {},
              isActive: true,
              expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
            },
          });
        } else {
          session = await prisma.chatSession.update({
            where: { sessionId },
            data: {
              userId: data.userId && !session.userId ? data.userId : session.userId,
              userName: data.userId && !session.userId ? data.userName : session.userName,
              messages: updatedMessages,
              lastMessage: newMessage,
              isActive: true,
            },
          });
        }

        io.to(sessionId).emit('new_message', {
          ...newMessage,
          sessionId,
        });

        if (role === 'user') {
          const lowerContent = String(content || '').toLowerCase();
          let autoReply = '';

          if (lowerContent.includes('hello') || lowerContent.includes('hi')) {
            autoReply = 'Hello! How can we help you with your fashion needs today?';
          } else if (lowerContent.includes('order')) {
            autoReply = "You can track your orders in the 'My Orders' section of your profile. Do you have a specific order number?";
          } else if (lowerContent.includes('shipping')) {
            autoReply = 'We offer complimentary white-glove shipping on qualifying bespoke orders.';
          } else if (lowerContent.includes('size')) {
            autoReply = "We provide European sizing (EU 46–54) and 48-Point Bespoke custom sizing on every piece!";
          }

          if (autoReply) {
            const replyMsg = {
              role: 'assistant',
              content: autoReply,
              timestamp: new Date().toISOString(),
            };
            await prisma.chatSession.update({
              where: { sessionId },
              data: {
                messages: [...updatedMessages, replyMsg],
                lastMessage: replyMsg,
              },
            });

            io.to(sessionId).emit('new_message', {
              ...replyMsg,
              sessionId,
            });
          }

          io.emit('admin_notification', {
            type: 'NEW_MESSAGE',
            sessionId,
            content,
            userName: data.userName || 'Guest',
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

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};
