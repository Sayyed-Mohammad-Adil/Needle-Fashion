import { Request, Response } from 'express';
import { Inquiry } from '../models/inquiry.model';

// @desc    Create a new client inquiry or fitting request
// @route   POST /api/inquiries
// @access  Public
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

    const inquiry = await Inquiry.create({
      name,
      email,
      phone,
      type: type || 'Bespoke Commission',
      subject: subject || 'Atelier Fitting / Commission Request',
      message,
      preferredDate,
      preferredTime,
      productId,
      productName,
      measurements,
      status: 'Pending',
    });

    res.status(201).json({
      success: true,
      message: 'Your inquiry has been successfully received by the royal atelier.',
      inquiry,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all inquiries with filtering & pagination
// @route   GET /api/inquiries
// @access  Private/Admin
export const getInquiries = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 15;

    const filterObj: any = {};

    // Status filter
    if (req.query.status && req.query.status !== 'all') {
      filterObj.status = req.query.status;
    }

    // Type filter
    if (req.query.type && req.query.type !== 'all') {
      filterObj.type = req.query.type;
    }

    // Search keyword (name, email, phone, subject)
    if (req.query.keyword) {
      const keyword = String(req.query.keyword).trim();
      filterObj.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { email: { $regex: keyword, $options: 'i' } },
        { phone: { $regex: keyword, $options: 'i' } },
        { subject: { $regex: keyword, $options: 'i' } },
      ];
    }

    const total = await Inquiry.countDocuments(filterObj);
    const inquiries = await Inquiry.find(filterObj)
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    // Summary counts for dashboard badges
    const pendingCount = await Inquiry.countDocuments({ status: 'Pending' });
    const scheduledCount = await Inquiry.countDocuments({ status: 'Fitting Scheduled' });
    const inProgressCount = await Inquiry.countDocuments({ status: 'In Progress' });

    res.json({
      success: true,
      inquiries,
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

// @desc    Get single inquiry by ID
// @route   GET /api/inquiries/:id
// @access  Private/Admin
export const getInquiryById = async (req: Request, res: Response) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }
    res.json({ success: true, inquiry });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update inquiry status or add admin notes
// @route   PUT /api/inquiries/:id
// @access  Private/Admin
export const updateInquiry = async (req: Request, res: Response) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    const { status, adminNotes } = req.body;
    if (status) inquiry.status = status;
    if (adminNotes !== undefined) inquiry.adminNotes = adminNotes;

    const updated = await inquiry.save();
    res.json({
      success: true,
      message: 'Inquiry updated successfully',
      inquiry: updated,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete inquiry
// @route   DELETE /api/inquiries/:id
// @access  Private/Admin
export const deleteInquiry = async (req: Request, res: Response) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    await inquiry.deleteOne();
    res.json({ success: true, message: 'Inquiry removed successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
