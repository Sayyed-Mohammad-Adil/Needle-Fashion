import express from 'express';
import {
  getDashboardAnalytics,
  getSalesAnalytics,
  getProductAnalytics,
  getUserAnalytics,
  trackProductView,
  trackSearchTerm,
} from '../controllers/analytics.controller';
import { protect, admin } from '../middleware/auth.middleware';

const router = express.Router();

// Public tracking endpoints
router.post('/view', trackProductView);
router.post('/search', trackSearchTerm);

// Admin analytics endpoints
router.get('/dashboard', protect, admin, getDashboardAnalytics);
router.get('/sales', protect, admin, getSalesAnalytics);
router.get('/products', protect, admin, getProductAnalytics);
router.get('/users', protect, admin, getUserAnalytics);

export default router;