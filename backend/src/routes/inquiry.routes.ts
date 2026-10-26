import express from 'express';
import {
  createInquiry,
  getInquiries,
  getInquiryById,
  updateInquiry,
  deleteInquiry,
} from '../controllers/inquiry.controller';
import { protect, admin } from '../middleware/auth.middleware';

const router = express.Router();

// Public: Clients submitting inquiry / fitting booking
router.post('/', createInquiry);

// Protected Admin: Manage all client requests
router.get('/', protect, admin, getInquiries);
router.get('/:id', protect, admin, getInquiryById);
router.put('/:id', protect, admin, updateInquiry);
router.delete('/:id', protect, admin, deleteInquiry);

export default router;
