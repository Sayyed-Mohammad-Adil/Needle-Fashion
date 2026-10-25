import express from 'express';
import {
  getNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification,
  markAsRead,
  markAllAsRead,
  getAdminNotifications,
} from '../controllers/notification.controller';
import { protect, admin } from '../middleware/auth.middleware';

const router = express.Router();

// User routes
router.route('/').get(protect, getNotifications);
router.route('/:id').get(protect, getNotificationById);
router.route('/:id/read').put(protect, markAsRead);
router.route('/read-all').put(protect, markAllAsRead);

// Admin routes
router.route('/').post(protect, admin, createNotification);
router.route('/:id').put(protect, admin, updateNotification);
router.route('/:id').delete(protect, admin, deleteNotification);
router.route('/admin').get(protect, admin, getAdminNotifications);

export default router;