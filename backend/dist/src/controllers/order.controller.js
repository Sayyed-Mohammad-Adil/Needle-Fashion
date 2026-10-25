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
exports.generateInvoice = exports.cancelOrder = exports.updateOrderStatus = exports.getOrders = exports.getMyOrders = exports.updateOrderToDelivered = exports.updateOrderToPaid = exports.getOrderById = exports.createOrder = void 0;
const order_model_1 = require("../models/order.model");
const product_model_1 = require("../models/product.model");
const invoice_utils_1 = require("../utils/invoice.utils");
// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { items, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice, gstBreakdown, } = req.body;
        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }
        // Verify product prices and calculate totals
        const verifiedItems = yield Promise.all(items.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            const product = yield product_model_1.Product.findById(item.product);
            if (!product) {
                throw new Error(`Product not found: ${item.product}`);
            }
            // Verify price
            if (product.price !== item.price) {
                throw new Error(`Price mismatch for product: ${product.name}`);
            }
            // Verify stock
            if (product.stock < item.quantity) {
                throw new Error(`Insufficient stock for product: ${product.name}`);
            }
            // Update stock
            product.stock -= item.quantity;
            yield product.save();
            return {
                name: product.name,
                quantity: item.quantity,
                image: product.images && product.images.length > 0 ? product.images[0].data : '',
                price: product.price,
                product: product._id,
                size: item.size,
                fitting: item.fitting,
            };
        })));
        // Create order
        const order = yield order_model_1.Order.create({
            user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
            orderItems: verifiedItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            gstBreakdown,
        });
        res.status(201).json(order);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.createOrder = createOrder;
// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const order = yield order_model_1.Order.findById(req.params.id).populate('user', 'name email');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        // Check if user is authorized to view this order
        if (order.user._id.toString() !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id.toString()) &&
            ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to view this order' });
        }
        res.json(order);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getOrderById = getOrderById;
// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const order = yield order_model_1.Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        // Update order status
        order.isPaid = true;
        order.paidAt = new Date();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            updateTime: req.body.update_time,
            emailAddress: (_a = req.body.payer) === null || _a === void 0 ? void 0 : _a.email_address,
        };
        const updatedOrder = yield order.save();
        res.json(updatedOrder);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.updateOrderToPaid = updateOrderToPaid;
// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield order_model_1.Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        // Update order status
        order.deliveredAt = new Date();
        order.status = 'Delivered';
        const updatedOrder = yield order.save();
        res.json(updatedOrder);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.updateOrderToDelivered = updateOrderToDelivered;
// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const page = Number(req.query.page) || 1;
        const pageSize = Number(req.query.pageSize) || 10;
        const count = yield order_model_1.Order.countDocuments({ user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id });
        const orders = yield order_model_1.Order.find({ user: (_b = req.user) === null || _b === void 0 ? void 0 : _b._id })
            .sort({ createdAt: -1 })
            .limit(pageSize)
            .skip(pageSize * (page - 1));
        res.json({
            orders,
            page,
            pages: Math.ceil(count / pageSize),
            total: count,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getMyOrders = getMyOrders;
// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = Number(req.query.page) || 1;
        const pageSize = Number(req.query.pageSize) || 10;
        // Build filter object
        const filterObj = {};
        // Filter by status
        if (req.query.status) {
            filterObj.status = req.query.status;
        }
        // Filter by payment status
        if (req.query.isPaid === 'true') {
            filterObj.isPaid = true;
        }
        else if (req.query.isPaid === 'false') {
            filterObj.isPaid = false;
        }
        // Filter by delivery status
        if (req.query.isDelivered === 'true') {
            filterObj.deliveredAt = { $ne: null };
        }
        else if (req.query.isDelivered === 'false') {
            filterObj.deliveredAt = null;
        }
        // Date range filter
        if (req.query.startDate && req.query.endDate) {
            filterObj.createdAt = {
                $gte: new Date(req.query.startDate),
                $lte: new Date(req.query.endDate),
            };
        }
        const count = yield order_model_1.Order.countDocuments(filterObj);
        const orders = yield order_model_1.Order.find(filterObj)
            .populate('user', 'id name')
            .sort({ createdAt: -1 })
            .limit(pageSize)
            .skip(pageSize * (page - 1));
        res.json({
            orders,
            page,
            pages: Math.ceil(count / pageSize),
            total: count,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getOrders = getOrders;
// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield order_model_1.Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        const { status } = req.body;
        // Update order status
        order.status = status;
        // If status is delivered, update deliveredAt
        if (status === 'Delivered') {
            order.deliveredAt = new Date();
        }
        // If status is cancelled, restore product stock
        if (status === 'Cancelled') {
            yield Promise.all(order.items.map((item) => __awaiter(void 0, void 0, void 0, function* () {
                const product = yield product_model_1.Product.findById(item.product);
                if (product) {
                    product.stock += item.quantity;
                    yield product.save();
                }
            })));
        }
        const updatedOrder = yield order.save();
        res.json(updatedOrder);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.updateOrderStatus = updateOrderStatus;
// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const order = yield order_model_1.Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        // Check if user is authorized to cancel this order
        if (order.user.toString() !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id.toString()) &&
            ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to cancel this order' });
        }
        // Check if order can be cancelled
        if (order.status === 'Delivered') {
            return res.status(400).json({ message: 'Cannot cancel delivered order' });
        }
        // Update order status
        order.status = 'Cancelled';
        // Restore product stock
        yield Promise.all(order.items.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            const product = yield product_model_1.Product.findById(item.product);
            if (product) {
                product.stock += item.quantity;
                yield product.save();
            }
        })));
        const updatedOrder = yield order.save();
        res.json(updatedOrder);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.cancelOrder = cancelOrder;
// @desc    Generate invoice for order
// @route   GET /api/orders/:id/invoice
// @access  Private
const generateInvoice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const order = yield order_model_1.Order.findById(req.params.id).populate('user', 'name email');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        // Check if user is authorized to view this order
        if (order.user._id.toString() !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id.toString()) &&
            ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to view this order' });
        }
        // Check if order is paid
        if (!order.isPaid) {
            return res.status(400).json({ message: 'Order is not paid yet' });
        }
        // Generate invoice PDF
        const pdfBuffer = yield (0, invoice_utils_1.generateInvoicePDF)(order);
        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=invoice-${order._id}.pdf`);
        // Send PDF
        res.send(pdfBuffer);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.generateInvoice = generateInvoice;
//# sourceMappingURL=order.controller.js.map