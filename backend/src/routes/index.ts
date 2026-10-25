import express from 'express';
import userRoutes from './user.routes';
import productRoutes from './product.routes';
import categoryRoutes from './category.routes';
import filterRoutes from './filter.routes';
import orderRoutes from './order.routes';
import reviewRoutes from './review.routes';
import faqRoutes from './faq.routes';
import analyticsRoutes from './analytics.routes';
import expenseRoutes from './expense.routes';
import themeRoutes from './theme.routes';
import notificationRoutes from './notification.routes';
import chatRoutes from './chat.routes';
import { notFound, errorHandler } from '../middleware/error.middleware';
import { sanitizeInput, preventNoSQLInjection, logSuspiciousActivity } from '../middleware/security.middleware';

const router = express.Router();

// Apply security middleware to all API routes
router.use(sanitizeInput);
router.use(preventNoSQLInjection);
router.use(logSuspiciousActivity);
router.use('/api', (req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

// API routes
router.use('/api/users', userRoutes);
router.use('/api/products', productRoutes);
router.use('/api/categories', categoryRoutes);
router.use('/api/filters', filterRoutes);
router.use('/api/orders', orderRoutes);
router.use('/api/reviews', reviewRoutes);
router.use('/api/faqs', faqRoutes);
router.use('/api/analytics', analyticsRoutes);
router.use('/api/expenses', expenseRoutes);
router.use('/api/themes', themeRoutes);
router.use('/api/notifications', notificationRoutes);
router.use('/api/chat', chatRoutes);

// Health check endpoint
router.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
router.use(notFound);
router.use(errorHandler);

export default router;