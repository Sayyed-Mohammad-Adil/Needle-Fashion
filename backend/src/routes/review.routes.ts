import express from 'express';
import {
  updateReview,
  deleteReview,
  reportReview,
  markReviewHelpful,
  getAdminReviews,
} from '../controllers/review.controller';
import { protect, admin } from '../middleware/auth.middleware';

const router = express.Router();

// Protected routes
router.route('/:id')
  .put(protect, updateReview)
  .delete(protect, deleteReview);

router.post('/:id/report', protect, reportReview);
router.post('/:id/helpful', protect, markReviewHelpful);

// Admin routes
router.get('/admin', protect, admin, getAdminReviews);

export default router;