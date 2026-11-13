"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChatHistory = exports.endChatSession = exports.sendMessage = exports.getChatSession = exports.getAllSessions = void 0;
const prisma_1 = require("../lib/prisma");
const getAllSessions = async (_req, res) => {
    try {
        const sessions = await prisma_1.prisma.chatSession.findMany({
            where: { isActive: true },
            orderBy: { updatedAt: 'desc' },
        });
        res.json((0, prisma_1.withMongoIds)(sessions));
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getAllSessions = getAllSessions;
const getChatSession = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const userId = req.user?.id || null;
        let session = await prisma_1.prisma.chatSession.findFirst({
            where: {
                sessionId,
                isActive: true,
                expiresAt: { gt: new Date() },
            },
        });
        if (!session) {
            session = await prisma_1.prisma.chatSession.create({
                data: {
                    sessionId,
                    userId,
                    messages: [],
                    context: {},
                    isActive: true,
                    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
                },
            });
        }
        res.json((0, prisma_1.withMongoId)(session));
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getChatSession = getChatSession;
const sendMessage = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { message, context } = req.body;
        const userId = req.user?.id || null;
        let session = await prisma_1.prisma.chatSession.findFirst({
            where: {
                sessionId,
                isActive: true,
                expiresAt: { gt: new Date() },
            },
        });
        if (!session) {
            session = await prisma_1.prisma.chatSession.create({
                data: {
                    sessionId,
                    userId,
                    messages: [],
                    context: context || {},
                    isActive: true,
                    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
                },
            });
        }
        const existingMessages = Array.isArray(session.messages) ? session.messages : [];
        const mergedContext = context
            ? { ...session.context, ...context }
            : session.context;
        const botResponse = await generateBotResponse(message, mergedContext);
        const now = new Date().toISOString();
        const updatedMessages = [
            ...existingMessages,
            { role: 'user', content: message, timestamp: now },
            { role: 'assistant', content: botResponse, timestamp: now },
        ];
        const updatedSession = await prisma_1.prisma.chatSession.update({
            where: { id: session.id },
            data: {
                messages: updatedMessages,
                context: mergedContext,
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
                lastMessage: {
                    content: botResponse,
                    role: 'assistant',
                    timestamp: now,
                },
            },
        });
        res.json((0, prisma_1.withMongoId)(updatedSession));
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.sendMessage = sendMessage;
const endChatSession = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const existing = await prisma_1.prisma.chatSession.findFirst({
            where: { sessionId, isActive: true },
        });
        if (!existing) {
            return res.status(404).json({ message: 'Chat session not found or already ended' });
        }
        const session = await prisma_1.prisma.chatSession.update({
            where: { id: existing.id },
            data: { isActive: false },
        });
        res.json((0, prisma_1.withMongoId)(session));
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.endChatSession = endChatSession;
const getChatHistory = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const pageSize = Number(req.query.pageSize) || 10;
        const where = {
            userId: req.user.id,
            isActive: false,
        };
        const [count, sessions] = await Promise.all([
            prisma_1.prisma.chatSession.count({ where }),
            prisma_1.prisma.chatSession.findMany({
                where,
                orderBy: { updatedAt: 'desc' },
                take: pageSize,
                skip: pageSize * (page - 1),
            }),
        ]);
        res.json({
            sessions: (0, prisma_1.withMongoIds)(sessions),
            page,
            pages: Math.ceil(count / pageSize),
            total: count,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getChatHistory = getChatHistory;
const generateBotResponse = async (userMessage, context) => {
    const lower = String(userMessage || '').toLowerCase();
    if (lower.includes('order') && lower.includes('status')) {
        if (context?.orderId) {
            const order = await prisma_1.prisma.order.findUnique({
                where: { id: String(context.orderId) },
                select: { status: true },
            });
            if (order) {
                return `Your order #${context.orderId} is currently ${order.status}.`;
            }
        }
        return 'I can help you track your order. Please provide your order ID or check your order history in your account.';
    }
    if (lower.includes('product') || lower.includes('kurta') || lower.includes('sherwani')) {
        if (context?.productId) {
            const product = await prisma_1.prisma.product.findUnique({
                where: { id: String(context.productId) },
                select: { name: true, price: true },
            });
            if (product) {
                return `The ${product.name} is available for ₹${product.price}. Would you like to know more about this product?`;
            }
        }
        return 'We have a wide range of tailored menswear including suits, shirts, trousers, accessories, and ceremonial Indian wear.';
    }
    if (lower.includes('size') || lower.includes('measurement') || lower.includes('fit')) {
        return 'We offer European sizes (EU 46–54) as well as 48-Point Bespoke custom measurements.';
    }
    if (lower.includes('shipping') || lower.includes('delivery') || lower.includes('return')) {
        return 'We provide white-glove insured international delivery. Returns or alterations are coordinated through your private salon.';
    }
    return "I'm here to help you with your shopping experience. You can ask me about products, orders, sizing, or bespoke appointments.";
};
//# sourceMappingURL=chatbot.controller.js.map