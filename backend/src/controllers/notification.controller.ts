import { Request, Response } from 'express';
import { Notification } from '../models/notification.model';
import { User } from '../models/user.model';

// @desc    Get all notifications for current user
// @route   GET /api/notifications
// @access  Private
export const getNotifications = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;

    const filterObj: any = {
      $or: [
        { targetUsers: 'all' },
        { targetUsers: 'specific', userIds: req.user?._id },
      ],
      isRead: false,
    };

    // For admin users, also include admin notifications
    if (req.user?.role === 'admin') {
      filterObj.$or.push({ targetUsers: 'admin' });
    }

    const count = await Notification.countDocuments(filterObj);
    const notifications = await Notification.find(filterObj)
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      notifications,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get notification by ID
// @route   GET /api/notifications/:id
// @access  Private
export const getNotificationById = async (req: Request, res: Response) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Check if user is authorized to view this notification
    if (
      notification.targetUsers === 'specific' &&
      !notification.userIds?.includes(req.user?._id!)
    ) {
      return res.status(403).json({ message: 'Not authorized to view this notification' });
    }

    if (notification.targetUsers === 'admin' && req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this notification' });
    }

    res.json(notification);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new notification
// @route   POST /api/notifications
// @access  Private/Admin
export const createNotification = async (req: Request, res: Response) => {
  try {
    const {
      title,
      message,
      type,
      priority,
      targetUsers,
      userIds,
      expiresAt,
    } = req.body;

    const notification = await Notification.create({
      title,
      message,
      type: type || 'info',
      priority: priority || 'medium',
      targetUsers: targetUsers || 'all',
      userIds: targetUsers === 'specific' ? userIds : undefined,
      createdBy: req.user?._id,
      expiresAt,
    });

    res.status(201).json(notification);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a notification
// @route   PUT /api/notifications/:id
// @access  Private/Admin
export const updateNotification = async (req: Request, res: Response) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    const {
      title,
      message,
      type,
      priority,
      targetUsers,
      userIds,
      expiresAt,
      isRead,
    } = req.body;

    // Update fields if provided
    if (title) notification.title = title;
    if (message) notification.message = message;
    if (type) notification.type = type;
    if (priority) notification.priority = priority;
    if (targetUsers) notification.targetUsers = targetUsers;
    if (targetUsers === 'specific' && userIds) notification.userIds = userIds;
    if (expiresAt) notification.expiresAt = expiresAt;
    if (isRead !== undefined) {
      if (isRead && !notification.readBy.includes(req.user?._id!)) {
        notification.readBy.push(req.user?._id!);
      } else if (!isRead) {
        notification.readBy = notification.readBy.filter(
          (id) => id.toString() !== req.user?._id!.toString()
        );
      }
      notification.isRead = isRead;
    }

    const updatedNotification = await notification.save();
    res.json(updatedNotification);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private/Admin
export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    await notification.deleteOne();
    res.json({ message: 'Notification removed' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markAsRead = async (req: Request, res: Response) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Check if user is authorized to mark this notification as read
    if (
      notification.targetUsers === 'specific' &&
      !notification.userIds?.includes(req.user?._id!)
    ) {
      return res.status(403).json({ message: 'Not authorized to mark this notification as read' });
    }

    if (notification.targetUsers === 'admin' && req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to mark this notification as read' });
    }

    // Add user to readBy array if not already there
    if (!notification.readBy.includes(req.user?._id!)) {
      notification.readBy.push(req.user?._id!);
    }

    notification.isRead = true;
    const updatedNotification = await notification.save();

    res.json(updatedNotification);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const filterObj: any = {
      $or: [
        { targetUsers: 'all' },
        { targetUsers: 'specific', userIds: req.user?._id },
      ],
      isRead: false,
    };

    // For admin users, also include admin notifications
    if (req.user?.role === 'admin') {
      filterObj.$or.push({ targetUsers: 'admin' });
    }

    // Update all matching notifications
    const result = await Notification.updateMany(
      filterObj,
      {
        $addToSet: { readBy: req.user?._id },
        isRead: true,
      }
    );

    res.json({ message: `Marked ${result.modifiedCount} notifications as read` });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get admin notifications
// @route   GET /api/admin/notifications
// @access  Private/Admin
export const getAdminNotifications = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;

    const filterObj: any = {
      $or: [
        { targetUsers: 'admin' },
        { targetUsers: 'all' },
      ],
    };

    const count = await Notification.countDocuments(filterObj);
    const notifications = await Notification.find(filterObj)
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      notifications,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};