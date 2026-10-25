import express from 'express';
import {
  getFilters,
  getFilterById,
  createFilter,
  updateFilter,
  deleteFilter,
  addFilterValue,
  removeFilterValue,
} from '../controllers/filter.controller';
import { protect, admin } from '../middleware/auth.middleware';

const router = express.Router();

router.route('/')
  .get(getFilters)
  .post(protect, admin, createFilter);

router.route('/:id')
  .get(getFilterById)
  .put(protect, admin, updateFilter)
  .delete(protect, admin, deleteFilter);

router.route('/:id/values')
  .post(protect, admin, addFilterValue);

router.route('/:id/values/:value')
  .delete(protect, admin, removeFilterValue);

export default router;