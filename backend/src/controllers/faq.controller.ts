import { Request, Response } from 'express';
import { FAQ } from '../models/faq.model';

// @desc    Get all FAQs
// @route   GET /api/faqs
// @access  Public
export const getFAQs = async (req: Request, res: Response) => {
  try {
    const category = req.query.category as string;
    const query = category ? { category } : {};
    
    const faqs = await FAQ.find(query);
    res.json(faqs);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single FAQ by ID
// @route   GET /api/faqs/:id
// @access  Public
export const getFAQById = async (req: Request, res: Response) => {
  try {
    const faq = await FAQ.findById(req.params.id);

    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }

    res.json(faq);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a FAQ
// @route   POST /api/faqs
// @access  Private/Admin
export const createFAQ = async (req: Request, res: Response) => {
  try {
    const { question, answer, category } = req.body;

    // Create FAQ
    const faq = await FAQ.create({
      question,
      answer,
      category,
    });

    res.status(201).json(faq);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a FAQ
// @route   PUT /api/faqs/:id
// @access  Private/Admin
export const updateFAQ = async (req: Request, res: Response) => {
  try {
    const faq = await FAQ.findById(req.params.id);

    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }

    const { question, answer, category } = req.body;

    // Update fields if provided
    if (question) faq.question = question;
    if (answer) faq.answer = answer;
    if (category) faq.category = category;

    const updatedFAQ = await faq.save();
    res.json(updatedFAQ);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a FAQ
// @route   DELETE /api/faqs/:id
// @access  Private/Admin
export const deleteFAQ = async (req: Request, res: Response) => {
  try {
    const faq = await FAQ.findById(req.params.id);

    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }

    await faq.deleteOne();
    res.json({ message: 'FAQ removed' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search FAQs
// @route   GET /api/faqs/search
// @access  Public
export const searchFAQs = async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    // Search in both question and answer fields
    const faqs = await FAQ.find({
      $or: [
        { question: { $regex: query, $options: 'i' } },
        { answer: { $regex: query, $options: 'i' } },
      ],
    });

    res.json(faqs);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get FAQ categories
// @route   GET /api/faqs/categories
// @access  Public
export const getFAQCategories = async (req: Request, res: Response) => {
  try {
    const categories = await FAQ.distinct('category');
    res.json(categories);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get chatbot response
// @route   POST /api/faqs/chatbot
// @access  Public
export const getChatbotResponse = async (req: Request, res: Response) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ message: 'Query is required' });
    }

    // Simple keyword matching for chatbot responses
    // In a real implementation, this would use NLP or a more sophisticated algorithm
    const faqs = await FAQ.find({
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
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};