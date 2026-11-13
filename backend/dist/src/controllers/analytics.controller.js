"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExecutiveReport = exports.trackSearchTerm = exports.trackProductView = exports.getUserAnalytics = exports.getProductAnalytics = exports.getSalesAnalytics = exports.getDashboardAnalytics = void 0;
const prisma_1 = require("../lib/prisma");
const getDashboardAnalytics = async (_req, res) => {
    try {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);
        const [paidOrders, totalOrders, totalUsers, totalProducts, recentOrders, allNonCancelledOrders, lowStockProducts,] = await Promise.all([
            prisma_1.prisma.order.findMany({
                where: { isPaid: true },
                select: { totalPrice: true, createdAt: true },
            }),
            prisma_1.prisma.order.count(),
            prisma_1.prisma.user.count(),
            prisma_1.prisma.product.count(),
            prisma_1.prisma.order.findMany({
                orderBy: { createdAt: 'desc' },
                take: 5,
                include: { user: { select: { id: true, name: true } } },
            }),
            prisma_1.prisma.order.findMany({
                where: { status: { not: 'Cancelled' } },
                include: {
                    items: {
                        include: { product: { select: { id: true, name: true } } },
                    },
                },
            }),
            prisma_1.prisma.product.findMany({
                where: { stock: { lt: 10 } },
                take: 5,
                select: { id: true, name: true, categoryId: true, stock: true, price: true },
            }),
        ]);
        const totalRevenue = paidOrders.reduce((sum, o) => sum + o.totalPrice, 0);
        const revenueByDateMap = new Map();
        for (const o of paidOrders) {
            if (o.createdAt >= startDate && o.createdAt <= endDate) {
                const day = o.createdAt.toISOString().slice(0, 10);
                revenueByDateMap.set(day, (revenueByDateMap.get(day) || 0) + o.totalPrice);
            }
        }
        const revenueByDate = Array.from(revenueByDateMap.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([_id, total]) => ({ _id, total }));
        const productSalesMap = new Map();
        const statusMap = new Map();
        const allOrdersForStatus = await prisma_1.prisma.order.findMany({ select: { status: true } });
        for (const o of allOrdersForStatus) {
            statusMap.set(o.status, (statusMap.get(o.status) || 0) + 1);
        }
        for (const o of allNonCancelledOrders) {
            for (const item of o.items) {
                const entry = productSalesMap.get(item.productId) || {
                    _id: item.productId,
                    name: item.product?.name || 'Atelier Piece',
                    totalSold: 0,
                    totalRevenue: 0,
                };
                entry.totalSold += item.quantity;
                entry.totalRevenue += item.price * item.quantity;
                productSalesMap.set(item.productId, entry);
            }
        }
        const topSellingProducts = Array.from(productSalesMap.values())
            .sort((a, b) => b.totalSold - a.totalSold)
            .slice(0, 5);
        const orderStatusCounts = Array.from(statusMap.entries()).map(([_id, count]) => ({
            _id,
            count,
        }));
        res.json({
            totalRevenue,
            totalOrders,
            totalUsers,
            totalProducts,
            recentOrders: recentOrders.map((o) => ({
                ...(0, prisma_1.withMongoId)(o),
                user: o.user ? (0, prisma_1.withMongoId)(o.user) : null,
            })),
            revenueByDate,
            topSellingProducts,
            orderStatusCounts,
            lowStockProducts: (0, prisma_1.withMongoIds)(lowStockProducts),
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getDashboardAnalytics = getDashboardAnalytics;
const getSalesAnalytics = async (req, res) => {
    try {
        const endDate = req.query.endDate ? new Date(req.query.endDate) : new Date();
        const startDate = req.query.startDate
            ? new Date(req.query.startDate)
            : new Date(new Date(endDate).setDate(endDate.getDate() - 30));
        const paidOrders = await prisma_1.prisma.order.findMany({
            where: {
                isPaid: true,
                createdAt: { gte: startDate, lte: endDate },
            },
            include: {
                items: {
                    include: {
                        product: {
                            include: { category: { select: { id: true, name: true } } },
                        },
                    },
                },
            },
        });
        const dateMap = new Map();
        const categoryMap = new Map();
        let totalPaidAll = 0;
        for (const order of paidOrders) {
            totalPaidAll += order.totalPrice;
            const day = order.createdAt.toISOString().slice(0, 10);
            const dayEntry = dateMap.get(day) || {
                _id: day,
                totalSales: 0,
                orderCount: 0,
                itemsSold: 0,
            };
            dayEntry.totalSales += order.totalPrice;
            dayEntry.orderCount += 1;
            dayEntry.itemsSold += order.items.reduce((s, i) => s + i.quantity, 0);
            dateMap.set(day, dayEntry);
            for (const item of order.items) {
                const cat = item.product?.category;
                if (cat) {
                    const catEntry = categoryMap.get(cat.id) || {
                        _id: cat.id,
                        categoryName: cat.name,
                        totalSales: 0,
                        itemsSold: 0,
                    };
                    catEntry.totalSales += item.price * item.quantity;
                    catEntry.itemsSold += item.quantity;
                    categoryMap.set(cat.id, catEntry);
                }
            }
        }
        const salesByDate = Array.from(dateMap.values()).sort((a, b) => a._id.localeCompare(b._id));
        const salesByCategory = Array.from(categoryMap.values()).sort((a, b) => b.totalSales - a.totalSales);
        const averageOrderValue = paidOrders.length > 0 ? totalPaidAll / paidOrders.length : 0;
        res.json({
            salesByDate,
            salesByCategory,
            averageOrderValue,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getSalesAnalytics = getSalesAnalytics;
const getProductAnalytics = async (_req, res) => {
    try {
        const [views, searches, products, paidOrderItems] = await Promise.all([
            prisma_1.prisma.viewAnalytics.findMany(),
            prisma_1.prisma.searchAnalytics.findMany({ orderBy: { count: 'desc' }, take: 10 }),
            prisma_1.prisma.product.findMany({ select: { id: true, name: true, price: true, images: true } }),
            prisma_1.prisma.orderItem.findMany({
                where: { order: { isPaid: true } },
                select: { productId: true, orderId: true },
            }),
        ]);
        const viewCountByProduct = new Map();
        for (const v of views) {
            viewCountByProduct.set(v.productId, (viewCountByProduct.get(v.productId) || 0) + v.views);
        }
        const orderCountByProduct = new Map();
        for (const oi of paidOrderItems) {
            if (!orderCountByProduct.has(oi.productId)) {
                orderCountByProduct.set(oi.productId, new Set());
            }
            orderCountByProduct.get(oi.productId).add(oi.orderId);
        }
        const productMap = new Map(products.map((p) => [p.id, p]));
        const topViewedProducts = Array.from(viewCountByProduct.entries())
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10)
            .map(([productId, totalViews]) => {
            const prod = productMap.get(productId);
            const imgs = Array.isArray(prod?.images) ? prod.images : [];
            return {
                _id: productId,
                totalViews,
                name: prod?.name || 'Atelier Piece',
                price: prod?.price || 0,
                image: imgs[0]?.data || imgs[0]?.url || '',
            };
        });
        const topSearchTerms = searches.map((s) => ({
            _id: s.keyword,
            count: s.count,
        }));
        const productConversionRate = products
            .map((p) => {
            const viewCount = viewCountByProduct.get(p.id) || 0;
            const orderCount = orderCountByProduct.get(p.id)?.size || 0;
            return {
                _id: p.id,
                name: p.name,
                viewCount,
                orderCount,
                conversionRate: viewCount > 0 ? orderCount / viewCount : 0,
            };
        })
            .filter((x) => x.viewCount > 0)
            .sort((a, b) => b.conversionRate - a.conversionRate)
            .slice(0, 10);
        res.json({
            topViewedProducts,
            topSearchTerms,
            productConversionRate,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getProductAnalytics = getProductAnalytics;
const getUserAnalytics = async (_req, res) => {
    try {
        const [users, paidOrders] = await Promise.all([
            prisma_1.prisma.user.findMany({ select: { id: true, name: true, email: true, createdAt: true } }),
            prisma_1.prisma.order.findMany({
                where: { isPaid: true },
                select: { userId: true, totalPrice: true },
            }),
        ]);
        const regMap = new Map();
        const userMap = new Map(users.map((u) => [u.id, u]));
        for (const u of users) {
            const day = u.createdAt.toISOString().slice(0, 10);
            regMap.set(day, (regMap.get(day) || 0) + 1);
        }
        const userRegistrationByDate = Array.from(regMap.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([_id, count]) => ({ _id, count }));
        const spendMap = new Map();
        for (const o of paidOrders) {
            const entry = spendMap.get(o.userId) || { totalSpent: 0, orderCount: 0 };
            entry.totalSpent += o.totalPrice;
            entry.orderCount += 1;
            spendMap.set(o.userId, entry);
        }
        const topCustomers = Array.from(spendMap.entries())
            .sort(([, a], [, b]) => b.totalSpent - a.totalSpent)
            .slice(0, 10)
            .map(([userId, stats]) => {
            const u = userMap.get(userId);
            return {
                _id: userId,
                name: u?.name || 'Patron Client',
                email: u?.email || '',
                totalSpent: stats.totalSpent,
                orderCount: stats.orderCount,
                averageOrderValue: stats.orderCount > 0 ? stats.totalSpent / stats.orderCount : 0,
            };
        });
        res.json({
            userRegistrationByDate,
            topCustomers,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getUserAnalytics = getUserAnalytics;
const trackProductView = async (req, res) => {
    try {
        const { productId } = req.body;
        if (productId) {
            await prisma_1.prisma.viewAnalytics.create({
                data: {
                    productId: String(productId),
                    views: 1,
                    date: new Date(),
                },
            });
        }
        res.status(201).json({ success: true });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.trackProductView = trackProductView;
const trackSearchTerm = async (req, res) => {
    try {
        const keyword = String(req.body.searchTerm || req.body.keyword || '').trim();
        if (keyword) {
            const existing = await prisma_1.prisma.searchAnalytics.findFirst({
                where: { keyword: { equals: keyword, mode: 'insensitive' } },
            });
            if (existing) {
                await prisma_1.prisma.searchAnalytics.update({
                    where: { id: existing.id },
                    data: { count: { increment: 1 }, date: new Date() },
                });
            }
            else {
                await prisma_1.prisma.searchAnalytics.create({
                    data: { keyword, count: 1, date: new Date() },
                });
            }
        }
        res.status(201).json({ success: true });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.trackSearchTerm = trackSearchTerm;
const getExecutiveReport = async (req, res) => {
    try {
        const endDate = req.query.to ? new Date(req.query.to) : new Date();
        const startDate = req.query.from
            ? new Date(req.query.from)
            : new Date(new Date().setDate(endDate.getDate() - 30));
        const [ordersInPeriod, expensesInPeriod, allNonCancelledOrders] = await Promise.all([
            prisma_1.prisma.order.findMany({
                where: {
                    createdAt: { gte: startDate, lte: endDate },
                    status: { not: 'Cancelled' },
                },
                include: { items: true },
            }),
            prisma_1.prisma.expense.findMany({
                where: { date: { gte: startDate, lte: endDate } },
            }),
            prisma_1.prisma.order.findMany({
                where: { status: { not: 'Cancelled' } },
                include: { user: { select: { id: true, name: true, email: true } } },
            }),
        ]);
        let grossBooked = 0;
        let paidRevenue = 0;
        let paidCount = 0;
        const sizeMap = new Map();
        const tailoringMap = new Map();
        for (const o of ordersInPeriod) {
            grossBooked += o.totalPrice;
            if (o.isPaid) {
                paidRevenue += o.totalPrice;
                paidCount += 1;
            }
            const stage = o.tailoringStage || 'Pattern Drafting';
            tailoringMap.set(stage, (tailoringMap.get(stage) || 0) + 1);
            for (const item of o.items) {
                const key = String(item.size);
                const sz = sizeMap.get(key) || { _id: key, units: 0, revenue: 0 };
                sz.units += item.quantity;
                sz.revenue += item.price * item.quantity;
                sizeMap.set(key, sz);
            }
        }
        const expenseCatMap = new Map();
        let totalExpenses = 0;
        for (const exp of expensesInPeriod) {
            totalExpenses += exp.amount;
            const cat = expenseCatMap.get(exp.category) || {
                _id: exp.category,
                totalAmount: 0,
                count: 0,
            };
            cat.totalAmount += exp.amount;
            cat.count += 1;
            expenseCatMap.set(exp.category, cat);
        }
        const clientMap = new Map();
        for (const o of allNonCancelledOrders) {
            const existing = clientMap.get(o.userId) || {
                _id: o.userId,
                name: o.user?.name || 'Patron Client',
                email: o.user?.email || '',
                totalSpent: 0,
                orderCount: 0,
                lastOrderAt: o.createdAt,
            };
            existing.totalSpent += o.totalPrice;
            existing.orderCount += 1;
            if (o.createdAt > existing.lastOrderAt)
                existing.lastOrderAt = o.createdAt;
            clientMap.set(o.userId, existing);
        }
        const netProfit = paidRevenue - totalExpenses;
        const netMarginPercent = paidRevenue > 0 ? Math.round((netProfit / paidRevenue) * 1000) / 10 : 0;
        res.json({
            success: true,
            period: { startDate, endDate },
            summary: {
                grossBooked,
                paidRevenue,
                totalExpenses,
                netProfit,
                netMarginPercent,
                orderCount: ordersInPeriod.length,
                paidCount,
            },
            expensesByCategory: Array.from(expenseCatMap.values()),
            sizeBreakdown: Array.from(sizeMap.values()).sort((a, b) => b.units - a.units),
            tailoringBreakdown: Array.from(tailoringMap.entries()).map(([_id, count]) => ({
                _id,
                count,
            })),
            topClients: Array.from(clientMap.values())
                .sort((a, b) => b.totalSpent - a.totalSpent)
                .slice(0, 10),
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getExecutiveReport = getExecutiveReport;
//# sourceMappingURL=analytics.controller.js.map