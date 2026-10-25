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
exports.getAdminNotifications = exports.markAllAsRead = exports.markAsRead = exports.deleteNotification = exports.updateNotification = exports.createNotification = exports.getNotificationById = exports.getNotifications = void 0;
const notification_model_1 = require("../models/notification.model");
// @desc    Get all notifications for current user
// @route   GET /api/notifications
// @access  Private
const getNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const page = Number(req.query.page) || 1;
        const pageSize = Number(req.query.pageSize) || 10;
        const filterObj = {
            $or: [
                { targetUsers: 'all' },
                { targetUsers: 'specific', userIds: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id },
            ],
            isRead: false,
        };
        // For admin users, also include admin notifications
        if (((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) === 'admin') {
            filterObj.$or.push({ targetUsers: 'admin' });
        }
        const count = yield notification_model_1.Notification.countDocuments(filterObj);
        const notifications = yield notification_model_1.Notification.find(filterObj)
            .sort({ createdAt: -1 })
            .limit(pageSize)
            .skip(pageSize * (page - 1));
        res.json({
            notifications,
            page,
            pages: Math.ceil(count / pageSize),
            total: count,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getNotifications = getNotifications;
// @desc    Get notification by ID
// @route   GET /api/notifications/:id
// @access  Private
const getNotificationById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const notification = yield notification_model_1.Notification.findById(req.params.id);
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        // Check if user is authorized to view this notification
        if (notification.targetUsers === 'specific' &&
            !((_a = notification.userIds) === null || _a === void 0 ? void 0 : _a.includes((_b = req.user) === null || _b === void 0 ? void 0 : _b._id))) {
            return res.status(403).json({ message: 'Not authorized to view this notification' });
        }
        if (notification.targetUsers === 'admin' && ((_c = req.user) === null || _c === void 0 ? void 0 : _c.role) !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to view this notification' });
        }
        res.json(notification);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getNotificationById = getNotificationById;
// @desc    Create a new notification
// @route   POST /api/notifications
// @access  Private/Admin
const createNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { title, message, type, priority, targetUsers, userIds, expiresAt, } = req.body;
        const notification = yield notification_model_1.Notification.create({
            title,
            message,
            type: type || 'info',
            priority: priority || 'medium',
            targetUsers: targetUsers || 'all',
            userIds: targetUsers === 'specific' ? userIds : undefined,
            createdBy: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
            expiresAt,
        });
        res.status(201).json(notification);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.createNotification = createNotification;
// @desc    Update a notification
// @route   PUT /api/notifications/:id
// @access  Private/Admin
const updateNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const notification = yield notification_model_1.Notification.findById(req.params.id);
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        const { title, message, type, priority, targetUsers, userIds, expiresAt, isRead, } = req.body;
        // Update fields if provided
        if (title)
            notification.title = title;
        if (message)
            notification.message = message;
        if (type)
            notification.type = type;
        if (priority)
            notification.priority = priority;
        if (targetUsers)
            notification.targetUsers = targetUsers;
        if (targetUsers === 'specific' && userIds)
            notification.userIds = userIds;
        if (expiresAt)
            notification.expiresAt = expiresAt;
        if (isRead !== undefined) {
            if (isRead && !notification.readBy.includes((_a = req.user) === null || _a === void 0 ? void 0 : _a._id)) {
                notification.readBy.push((_b = req.user) === null || _b === void 0 ? void 0 : _b._id);
            }
            else if (!isRead) {
                notification.readBy = notification.readBy.filter((id) => { var _a; return id.toString() !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id.toString()); });
            }
            notification.isRead = isRead;
        }
        const updatedNotification = yield notification.save();
        res.json(updatedNotification);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.updateNotification = updateNotification;
// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private/Admin
const deleteNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notification = yield notification_model_1.Notification.findById(req.params.id);
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        yield notification.deleteOne();
        res.json({ message: 'Notification removed' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.deleteNotification = deleteNotification;
// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    try {
        const notification = yield notification_model_1.Notification.findById(req.params.id);
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        // Check if user is authorized to mark this notification as read
        if (notification.targetUsers === 'specific' &&
            !((_a = notification.userIds) === null || _a === void 0 ? void 0 : _a.includes((_b = req.user) === null || _b === void 0 ? void 0 : _b._id))) {
            return res.status(403).json({ message: 'Not authorized to mark this notification as read' });
        }
        if (notification.targetUsers === 'admin' && ((_c = req.user) === null || _c === void 0 ? void 0 : _c.role) !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to mark this notification as read' });
        }
        // Add user to readBy array if not already there
        if (!notification.readBy.includes((_d = req.user) === null || _d === void 0 ? void 0 : _d._id)) {
            notification.readBy.push((_e = req.user) === null || _e === void 0 ? void 0 : _e._id);
        }
        notification.isRead = true;
        const updatedNotification = yield notification.save();
        res.json(updatedNotification);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.markAsRead = markAsRead;
// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
const markAllAsRead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const filterObj = {
            $or: [
                { targetUsers: 'all' },
                { targetUsers: 'specific', userIds: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id },
            ],
            isRead: false,
        };
        // For admin users, also include admin notifications
        if (((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) === 'admin') {
            filterObj.$or.push({ targetUsers: 'admin' });
        }
        // Update all matching notifications
        const result = yield notification_model_1.Notification.updateMany(filterObj, {
            $addToSet: { readBy: (_c = req.user) === null || _c === void 0 ? void 0 : _c._id },
            isRead: true,
        });
        res.json({ message: `Marked ${result.modifiedCount} notifications as read` });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.markAllAsRead = markAllAsRead;
// @desc    Get admin notifications
// @route   GET /api/admin/notifications
// @access  Private/Admin
const getAdminNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = Number(req.query.page) || 1;
        const pageSize = Number(req.query.pageSize) || 10;
        const filterObj = {
            $or: [
                { targetUsers: 'admin' },
                { targetUsers: 'all' },
            ],
        };
        const count = yield notification_model_1.Notification.countDocuments(filterObj);
        const notifications = yield notification_model_1.Notification.find(filterObj)
            .sort({ createdAt: -1 })
            .limit(pageSize)
            .skip(pageSize * (page - 1));
        res.json({
            notifications,
            page,
            pages: Math.ceil(count / pageSize),
            total: count,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getAdminNotifications = getAdminNotifications;
//# sourceMappingURL=notification.controller.js.map