import { Request, Response } from 'express';
import { Order } from '../models/order.model';
import { Product } from '../models/product.model';
import { generateInvoicePDF } from '../utils/invoice.utils';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req: Request, res: Response) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      gstBreakdown,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // Verify product prices and calculate totals
    const verifiedItems = await Promise.all(
      items.map(async (item: any) => {
        const product = await Product.findById(item.product);
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
        await product.save();

        return {
          name: product.name,
          quantity: item.quantity,
          image: product.images && product.images.length > 0 ? product.images[0].data : '',
          price: product.price,
          product: product._id,
          size: item.size,
          fitting: item.fitting,
        };
      })
    );

    // Create order
    const order = await Order.create({
      user: req.user?._id,
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
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user is authorized to view this order
    if (
      order.user._id.toString() !== req.user?._id.toString() &&
      req.user?.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
export const updateOrderToPaid = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);

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
      emailAddress: req.body.payer?.email_address,
    };

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
export const updateOrderToDelivered = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update order status
    order.deliveredAt = new Date();
    order.status = 'Delivered';

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;

    const count = await Order.countDocuments({ user: req.user?._id });
    const orders = await Order.find({ user: req.user?._id })
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      orders,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;

    // Build filter object
    const filterObj: any = {};

    // Filter by status
    if (req.query.status) {
      filterObj.status = req.query.status;
    }

    // Filter by payment status
    if (req.query.isPaid === 'true') {
      filterObj.isPaid = true;
    } else if (req.query.isPaid === 'false') {
      filterObj.isPaid = false;
    }

    // Filter by delivery status
    if (req.query.isDelivered === 'true') {
      filterObj.deliveredAt = { $ne: null };
    } else if (req.query.isDelivered === 'false') {
      filterObj.deliveredAt = null;
    }

    // Date range filter
    if (req.query.startDate && req.query.endDate) {
      filterObj.createdAt = {
        $gte: new Date(req.query.startDate as string),
        $lte: new Date(req.query.endDate as string),
      };
    }

    const count = await Order.countDocuments(filterObj);
    const orders = await Order.find(filterObj)
      .populate('user', 'id name email')
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      orders,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);

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
      await Promise.all(
        order.items.map(async (item) => {
          const product = await Product.findById(item.product);
          if (product) {
            product.stock += item.quantity;
            await product.save();
          }
        })
      );
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user is authorized to cancel this order
    if (
      order.user.toString() !== req.user?._id.toString() &&
      req.user?.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to cancel this order' });
    }

    // Check if order can be cancelled
    if (order.status === 'Delivered') {
      return res.status(400).json({ message: 'Cannot cancel delivered order' });
    }

    // Update order status
    order.status = 'Cancelled';

    // Restore product stock
    await Promise.all(
      order.items.map(async (item) => {
        const product = await Product.findById(item.product);
        if (product) {
          product.stock += item.quantity;
          await product.save();
        }
      })
    );

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate invoice for order
// @route   GET /api/orders/:id/invoice
// @access  Private
export const generateInvoice = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user is authorized to view this order
    if (
      order.user._id.toString() !== req.user?._id.toString() &&
      req.user?.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    // Check if order is paid
    if (!order.isPaid) {
      return res.status(400).json({ message: 'Order is not paid yet' });
    }

    // Generate invoice PDF
    const pdfBuffer = await generateInvoicePDF(order);

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=invoice-${order._id}.pdf`
    );

    // Send PDF
    res.send(pdfBuffer);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};