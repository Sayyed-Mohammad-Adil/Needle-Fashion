import express from 'express';
import {
  registerUser,
  loginUser,
  refreshToken,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  addUserMeasurement,
  getUserMeasurements,
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  googleAuth,
} from '../controllers/user.controller';
import { protect, admin } from '../middleware/auth.middleware';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh', refreshToken);
router.post('/google', googleAuth);

// Protected routes
router.route('/me')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.route('/measurements')
  .get(protect, getUserMeasurements)
  .post(protect, addUserMeasurement);

router.route('/wishlist')
  .get(protect, getWishlist)
  .post(protect, addToWishlist);

router.delete('/wishlist/:productId', protect, removeFromWishlist);

// Admin routes
router.route('/')
  .get(protect, admin, getUsers);

router.route('/:id')
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

export default router;