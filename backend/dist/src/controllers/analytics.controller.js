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
exports.trackSearchTerm = exports.trackProductView = exports.getUserAnalytics = exports.getProductAnalytics = exports.getSalesAnalytics = exports.getDashboardAnalytics = void 0;
const order_model_1 = require("../models/order.model");
const product_model_1 = require("../models/product.model");
const user_model_1 = require("../models/user.model");
const analytics_model_1 = require("../models/analytics.model");
// @desc    Get dashboard analytics
// @route   GET /api/admin/analytics/dashboard
// @access  Private/Admin
const getDashboardAnalytics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get date range (default to last 30 days)
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);
        // Get total revenue
        const totalRevenue = yield order_model_1.Order.aggregate([
            { $match: { isPaid: true } },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } },
        ]);
        // Get total orders
        const totalOrders = yield order_model_1.Order.countDocuments();
        // Get total users
        const totalUsers = yield user_model_1.User.countDocuments();
        // Get total products
        const totalProducts = yield product_model_1.Product.countDocuments();
        // Get recent orders
        const recentOrders = yield order_model_1.Order.find({})
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('user', 'name');
        // Get revenue by date (last 30 days)
        const revenueByDate = yield order_model_1.Order.aggregate([
            {
                $match: {
                    isPaid: true,
                    createdAt: { $gte: startDate, $lte: endDate },
                },
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    total: { $sum: '$totalPrice' },
                },
            },
            { $sort: { _id: 1 } },
        ]);
        // Get top selling products
        const topSellingProducts = yield order_model_1.Order.aggregate([
            { $match: { isPaid: true } },
            { $unwind: '$orderItems' },
            {
                $group: {
                    _id: '$orderItems.product',
                    name: { $first: '$orderItems.name' },
                    totalSold: { $sum: '$orderItems.qty' },
                    totalRevenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.qty'] } },
                },
            },
            { $sort: { totalSold: -1 } },
            { $limit: 5 },
        ]);
        // Get order status counts
        const orderStatusCounts = yield order_model_1.Order.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                },
            },
        ]);
        // Get low stock products
        const lowStockProducts = yield product_model_1.Product.find({ countInStock: { $lt: 10 } })
            .limit(5)
            .select('name category countInStock price');
        res.json({
            totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
            totalOrders,
            totalUsers,
            totalProducts,
            recentOrders,
            revenueByDate,
            topSellingProducts,
            orderStatusCounts,
            lowStockProducts,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getDashboardAnalytics = getDashboardAnalytics;
// @desc    Get sales analytics
// @route   GET /api/admin/analytics/sales
// @access  Private/Admin
const getSalesAnalytics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get date range from query params or default to last 30 days
        const endDate = req.query.endDate ? new Date(req.query.endDate) : new Date();
        const startDate = req.query.startDate
            ? new Date(req.query.startDate)
            : new Date(endDate);
        if (!req.query.startDate) {
            startDate.setDate(startDate.getDate() - 30);
        }
        // Get sales by date
        const salesByDate = yield order_model_1.Order.aggregate([
            {
                $match: {
                    isPaid: true,
                    createdAt: { $gte: startDate, $lte: endDate },
                },
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    totalSales: { $sum: '$totalPrice' },
                    orderCount: { $sum: 1 },
                    itemsSold: { $sum: { $size: '$orderItems' } },
                },
            },
            { $sort: { _id: 1 } },
        ]);
        // Get sales by category
        const salesByCategory = yield order_model_1.Order.aggregate([
            { $match: { isPaid: true } },
            { $unwind: '$orderItems' },
            {
                $lookup: {
                    from: 'products',
                    localField: 'orderItems.product',
                    foreignField: '_id',
                    as: 'productInfo',
                },
            },
            { $unwind: '$productInfo' },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'productInfo.category',
                    foreignField: '_id',
                    as: 'categoryInfo',
                },
            },
            { $unwind: '$categoryInfo' },
            {
                $group: {
                    _id: '$categoryInfo._id',
                    categoryName: { $first: '$categoryInfo.name' },
                    totalSales: { $sum: { $multiply: ['$orderItems.price', '$orderItems.qty'] } },
                    itemsSold: { $sum: '$orderItems.qty' },
                },
            },
            { $sort: { totalSales: -1 } },
        ]);
        // Get average order value
        const averageOrderValue = yield order_model_1.Order.aggregate([
            { $match: { isPaid: true } },
            { $group: { _id: null, avg: { $avg: '$totalPrice' } } },
        ]);
        // Store analytics data
        yield analytics_model_1.SalesAnalytics.create({
            date: new Date(),
            totalSales: salesByDate.reduce((acc, item) => acc + item.totalSales, 0),
            orderCount: salesByDate.reduce((acc, item) => acc + item.orderCount, 0),
            averageOrderValue: averageOrderValue.length > 0 ? averageOrderValue[0].avg : 0,
        });
        res.json({
            salesByDate,
            salesByCategory,
            averageOrderValue: averageOrderValue.length > 0 ? averageOrderValue[0].avg : 0,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getSalesAnalytics = getSalesAnalytics;
// @desc    Get product analytics
// @route   GET /api/admin/analytics/products
// @access  Private/Admin
const getProductAnalytics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get top viewed products
        const topViewedProducts = yield analytics_model_1.ViewAnalytics.aggregate([
            { $group: { _id: '$productId', totalViews: { $sum: 1 } } },
            { $sort: { totalViews: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'productInfo',
                },
            },
            { $unwind: '$productInfo' },
            {
                $project: {
                    _id: 1,
                    totalViews: 1,
                    name: '$productInfo.name',
                    price: '$productInfo.price',
                    image: { $arrayElemAt: ['$productInfo.images.url', 0] },
                },
            },
        ]);
        // Get top searched terms
        const topSearchTerms = yield analytics_model_1.SearchAnalytics.aggregate([
            { $group: { _id: '$searchTerm', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 },
        ]);
        // Get conversion rate by product
        const productConversionRate = yield product_model_1.Product.aggregate([
            {
                $lookup: {
                    from: 'viewanalytics',
                    localField: '_id',
                    foreignField: 'productId',
                    as: 'views',
                },
            },
            {
                $lookup: {
                    from: 'orders',
                    let: { productId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$isPaid', true] },
                                        {
                                            $in: [
                                                '$$productId',
                                                { $map: { input: '$orderItems', as: 'item', in: '$$item.product' } },
                                            ],
                                        },
                                    ],
                                },
                            },
                        },
                    ],
                    as: 'orders',
                },
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    viewCount: { $size: '$views' },
                    orderCount: { $size: '$orders' },
                    conversionRate: {
                        $cond: [
                            { $eq: [{ $size: '$views' }, 0] },
                            0,
                            { $divide: [{ $size: '$orders' }, { $size: '$views' }] },
                        ],
                    },
                },
            },
            { $match: { viewCount: { $gt: 0 } } },
            { $sort: { conversionRate: -1 } },
            { $limit: 10 },
        ]);
        res.json({
            topViewedProducts,
            topSearchTerms,
            productConversionRate,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getProductAnalytics = getProductAnalytics;
// @desc    Get user analytics
// @route   GET /api/admin/analytics/users
// @access  Private/Admin
const getUserAnalytics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get user registration over time
        const userRegistrationByDate = yield user_model_1.User.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);
        // Get top customers by order value
        const topCustomers = yield order_model_1.Order.aggregate([
            { $match: { isPaid: true } },
            {
                $group: {
                    _id: '$user',
                    totalSpent: { $sum: '$totalPrice' },
                    orderCount: { $sum: 1 },
                },
            },
            { $sort: { totalSpent: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'userInfo',
                },
            },
            { $unwind: '$userInfo' },
            {
                $project: {
                    _id: 1,
                    name: '$userInfo.name',
                    email: '$userInfo.email',
                    totalSpent: 1,
                    orderCount: 1,
                    averageOrderValue: { $divide: ['$totalSpent', '$orderCount'] },
                },
            },
        ]);
        res.json({
            userRegistrationByDate,
            topCustomers,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getUserAnalytics = getUserAnalytics;
// @desc    Track product view
// @route   POST /api/analytics/view
// @access  Public
const trackProductView = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { productId } = req.body;
        // Create view analytics entry
        yield analytics_model_1.ViewAnalytics.create({
            productId,
            userId: ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id) || null,
            date: new Date(),
            userAgent: req.headers['user-agent'],
            referrer: req.headers.referer || null,
        });
        res.status(201).json({ success: true });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.trackProductView = trackProductView;
// @desc    Track search term
// @route   POST /api/analytics/search
// @access  Public
const trackSearchTerm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { searchTerm, resultCount } = req.body;
        // Create search analytics entry
        yield analytics_model_1.SearchAnalytics.create({
            searchTerm,
            resultCount,
            userId: ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id) || null,
            date: new Date(),
        });
        res.status(201).json({ success: true });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.trackSearchTerm = trackSearchTerm;
//# sourceMappingURL=analytics.controller.js.map