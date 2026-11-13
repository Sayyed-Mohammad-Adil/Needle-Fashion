import { Request, Response } from 'express';
import { prisma, withMongoId, withMongoIds } from '../lib/prisma';

export const getFAQs = async (req: Request, res: Response) => {
  try {
    const category = req.query.category as string;
    const faqs = await prisma.fAQ.findMany({
      where: category ? { category } : undefined,
      orderBy: { createdAt: 'desc' },
    });
    res.json(withMongoIds(faqs));
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getFAQById = async (req: Request, res: Response) => {
  try {
    const faq = await prisma.fAQ.findUnique({ where: { id: req.params.id } });
    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }
    res.json(withMongoId(faq));
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createFAQ = async (req: Request, res: Response) => {
  try {
    const { question, answer, category } = req.body;
    const faq = await prisma.fAQ.create({
      data: { question, answer, category },
    });
    res.status(201).json(withMongoId(faq));
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateFAQ = async (req: Request, res: Response) => {
  try {
    const faq = await prisma.fAQ.findUnique({ where: { id: req.params.id } });
    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }

    const { question, answer, category } = req.body;
    const updatedFAQ = await prisma.fAQ.update({
      where: { id: req.params.id },
      data: {
        question: question ?? faq.question,
        answer: answer ?? faq.answer,
        category: category !== undefined ? category : faq.category,
      },
    });
    res.json(withMongoId(updatedFAQ));
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteFAQ = async (req: Request, res: Response) => {
  try {
    const faq = await prisma.fAQ.findUnique({ where: { id: req.params.id } });
    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }

    await prisma.fAQ.delete({ where: { id: req.params.id } });
    res.json({ message: 'FAQ removed' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const searchFAQs = async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string;
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const faqs = await prisma.fAQ.findMany({
      where: {
        OR: [
          { question: { contains: query, mode: 'insensitive' } },
          { answer: { contains: query, mode: 'insensitive' } },
        ],
      },
    });
    res.json(withMongoIds(faqs));
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getFAQCategories = async (_req: Request, res: Response) => {
  try {
    const rows = await prisma.fAQ.findMany({
      distinct: ['category'],
      select: { category: true },
    });
    res.json(rows.map((r) => r.category).filter(Boolean));
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getChatbotResponse = async (req: Request, res: Response) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ message: 'Query is required' });
    }

    const faqs = await prisma.fAQ.findMany({
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
        answer:
          "I'm sorry, I don't have an answer for that question. Please try rephrasing or contact our customer support for assistance.",
        relatedFAQs: [],
      });
    }

    res.json({
      answer: faqs[0].answer,
      relatedFAQs: withMongoIds(faqs.slice(1)),
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
