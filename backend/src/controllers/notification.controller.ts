import { Request, Response } from 'express';
import { prisma, withMongoId, withMongoIds } from '../lib/prisma';

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;
    const userId = req.user!.id;

    const orConditions: any[] = [
      { targetUsers: 'all' },
      { targetUsers: 'specific', userIds: { has: userId } },
    ];
    if (req.user?.role === 'admin') {
      orConditions.push({ targetUsers: 'admin' });
    }

    const where = {
      OR: orConditions,
      isRead: false,
    };

    const [count, notifications] = await Promise.all([
      prisma.notification.count({ where }),
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: pageSize,
        skip: pageSize * (page - 1),
      }),
    ]);

    res.json({
      notifications: withMongoIds(notifications),
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getNotificationById = async (req: Request, res: Response) => {
  try {
    const notification = await prisma.notification.findUnique({
      where: { id: req.params.id },
    });
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    if (
      notification.targetUsers === 'specific' &&
      !notification.userIds.includes(req.user!.id)
    ) {
      return res.status(403).json({ message: 'Not authorized to view this notification' });
    }

    if (notification.targetUsers === 'admin' && req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this notification' });
    }

    res.json(withMongoId(notification));
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createNotification = async (req: Request, res: Response) => {
  try {
    const { title, message, type, priority, targetUsers, userIds, expiresAt } = req.body;

    const notification = await prisma.notification.create({
      data: {
        title,
        message,
        type: type || 'info',
        priority: priority || 'medium',
        targetUsers: targetUsers || 'all',
        userIds: targetUsers === 'specific' && Array.isArray(userIds) ? userIds : [],
        createdById: req.user!.id,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });

    res.status(201).json(withMongoId(notification));
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateNotification = async (req: Request, res: Response) => {
  try {
    const notification = await prisma.notification.findUnique({
      where: { id: req.params.id },
    });
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    const { title, message, type, priority, targetUsers, userIds, expiresAt, isRead } = req.body;
    let nextReadBy = [...notification.readBy];
    if (isRead !== undefined) {
      const uid = req.user!.id;
      if (isRead && !nextReadBy.includes(uid)) {
        nextReadBy.push(uid);
      } else if (!isRead) {
        nextReadBy = nextReadBy.filter((id) => id !== uid);
      }
    }

    const updatedNotification = await prisma.notification.update({
      where: { id: req.params.id },
      data: {
        title: title ?? notification.title,
        message: message ?? notification.message,
        type: type ?? notification.type,
        priority: priority ?? notification.priority,
        targetUsers: targetUsers ?? notification.targetUsers,
        userIds: targetUsers === 'specific' && Array.isArray(userIds) ? userIds : notification.userIds,
        expiresAt: expiresAt ? new Date(expiresAt) : notification.expiresAt,
        isRead: isRead !== undefined ? Boolean(isRead) : notification.isRead,
        readBy: nextReadBy,
      },
    });

    res.json(withMongoId(updatedNotification));
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const notification = await prisma.notification.findUnique({
      where: { id: req.params.id },
    });
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    await prisma.notification.delete({ where: { id: req.params.id } });
    res.json({ message: 'Notification removed' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    const notification = await prisma.notification.findUnique({
      where: { id: req.params.id },
    });
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    const uid = req.user!.id;
    if (notification.targetUsers === 'specific' && !notification.userIds.includes(uid)) {
      return res.status(403).json({ message: 'Not authorized to mark this notification as read' });
    }
    if (notification.targetUsers === 'admin' && req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to mark this notification as read' });
    }

    const nextReadBy = notification.readBy.includes(uid)
      ? notification.readBy
      : [...notification.readBy, uid];

    const updatedNotification = await prisma.notification.update({
      where: { id: req.params.id },
      data: { isRead: true, readBy: nextReadBy },
    });

    res.json(withMongoId(updatedNotification));
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const uid = req.user!.id;
    const orConditions: any[] = [
      { targetUsers: 'all' },
      { targetUsers: 'specific', userIds: { has: uid } },
    ];
    if (req.user?.role === 'admin') {
      orConditions.push({ targetUsers: 'admin' });
    }

    const result = await prisma.notification.updateMany({
      where: { OR: orConditions, isRead: false },
      data: { isRead: true },
    });

    res.json({ message: `Marked ${result.count} notifications as read` });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAdminNotifications = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;

    const where = {
      OR: [{ targetUsers: 'admin' }, { targetUsers: 'all' }],
    };

    const [count, notifications] = await Promise.all([
      prisma.notification.count({ where }),
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: pageSize,
        skip: pageSize * (page - 1),
      }),
    ]);

    res.json({
      notifications: withMongoIds(notifications),
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
