import express from 'express';
import {
  getChatSession,
  sendMessage,
  endChatSession,
  getChatHistory,
  getAllSessions,
} from '../controllers/chatbot.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// Public routes (but session-based)
router.route('/sessions/:sessionId').get(getChatSession);
router.route('/sessions/:sessionId/messages').post(sendMessage);
router.route('/sessions/:sessionId/end').put(endChatSession);

// Protected routes
router.route('/sessions').get(protect, getAllSessions);
router.route('/history').get(protect, getChatHistory);

export default router;