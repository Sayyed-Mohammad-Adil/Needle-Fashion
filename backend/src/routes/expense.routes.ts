import express from 'express';
import {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseSummary,
  getExpenseCategories,
} from '../controllers/expense.controller';
import { protect, admin } from '../middleware/auth.middleware';

const router = express.Router();

// All routes are admin-only
router.use(protect, admin);

router.route('/')
  .get(getExpenses)
  .post(createExpense);

router.get('/summary', getExpenseSummary);
router.get('/categories', getExpenseCategories);

router.route('/:id')
  .get(getExpenseById)
  .put(updateExpense)
  .delete(deleteExpense);

export default router;