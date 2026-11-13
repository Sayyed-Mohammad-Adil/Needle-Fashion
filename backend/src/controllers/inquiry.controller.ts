import { Request, Response } from 'express';
import { prisma, withMongoId, withMongoIds } from '../lib/prisma';

export const createInquiry = async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      phone,
      type,
      subject,
      message,
      preferredDate,
      preferredTime,
      productId,
      productName,
      measurements,
    } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({
        message: 'Name, email, phone number, and message details are required.',
      });
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        name,
        email: String(email).toLowerCase(),
        phone,
        type: type || 'Bespoke Commission',
        subject: subject || 'Atelier Fitting / Commission Request',
        message,
        preferredDate,
        preferredTime,
        productId,
        productName,
        measurements: measurements ?? undefined,
        status: 'Pending',
      },
    });

    res.status(201).json({
      success: true,
      message: 'Your inquiry has been successfully received by the royal atelier.',
      inquiry: withMongoId(inquiry),
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getInquiries = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 15;

    const where: any = {};
    if (req.query.status && req.query.status !== 'all') {
      where.status = String(req.query.status);
    }
    if (req.query.type && req.query.type !== 'all') {
      where.type = String(req.query.type);
    }
    if (req.query.keyword) {
      const keyword = String(req.query.keyword).trim();
      where.OR = [
        { name: { contains: keyword, mode: 'insensitive' } },
        { email: { contains: keyword, mode: 'insensitive' } },
        { phone: { contains: keyword, mode: 'insensitive' } },
        { subject: { contains: keyword, mode: 'insensitive' } },
      ];
    }

    const [total, inquiries, pendingCount, scheduledCount, inProgressCount] = await Promise.all([
      prisma.inquiry.count({ where }),
      prisma.inquiry.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: pageSize,
        skip: pageSize * (page - 1),
      }),
      prisma.inquiry.count({ where: { status: 'Pending' } }),
      prisma.inquiry.count({ where: { status: 'Fitting Scheduled' } }),
      prisma.inquiry.count({ where: { status: 'In Progress' } }),
    ]);

    res.json({
      success: true,
      inquiries: withMongoIds(inquiries),
      total,
      page,
      pages: Math.ceil(total / pageSize),
      counts: {
        total,
        pending: pendingCount,
        scheduled: scheduledCount,
        inProgress: inProgressCount,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getInquiryById = async (req: Request, res: Response) => {
  try {
    const inquiry = await prisma.inquiry.findUnique({ where: { id: req.params.id } });
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }
    res.json({ success: true, inquiry: withMongoId(inquiry) });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateInquiry = async (req: Request, res: Response) => {
  try {
    const inquiry = await prisma.inquiry.findUnique({ where: { id: req.params.id } });
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    const { status, adminNotes } = req.body;
    const updated = await prisma.inquiry.update({
      where: { id: req.params.id },
      data: {
        status: status ?? inquiry.status,
        adminNotes: adminNotes !== undefined ? adminNotes : inquiry.adminNotes,
      },
    });

    res.json({
      success: true,
      message: 'Inquiry updated successfully',
      inquiry: withMongoId(updated),
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteInquiry = async (req: Request, res: Response) => {
  try {
    const inquiry = await prisma.inquiry.findUnique({ where: { id: req.params.id } });
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    await prisma.inquiry.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Inquiry removed' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
