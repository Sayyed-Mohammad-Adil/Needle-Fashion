import { Request, Response } from 'express';
import { Order } from '../models/order.model';
import { Product } from '../models/product.model';
import { User } from '../models/user.model';
import { SearchAnalytics, ViewAnalytics, SalesAnalytics } from '../models/analytics.model';

// @desc    Get dashboard analytics
// @route   GET /api/admin/analytics/dashboard
// @access  Private/Admin
export const getDashboardAnalytics = async (req: Request, res: Response) => {
  try {
    // Get date range (default to last 30 days)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    // Get total revenue
    const totalRevenue = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);

    // Get total orders
    const totalOrders = await Order.countDocuments();

    // Get total users
    const totalUsers = await User.countDocuments();

    // Get total products
    const totalProducts = await Product.countDocuments();

    // Get recent orders
    const recentOrders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name');

    // Get revenue by date (last 30 days)
    const revenueByDate = await Order.aggregate([
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
    const topSellingProducts = await Order.aggregate([
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
    const orderStatusCounts = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Get low stock products
    const lowStockProducts = await Product.find({ countInStock: { $lt: 10 } })
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
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get sales analytics
// @route   GET /api/admin/analytics/sales
// @access  Private/Admin
export const getSalesAnalytics = async (req: Request, res: Response) => {
  try {
    // Get date range from query params or default to last 30 days
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : new Date();
    const startDate = req.query.startDate
      ? new Date(req.query.startDate as string)
      : new Date(endDate);

    if (!req.query.startDate) {
      startDate.setDate(startDate.getDate() - 30);
    }

    // Get sales by date
    const salesByDate = await Order.aggregate([
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
    const salesByCategory = await Order.aggregate([
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
    const averageOrderValue = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, avg: { $avg: '$totalPrice' } } },
    ]);

    // Store analytics data
    await SalesAnalytics.create({
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
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get product analytics
// @route   GET /api/admin/analytics/products
// @access  Private/Admin
export const getProductAnalytics = async (req: Request, res: Response) => {
  try {
    // Get top viewed products
    const topViewedProducts = await ViewAnalytics.aggregate([
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
    const topSearchTerms = await SearchAnalytics.aggregate([
      { $group: { _id: '$searchTerm', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Get conversion rate by product
    const productConversionRate = await Product.aggregate([
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
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user analytics
// @route   GET /api/admin/analytics/users
// @access  Private/Admin
export const getUserAnalytics = async (req: Request, res: Response) => {
  try {
    // Get user registration over time
    const userRegistrationByDate = await User.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Get top customers by order value
    const topCustomers = await Order.aggregate([
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
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Track product view
// @route   POST /api/analytics/view
// @access  Public
export const trackProductView = async (req: Request, res: Response) => {
  try {
    const { productId } = req.body;

    // Create view analytics entry
    await ViewAnalytics.create({
      productId,
      userId: req.user?._id || null,
      date: new Date(),
      userAgent: req.headers['user-agent'],
      referrer: req.headers.referer || null,
    });

    res.status(201).json({ success: true });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Track search term
// @route   POST /api/analytics/search
// @access  Public
export const trackSearchTerm = async (req: Request, res: Response) => {
  try {
    const { searchTerm, resultCount } = req.body;

    // Create search analytics entry
    await SearchAnalytics.create({
      searchTerm,
      resultCount,
      userId: req.user?._id || null,
      date: new Date(),
    });

    res.status(201).json({ success: true });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};