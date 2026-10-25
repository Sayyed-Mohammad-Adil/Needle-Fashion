"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const review_controller_1 = require("../controllers/review.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
// Protected routes
router.route('/:id')
    .put(auth_middleware_1.protect, review_controller_1.updateReview)
    .delete(auth_middleware_1.protect, review_controller_1.deleteReview);
router.post('/:id/report', auth_middleware_1.protect, review_controller_1.reportReview);
router.post('/:id/helpful', auth_middleware_1.protect, review_controller_1.markReviewHelpful);
// Admin routes
router.get('/admin', auth_middleware_1.protect, auth_middleware_1.admin, review_controller_1.getAdminReviews);
exports.default = router;
//# sourceMappingURL=review.routes.js.map