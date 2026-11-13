import { Request, Response } from 'express';
import { prisma, withMongoId } from '../lib/prisma';
import { generateInvoicePDF } from '../utils/invoice.utils';

function formatOrder(o: any) {
  return {
    ...withMongoId(o),
    user: o.user ? withMongoId(o.user) : o.userId,
    items: Array.isArray(o.items)
      ? o.items.map((item: any) => ({
          ...withMongoId(item),
          product: item.product ? withMongoId(item.product) : item.productId,
        }))
      : [],
  };
}

const orderInclude = {
  user: { select: { id: true, name: true, email: true, phone: true, address: true } },
  items: {
    include: {
      product: { select: { id: true, name: true, images: true, price: true, categoryId: true } },
    },
  },
};

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
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    const order = await prisma.$transaction(async (tx) => {
      const verifiedItems: Array<{
        productId: string;
        quantity: number;
        price: number;
        size: string;
        fitting: string;
        customMeasurements?: any;
      }> = [];

      for (const item of items) {
        const product = await tx.product.findUnique({ where: { id: String(item.product) } });
        if (!product) {
          throw new Error(`Product not found: ${item.product}`);
        }
        if (product.price !== Number(item.price)) {
          throw new Error(`Price mismatch for product: ${product.name}`);
        }
        if (!product.isMakeToOrder && product.stock < Number(item.quantity)) {
          throw new Error(`Insufficient stock for product: ${product.name}`);
        }

        if (!product.isMakeToOrder) {
          const nextStock = Math.max(0, product.stock - Number(item.quantity));
          await tx.product.update({
            where: { id: product.id },
            data: { stock: nextStock, isOutOfStock: nextStock <= 0 },
          });
        }

        verifiedItems.push({
          productId: product.id,
          quantity: Number(item.quantity),
          price: product.price,
          size: String(item.size),
          fitting: item.fitting || 'Medium',
          customMeasurements: item.customMeasurements ?? undefined,
        });
      }

      return tx.order.create({
        data: {
          userId: req.user!.id,
          shippingAddress,
          paymentMethod,
          itemsPrice: Number(itemsPrice),
          taxPrice: Number(taxPrice),
          shippingPrice: Number(shippingPrice),
          totalPrice: Number(totalPrice),
          items: { create: verifiedItems },
        },
        include: orderInclude,
      });
    });

    res.status(201).json(formatOrder(order));
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: orderInclude,
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.userId !== req.user!.id && req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(formatOrder(order));
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderToPaid = async (req: Request, res: Response) => {
  try {
    const order = await prisma.order.findUnique({ where: { id: req.params.id } });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: req.params.id },
      data: {
        isPaid: true,
        paidAt: new Date(),
        paymentResult: {
          id: req.body.id,
          status: req.body.status,
          updateTime: req.body.update_time,
          emailAddress: req.body.payer?.email_address,
        },
      },
      include: orderInclude,
    });

    res.json(formatOrder(updatedOrder));
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderToDelivered = async (req: Request, res: Response) => {
  try {
    const order = await prisma.order.findUnique({ where: { id: req.params.id } });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: req.params.id },
      data: {
        deliveredAt: new Date(),
        status: 'Delivered',
      },
      include: orderInclude,
    });

    res.json(formatOrder(updatedOrder));
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyOrders = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;

    const where = { userId: req.user!.id };
    const [count, orders] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: pageSize,
        skip: pageSize * (page - 1),
        include: orderInclude,
      }),
    ]);

    res.json({
      orders: orders.map(formatOrder),
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;

    const where: any = {};
    if (req.query.status) where.status = String(req.query.status);
    if (req.query.isPaid === 'true') where.isPaid = true;
    else if (req.query.isPaid === 'false') where.isPaid = false;

    if (req.query.isDelivered === 'true') where.deliveredAt = { not: null };
    else if (req.query.isDelivered === 'false') where.deliveredAt = null;

    if (req.query.startDate && req.query.endDate) {
      where.createdAt = {
        gte: new Date(req.query.startDate as string),
        lte: new Date(req.query.endDate as string),
      };
    }

    const [count, orders] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.findMany({
        where,
        include: orderInclude,
        orderBy: { createdAt: 'desc' },
        take: pageSize,
        skip: pageSize * (page - 1),
      }),
    ]);

    const formatted = orders.map(formatOrder);
    res.json({
      orders: formatted,
      items: formatted,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: { items: true },
    });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const { status } = req.body;
    if (status === 'Cancelled' && order.status !== 'Cancelled') {
      await Promise.all(
        order.items.map((item) =>
          prisma.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity }, isOutOfStock: false },
          })
        )
      );
    }

    const updatedOrder = await prisma.order.update({
      where: { id: req.params.id },
      data: {
        status,
        deliveredAt: status === 'Delivered' ? new Date() : order.deliveredAt,
      },
      include: orderInclude,
    });

    res.json(formatOrder(updatedOrder));
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderAdminDetails = async (req: Request, res: Response) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: { items: true },
    });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const { status, isPaid, tailoringStage, courierName, trackingNumber, atelierNotes } = req.body;

    if (status === 'Cancelled' && order.status !== 'Cancelled') {
      await Promise.all(
        order.items.map((item) =>
          prisma.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity }, isOutOfStock: false },
          })
        )
      );
    }

    const nextPaid = isPaid !== undefined ? Boolean(isPaid) : order.isPaid;

    const updated = await prisma.order.update({
      where: { id: req.params.id },
      data: {
        status: status ?? order.status,
        deliveredAt:
          status === 'Delivered' && !order.deliveredAt ? new Date() : order.deliveredAt,
        isPaid: nextPaid,
        paidAt: nextPaid ? order.paidAt || new Date() : null,
        tailoringStage: tailoringStage ?? order.tailoringStage,
        courierName: courierName ?? order.courierName,
        trackingNumber: trackingNumber ?? order.trackingNumber,
        atelierNotes: atelierNotes ?? order.atelierNotes,
      },
      include: orderInclude,
    });

    res.json(formatOrder(updated));
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: { items: true },
    });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.userId !== req.user!.id && req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to cancel this order' });
    }

    if (order.status === 'Delivered') {
      return res.status(400).json({ message: 'Cannot cancel delivered order' });
    }

    if (order.status !== 'Cancelled') {
      await Promise.all(
        order.items.map((item) =>
          prisma.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity }, isOutOfStock: false },
          })
        )
      );
    }

    const updatedOrder = await prisma.order.update({
      where: { id: req.params.id },
      data: { status: 'Cancelled' },
      include: orderInclude,
    });

    res.json(formatOrder(updatedOrder));
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const generateInvoice = async (req: Request, res: Response) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: orderInclude,
    });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.userId !== req.user!.id && req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    if (!order.isPaid) {
      return res.status(400).json({ message: 'Order is not paid yet' });
    }

    const pdfBuffer = await generateInvoicePDF(formatOrder(order));

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${order.id}.pdf`);
    res.send(pdfBuffer);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
