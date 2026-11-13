"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminNotifications = exports.markAllAsRead = exports.markAsRead = exports.deleteNotification = exports.updateNotification = exports.createNotification = exports.getNotificationById = exports.getNotifications = void 0;
const prisma_1 = require("../lib/prisma");
const getNotifications = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const pageSize = Number(req.query.pageSize) || 10;
        const userId = req.user.id;
        const orConditions = [
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
            prisma_1.prisma.notification.count({ where }),
            prisma_1.prisma.notification.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                take: pageSize,
                skip: pageSize * (page - 1),
            }),
        ]);
        res.json({
            notifications: (0, prisma_1.withMongoIds)(notifications),
            page,
            pages: Math.ceil(count / pageSize),
            total: count,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getNotifications = getNotifications;
const getNotificationById = async (req, res) => {
    try {
        const notification = await prisma_1.prisma.notification.findUnique({
            where: { id: req.params.id },
        });
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        if (notification.targetUsers === 'specific' &&
            !notification.userIds.includes(req.user.id)) {
            return res.status(403).json({ message: 'Not authorized to view this notification' });
        }
        if (notification.targetUsers === 'admin' && req.user?.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to view this notification' });
        }
        res.json((0, prisma_1.withMongoId)(notification));
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getNotificationById = getNotificationById;
const createNotification = async (req, res) => {
    try {
        const { title, message, type, priority, targetUsers, userIds, expiresAt } = req.body;
        const notification = await prisma_1.prisma.notification.create({
            data: {
                title,
                message,
                type: type || 'info',
                priority: priority || 'medium',
                targetUsers: targetUsers || 'all',
                userIds: targetUsers === 'specific' && Array.isArray(userIds) ? userIds : [],
                createdById: req.user.id,
                expiresAt: expiresAt ? new Date(expiresAt) : null,
            },
        });
        res.status(201).json((0, prisma_1.withMongoId)(notification));
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.createNotification = createNotification;
const updateNotification = async (req, res) => {
    try {
        const notification = await prisma_1.prisma.notification.findUnique({
            where: { id: req.params.id },
        });
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        const { title, message, type, priority, targetUsers, userIds, expiresAt, isRead } = req.body;
        let nextReadBy = [...notification.readBy];
        if (isRead !== undefined) {
            const uid = req.user.id;
            if (isRead && !nextReadBy.includes(uid)) {
                nextReadBy.push(uid);
            }
            else if (!isRead) {
                nextReadBy = nextReadBy.filter((id) => id !== uid);
            }
        }
        const updatedNotification = await prisma_1.prisma.notification.update({
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
        res.json((0, prisma_1.withMongoId)(updatedNotification));
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updateNotification = updateNotification;
const deleteNotification = async (req, res) => {
    try {
        const notification = await prisma_1.prisma.notification.findUnique({
            where: { id: req.params.id },
        });
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        await prisma_1.prisma.notification.delete({ where: { id: req.params.id } });
        res.json({ message: 'Notification removed' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.deleteNotification = deleteNotification;
const markAsRead = async (req, res) => {
    try {
        const notification = await prisma_1.prisma.notification.findUnique({
            where: { id: req.params.id },
        });
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        const uid = req.user.id;
        if (notification.targetUsers === 'specific' && !notification.userIds.includes(uid)) {
            return res.status(403).json({ message: 'Not authorized to mark this notification as read' });
        }
        if (notification.targetUsers === 'admin' && req.user?.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to mark this notification as read' });
        }
        const nextReadBy = notification.readBy.includes(uid)
            ? notification.readBy
            : [...notification.readBy, uid];
        const updatedNotification = await prisma_1.prisma.notification.update({
            where: { id: req.params.id },
            data: { isRead: true, readBy: nextReadBy },
        });
        res.json((0, prisma_1.withMongoId)(updatedNotification));
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.markAsRead = markAsRead;
const markAllAsRead = async (req, res) => {
    try {
        const uid = req.user.id;
        const orConditions = [
            { targetUsers: 'all' },
            { targetUsers: 'specific', userIds: { has: uid } },
        ];
        if (req.user?.role === 'admin') {
            orConditions.push({ targetUsers: 'admin' });
        }
        const result = await prisma_1.prisma.notification.updateMany({
            where: { OR: orConditions, isRead: false },
            data: { isRead: true },
        });
        res.json({ message: `Marked ${result.count} notifications as read` });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.markAllAsRead = markAllAsRead;
const getAdminNotifications = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const pageSize = Number(req.query.pageSize) || 10;
        const where = {
            OR: [{ targetUsers: 'admin' }, { targetUsers: 'all' }],
        };
        const [count, notifications] = await Promise.all([
            prisma_1.prisma.notification.count({ where }),
            prisma_1.prisma.notification.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                take: pageSize,
                skip: pageSize * (page - 1),
            }),
        ]);
        res.json({
            notifications: (0, prisma_1.withMongoIds)(notifications),
            page,
            pages: Math.ceil(count / pageSize),
            total: count,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getAdminNotifications = getAdminNotifications;
//# sourceMappingURL=notification.controller.js.map