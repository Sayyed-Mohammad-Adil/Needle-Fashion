"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExpenseCategories = exports.getExpenseSummary = exports.deleteExpense = exports.updateExpense = exports.createExpense = exports.getExpenseById = exports.getExpenses = void 0;
const expense_model_1 = require("../models/expense.model");
// @desc    Get all expenses
// @route   GET /api/expenses
// @access  Private/Admin
const getExpenses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = Number(req.query.page) || 1;
        const pageSize = Number(req.query.pageSize) || 10;
        // Build filter object
        const filterObj = {};
        // Filter by category
        if (req.query.category) {
            filterObj.category = req.query.category;
        }
        // Filter by date range
        if (req.query.startDate && req.query.endDate) {
            filterObj.date = {
                $gte: new Date(req.query.startDate),
                $lte: new Date(req.query.endDate),
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
        const count = yield expense_model_1.Expense.countDocuments(filterObj);
        const expenses = yield expense_model_1.Expense.find(filterObj)
            .sort({ date: -1 })
            .limit(pageSize)
            .skip(pageSize * (page - 1));
        res.json({
            expenses,
            page,
            pages: Math.ceil(count / pageSize),
            total: count,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getExpenses = getExpenses;
// @desc    Get expense by ID
// @route   GET /api/expenses/:id
// @access  Private/Admin
const getExpenseById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const expense = yield expense_model_1.Expense.findById(req.params.id);
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        res.json(expense);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getExpenseById = getExpenseById;
// @desc    Create a new expense
// @route   POST /api/expenses
// @access  Private/Admin
const createExpense = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, amount, category, date, description, receipt } = req.body;
        const expense = yield expense_model_1.Expense.create({
            title,
            amount,
            category,
            date: date || new Date(),
            description,
            receipt,
        });
        res.status(201).json(expense);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.createExpense = createExpense;
// @desc    Update an expense
// @route   PUT /api/expenses/:id
// @access  Private/Admin
const updateExpense = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const expense = yield expense_model_1.Expense.findById(req.params.id);
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        const { title, amount, category, date, description, receipt } = req.body;
        // Update fields if provided
        if (title)
            expense.title = title;
        if (amount)
            expense.amount = amount;
        if (category)
            expense.category = category;
        if (date)
            expense.date = new Date(date);
        if (description !== undefined)
            expense.description = description;
        if (receipt !== undefined)
            expense.receipt = receipt;
        const updatedExpense = yield expense.save();
        res.json(updatedExpense);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.updateExpense = updateExpense;
// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
// @access  Private/Admin
const deleteExpense = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const expense = yield expense_model_1.Expense.findById(req.params.id);
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        yield expense.deleteOne();
        res.json({ message: 'Expense removed' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.deleteExpense = deleteExpense;
// @desc    Get expense summary
// @route   GET /api/expenses/summary
// @access  Private/Admin
const getExpenseSummary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get date range from query params or default to current month
        const now = new Date();
        const startDate = req.query.startDate
            ? new Date(req.query.startDate)
            : new Date(now.getFullYear(), now.getMonth(), 1);
        const endDate = req.query.endDate
            ? new Date(req.query.endDate)
            : new Date(now.getFullYear(), now.getMonth() + 1, 0);
        // Get total expenses
        const totalExpenses = yield expense_model_1.Expense.aggregate([
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
        const expensesByCategory = yield expense_model_1.Expense.aggregate([
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
        const expensesByDate = yield expense_model_1.Expense.aggregate([
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
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getExpenseSummary = getExpenseSummary;
// @desc    Get expense categories
// @route   GET /api/expenses/categories
// @access  Private/Admin
const getExpenseCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield expense_model_1.Expense.distinct('category');
        res.json(categories);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getExpenseCategories = getExpenseCategories;
//# sourceMappingURL=expense.controller.js.map