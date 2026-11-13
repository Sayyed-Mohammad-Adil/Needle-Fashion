"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExpenseCategories = exports.getExpenseSummary = exports.deleteExpense = exports.updateExpense = exports.createExpense = exports.getExpenseById = exports.getExpenses = void 0;
const prisma_1 = require("../lib/prisma");
const getExpenses = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const pageSize = Number(req.query.pageSize) || 10;
        const where = {};
        if (req.query.category) {
            where.category = String(req.query.category);
        }
        if (req.query.startDate && req.query.endDate) {
            where.date = {
                gte: new Date(req.query.startDate),
                lte: new Date(req.query.endDate),
            };
        }
        if (req.query.minAmount || req.query.maxAmount) {
            where.amount = {};
            if (req.query.minAmount)
                where.amount.gte = Number(req.query.minAmount);
            if (req.query.maxAmount)
                where.amount.lte = Number(req.query.maxAmount);
        }
        const [count, expenses] = await Promise.all([
            prisma_1.prisma.expense.count({ where }),
            prisma_1.prisma.expense.findMany({
                where,
                orderBy: { date: 'desc' },
                take: pageSize,
                skip: pageSize * (page - 1),
            }),
        ]);
        res.json({
            expenses: (0, prisma_1.withMongoIds)(expenses),
            page,
            pages: Math.ceil(count / pageSize),
            total: count,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getExpenses = getExpenses;
const getExpenseById = async (req, res) => {
    try {
        const expense = await prisma_1.prisma.expense.findUnique({ where: { id: req.params.id } });
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        res.json((0, prisma_1.withMongoId)(expense));
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getExpenseById = getExpenseById;
const createExpense = async (req, res) => {
    try {
        const { title, amount, category, date, description, receipt } = req.body;
        const expense = await prisma_1.prisma.expense.create({
            data: {
                title,
                amount: Number(amount),
                category,
                date: date ? new Date(date) : new Date(),
                description,
                receipt,
            },
        });
        res.status(201).json((0, prisma_1.withMongoId)(expense));
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.createExpense = createExpense;
const updateExpense = async (req, res) => {
    try {
        const expense = await prisma_1.prisma.expense.findUnique({ where: { id: req.params.id } });
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        const { title, amount, category, date, description, receipt } = req.body;
        const updatedExpense = await prisma_1.prisma.expense.update({
            where: { id: req.params.id },
            data: {
                title: title ?? expense.title,
                amount: amount !== undefined ? Number(amount) : expense.amount,
                category: category ?? expense.category,
                date: date ? new Date(date) : expense.date,
                description: description !== undefined ? description : expense.description,
                receipt: receipt !== undefined ? receipt : expense.receipt,
            },
        });
        res.json((0, prisma_1.withMongoId)(updatedExpense));
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updateExpense = updateExpense;
const deleteExpense = async (req, res) => {
    try {
        const expense = await prisma_1.prisma.expense.findUnique({ where: { id: req.params.id } });
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        await prisma_1.prisma.expense.delete({ where: { id: req.params.id } });
        res.json({ message: 'Expense removed' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.deleteExpense = deleteExpense;
const getExpenseSummary = async (req, res) => {
    try {
        const now = new Date();
        const startDate = req.query.startDate
            ? new Date(req.query.startDate)
            : new Date(now.getFullYear(), now.getMonth(), 1);
        const endDate = req.query.endDate
            ? new Date(req.query.endDate)
            : new Date(now.getFullYear(), now.getMonth() + 1, 0);
        const expenses = await prisma_1.prisma.expense.findMany({
            where: { date: { gte: startDate, lte: endDate } },
            orderBy: { date: 'asc' },
        });
        const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
        const byCategoryMap = new Map();
        const byDateMap = new Map();
        for (const e of expenses) {
            const catEntry = byCategoryMap.get(e.category) || { _id: e.category, total: 0, count: 0 };
            catEntry.total += e.amount;
            catEntry.count += 1;
            byCategoryMap.set(e.category, catEntry);
            const day = e.date.toISOString().slice(0, 10);
            const dateEntry = byDateMap.get(day) || { _id: day, total: 0, count: 0 };
            dateEntry.total += e.amount;
            dateEntry.count += 1;
            byDateMap.set(day, dateEntry);
        }
        res.json({
            totalAmount,
            totalCount: expenses.length,
            byCategory: Array.from(byCategoryMap.values()).sort((a, b) => b.total - a.total),
            byDate: Array.from(byDateMap.values()),
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getExpenseSummary = getExpenseSummary;
const getExpenseCategories = async (_req, res) => {
    try {
        const rows = await prisma_1.prisma.expense.findMany({
            distinct: ['category'],
            select: { category: true },
        });
        res.json(rows.map((r) => r.category));
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getExpenseCategories = getExpenseCategories;
//# sourceMappingURL=expense.controller.js.map