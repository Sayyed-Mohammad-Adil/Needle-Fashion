import { Request, Response } from 'express';
import { Expense } from '../models/expense.model';

// @desc    Get all expenses
// @route   GET /api/expenses
// @access  Private/Admin
export const getExpenses = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;

    // Build filter object
    const filterObj: any = {};

    // Filter by category
    if (req.query.category) {
      filterObj.category = req.query.category;
    }

    // Filter by date range
    if (req.query.startDate && req.query.endDate) {
      filterObj.date = {
        $gte: new Date(req.query.startDate as string),
        $lte: new Date(req.query.endDate as string),
      };
    }

    // Filter by amount range
    if (req.query.minAmount || req.query.maxAmount) {
      filterObj.amount = {};
      if (req.query.minAmount) {
        filterObj.amount.$gte = Number(req.query.minAmount);
      }
      if (req.query.maxAmount) {
        filterObj.amount.$lte = Number(req.query.maxAmount);
      }
    }

    // Execute query with pagination
    const count = await Expense.countDocuments(filterObj);
    const expenses = await Expense.find(filterObj)
      .sort({ date: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      expenses,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get expense by ID
// @route   GET /api/expenses/:id
// @access  Private/Admin
export const getExpenseById = async (req: Request, res: Response) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json(expense);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new expense
// @route   POST /api/expenses
// @access  Private/Admin
export const createExpense = async (req: Request, res: Response) => {
  try {
    const { title, amount, category, date, description, receipt } = req.body;

    const expense = await Expense.create({
      title,
      amount,
      category,
      date: date || new Date(),
      description,
      receipt,
    });

    res.status(201).json(expense);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an expense
// @route   PUT /api/expenses/:id
// @access  Private/Admin
export const updateExpense = async (req: Request, res: Response) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    const { title, amount, category, date, description, receipt } = req.body;

    // Update fields if provided
    if (title) expense.title = title;
    if (amount) expense.amount = amount;
    if (category) expense.category = category;
    if (date) expense.date = new Date(date);
    if (description !== undefined) expense.description = description;
    if (receipt !== undefined) expense.receipt = receipt;

    const updatedExpense = await expense.save();
    res.json(updatedExpense);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
// @access  Private/Admin
export const deleteExpense = async (req: Request, res: Response) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    await expense.deleteOne();
    res.json({ message: 'Expense removed' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get expense summary
// @route   GET /api/expenses/summary
// @access  Private/Admin
export const getExpenseSummary = async (req: Request, res: Response) => {
  try {
    // Get date range from query params or default to current month
    const now = new Date();
    const startDate = req.query.startDate
      ? new Date(req.query.startDate as string)
      : new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = req.query.endDate
      ? new Date(req.query.endDate as string)
      : new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Get total expenses
    const totalExpenses = await Expense.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    // Get expenses by category
    const expensesByCategory = await Expense.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);

    // Get expenses by date
    const expensesByDate = await Expense.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      totalAmount: totalExpenses.length > 0 ? totalExpenses[0].total : 0,
      totalCount: totalExpenses.length > 0 ? totalExpenses[0].count : 0,
      byCategory: expensesByCategory,
      byDate: expensesByDate,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get expense categories
// @route   GET /api/expenses/categories
// @access  Private/Admin
export const getExpenseCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Expense.distinct('category');
    res.json(categories);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};