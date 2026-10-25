import express from 'express';
import {
  getThemes,
  getDefaultTheme,
  getThemeById,
  createTheme,
  updateTheme,
  deleteTheme,
  setDefaultTheme,
} from '../controllers/theme.controller';
import { protect, admin } from '../middleware/auth.middleware';

const router = express.Router();

// Public routes
router.route('/').get(getThemes);
router.route('/default').get(getDefaultTheme);
router.route('/:id').get(getThemeById);

// Admin routes
router.route('/').post(protect, admin, createTheme);
router.route('/:id').put(protect, admin, updateTheme);
router.route('/:id').delete(protect, admin, deleteTheme);
router.route('/:id/default').put(protect, admin, setDefaultTheme);

export default router;