"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
// Public routes
router.post('/register', user_controller_1.registerUser);
router.post('/login', user_controller_1.loginUser);
router.post('/refresh', user_controller_1.refreshToken);
router.post('/google', user_controller_1.googleAuth);
// Protected routes
router.route('/me')
    .get(auth_middleware_1.protect, user_controller_1.getUserProfile)
    .put(auth_middleware_1.protect, user_controller_1.updateUserProfile);
router.route('/measurements')
    .get(auth_middleware_1.protect, user_controller_1.getUserMeasurements)
    .post(auth_middleware_1.protect, user_controller_1.addUserMeasurement);
router.route('/wishlist')
    .get(auth_middleware_1.protect, user_controller_1.getWishlist)
    .post(auth_middleware_1.protect, user_controller_1.addToWishlist);
router.delete('/wishlist/:productId', auth_middleware_1.protect, user_controller_1.removeFromWishlist);
// Admin routes
router.route('/')
    .get(auth_middleware_1.protect, auth_middleware_1.admin, user_controller_1.getUsers);
router.route('/:id')
    .get(auth_middleware_1.protect, auth_middleware_1.admin, user_controller_1.getUserById)
    .put(auth_middleware_1.protect, auth_middleware_1.admin, user_controller_1.updateUser)
    .delete(auth_middleware_1.protect, auth_middleware_1.admin, user_controller_1.deleteUser);
exports.default = router;
//# sourceMappingURL=user.routes.js.map