import express from 'express';
import {
  getFAQs,
  getFAQById,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  searchFAQs,
  getFAQCategories,
  getChatbotResponse,
} from '../controllers/faq.controller';
import { protect, admin } from '../middleware/auth.middleware';

const router = express.Router();

router.route('/')
  .get(getFAQs)
  .post(protect, admin, createFAQ);

router.get('/search', searchFAQs);
router.get('/categories', getFAQCategories);
router.post('/chatbot', getChatbotResponse);

router.route('/:id')
  .get(getFAQById)
  .put(protect, admin, updateFAQ)
  .delete(protect, admin, deleteFAQ);

export default router;