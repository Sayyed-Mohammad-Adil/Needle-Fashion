"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const notification_controller_1 = require("../controllers/notification.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
// User routes
router.route('/').get(auth_middleware_1.protect, notification_controller_1.getNotifications);
router.route('/:id').get(auth_middleware_1.protect, notification_controller_1.getNotificationById);
router.route('/:id/read').put(auth_middleware_1.protect, notification_controller_1.markAsRead);
router.route('/read-all').put(auth_middleware_1.protect, notification_controller_1.markAllAsRead);
// Admin routes
router.route('/').post(auth_middleware_1.protect, auth_middleware_1.admin, notification_controller_1.createNotification);
router.route('/:id').put(auth_middleware_1.protect, auth_middleware_1.admin, notification_controller_1.updateNotification);
router.route('/:id').delete(auth_middleware_1.protect, auth_middleware_1.admin, notification_controller_1.deleteNotification);
router.route('/admin').get(auth_middleware_1.protect, auth_middleware_1.admin, notification_controller_1.getAdminNotifications);
exports.default = router;
//# sourceMappingURL=notification.routes.js.map