import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getTopProducts,
} from '../controllers/product.controller';
import {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
  reportReview,
  markReviewHelpful,
} from '../controllers/review.controller';
import { protect, admin } from '../middleware/auth.middleware';
import { trackProductView } from '../controllers/analytics.controller';

const router = express.Router();

// Public routes
router.route('/')
  .get(getProducts)
  .post(protect, admin, createProduct);

router.get('/top', getTopProducts);

router.route('/:id')
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

// Review routes
router.route('/:id/reviews')
  .get(getProductReviews)
  .post(protect, createReview);

// Analytics routes
router.post('/:id/view', trackProductView);

export default router;