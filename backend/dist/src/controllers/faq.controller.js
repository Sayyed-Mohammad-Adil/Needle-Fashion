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
exports.getChatbotResponse = exports.getFAQCategories = exports.searchFAQs = exports.deleteFAQ = exports.updateFAQ = exports.createFAQ = exports.getFAQById = exports.getFAQs = void 0;
const faq_model_1 = require("../models/faq.model");
// @desc    Get all FAQs
// @route   GET /api/faqs
// @access  Public
const getFAQs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = req.query.category;
        const query = category ? { category } : {};
        const faqs = yield faq_model_1.FAQ.find(query);
        res.json(faqs);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getFAQs = getFAQs;
// @desc    Get single FAQ by ID
// @route   GET /api/faqs/:id
// @access  Public
const getFAQById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const faq = yield faq_model_1.FAQ.findById(req.params.id);
        if (!faq) {
            return res.status(404).json({ message: 'FAQ not found' });
        }
        res.json(faq);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getFAQById = getFAQById;
// @desc    Create a FAQ
// @route   POST /api/faqs
// @access  Private/Admin
const createFAQ = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { question, answer, category } = req.body;
        // Create FAQ
        const faq = yield faq_model_1.FAQ.create({
            question,
            answer,
            category,
        });
        res.status(201).json(faq);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.createFAQ = createFAQ;
// @desc    Update a FAQ
// @route   PUT /api/faqs/:id
// @access  Private/Admin
const updateFAQ = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const faq = yield faq_model_1.FAQ.findById(req.params.id);
        if (!faq) {
            return res.status(404).json({ message: 'FAQ not found' });
        }
        const { question, answer, category } = req.body;
        // Update fields if provided
        if (question)
            faq.question = question;
        if (answer)
            faq.answer = answer;
        if (category)
            faq.category = category;
        const updatedFAQ = yield faq.save();
        res.json(updatedFAQ);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.updateFAQ = updateFAQ;
// @desc    Delete a FAQ
// @route   DELETE /api/faqs/:id
// @access  Private/Admin
const deleteFAQ = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const faq = yield faq_model_1.FAQ.findById(req.params.id);
        if (!faq) {
            return res.status(404).json({ message: 'FAQ not found' });
        }
        yield faq.deleteOne();
        res.json({ message: 'FAQ removed' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.deleteFAQ = deleteFAQ;
// @desc    Search FAQs
// @route   GET /api/faqs/search
// @access  Public
const searchFAQs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = req.query.q;
        if (!query) {
            return res.status(400).json({ message: 'Search query is required' });
        }
        // Search in both question and answer fields
        const faqs = yield faq_model_1.FAQ.find({
            $or: [
                { question: { $regex: query, $options: 'i' } },
                { answer: { $regex: query, $options: 'i' } },
            ],
        });
        res.json(faqs);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.searchFAQs = searchFAQs;
// @desc    Get FAQ categories
// @route   GET /api/faqs/categories
// @access  Public
const getFAQCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield faq_model_1.FAQ.distinct('category');
        res.json(categories);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getFAQCategories = getFAQCategories;
// @desc    Get chatbot response
// @route   POST /api/faqs/chatbot
// @access  Public
const getChatbotResponse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { query } = req.body;
        if (!query) {
            return res.status(400).json({ message: 'Query is required' });
        }
        // Simple keyword matching for chatbot responses
        // In a real implementation, this would use NLP or a more sophisticated algorithm
        const faqs = yield faq_model_1.FAQ.find({
            $or: [
                { question: { $regex: query, $options: 'i' } },
                { answer: { $regex: query, $options: 'i' } },
            ],
        }).limit(3);
        if (faqs.length === 0) {
            return res.json({
                answer: "I'm sorry, I don't have an answer for that question. Please try rephrasing or contact our customer support for assistance.",
                relatedFAQs: [],
            });
        }
        // Return the best match and related FAQs
        res.json({
            answer: faqs[0].answer,
            relatedFAQs: faqs.slice(1),
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getChatbotResponse = getChatbotResponse;
//# sourceMappingURL=faq.controller.js.map