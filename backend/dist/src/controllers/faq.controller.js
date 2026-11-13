"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChatbotResponse = exports.getFAQCategories = exports.searchFAQs = exports.deleteFAQ = exports.updateFAQ = exports.createFAQ = exports.getFAQById = exports.getFAQs = void 0;
const prisma_1 = require("../lib/prisma");
const getFAQs = async (req, res) => {
    try {
        const category = req.query.category;
        const faqs = await prisma_1.prisma.fAQ.findMany({
            where: category ? { category } : undefined,
            orderBy: { createdAt: 'desc' },
        });
        res.json((0, prisma_1.withMongoIds)(faqs));
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getFAQs = getFAQs;
const getFAQById = async (req, res) => {
    try {
        const faq = await prisma_1.prisma.fAQ.findUnique({ where: { id: req.params.id } });
        if (!faq) {
            return res.status(404).json({ message: 'FAQ not found' });
        }
        res.json((0, prisma_1.withMongoId)(faq));
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getFAQById = getFAQById;
const createFAQ = async (req, res) => {
    try {
        const { question, answer, category } = req.body;
        const faq = await prisma_1.prisma.fAQ.create({
            data: { question, answer, category },
        });
        res.status(201).json((0, prisma_1.withMongoId)(faq));
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.createFAQ = createFAQ;
const updateFAQ = async (req, res) => {
    try {
        const faq = await prisma_1.prisma.fAQ.findUnique({ where: { id: req.params.id } });
        if (!faq) {
            return res.status(404).json({ message: 'FAQ not found' });
        }
        const { question, answer, category } = req.body;
        const updatedFAQ = await prisma_1.prisma.fAQ.update({
            where: { id: req.params.id },
            data: {
                question: question ?? faq.question,
                answer: answer ?? faq.answer,
                category: category !== undefined ? category : faq.category,
            },
        });
        res.json((0, prisma_1.withMongoId)(updatedFAQ));
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updateFAQ = updateFAQ;
const deleteFAQ = async (req, res) => {
    try {
        const faq = await prisma_1.prisma.fAQ.findUnique({ where: { id: req.params.id } });
        if (!faq) {
            return res.status(404).json({ message: 'FAQ not found' });
        }
        await prisma_1.prisma.fAQ.delete({ where: { id: req.params.id } });
        res.json({ message: 'FAQ removed' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.deleteFAQ = deleteFAQ;
const searchFAQs = async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) {
            return res.status(400).json({ message: 'Search query is required' });
        }
        const faqs = await prisma_1.prisma.fAQ.findMany({
            where: {
                OR: [
                    { question: { contains: query, mode: 'insensitive' } },
                    { answer: { contains: query, mode: 'insensitive' } },
                ],
            },
        });
        res.json((0, prisma_1.withMongoIds)(faqs));
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.searchFAQs = searchFAQs;
const getFAQCategories = async (_req, res) => {
    try {
        const rows = await prisma_1.prisma.fAQ.findMany({
            distinct: ['category'],
            select: { category: true },
        });
        res.json(rows.map((r) => r.category).filter(Boolean));
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getFAQCategories = getFAQCategories;
const getChatbotResponse = async (req, res) => {
    try {
        const { query } = req.body;
        if (!query) {
            return res.status(400).json({ message: 'Query is required' });
        }
        const faqs = await prisma_1.prisma.fAQ.findMany({
            where: {
                OR: [
                    { question: { contains: query, mode: 'insensitive' } },
                    { answer: { contains: query, mode: 'insensitive' } },
                ],
            },
            take: 3,
        });
        if (faqs.length === 0) {
            return res.json({
                answer: "I'm sorry, I don't have an answer for that question. Please try rephrasing or contact our customer support for assistance.",
                relatedFAQs: [],
            });
        }
        res.json({
            answer: faqs[0].answer,
            relatedFAQs: (0, prisma_1.withMongoIds)(faqs.slice(1)),
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getChatbotResponse = getChatbotResponse;
//# sourceMappingURL=faq.controller.js.map