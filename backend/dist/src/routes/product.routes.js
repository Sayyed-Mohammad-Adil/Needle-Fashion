"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_controller_1 = require("../controllers/product.controller");
const review_controller_1 = require("../controllers/review.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const analytics_controller_1 = require("../controllers/analytics.controller");
const router = express_1.default.Router();
// Public routes
router.route('/')
    .get(product_controller_1.getProducts)
    .post(auth_middleware_1.protect, auth_middleware_1.admin, product_controller_1.createProduct);
router.get('/top', product_controller_1.getTopProducts);
router.route('/:id')
    .get(product_controller_1.getProductById)
    .put(auth_middleware_1.protect, auth_middleware_1.admin, product_controller_1.updateProduct)
    .delete(auth_middleware_1.protect, auth_middleware_1.admin, product_controller_1.deleteProduct);
router.route('/:id/pricing')
    .patch(auth_middleware_1.protect, auth_middleware_1.admin, product_controller_1.updateProductPricing)
    .put(auth_middleware_1.protect, auth_middleware_1.admin, product_controller_1.updateProductPricing);
// Review routes
router.route('/:id/reviews')
    .get(review_controller_1.getProductReviews)
    .post(auth_middleware_1.protect, review_controller_1.createReview);
// Analytics routes
router.post('/:id/view', analytics_controller_1.trackProductView);
exports.default = router;
//# sourceMappingURL=product.routes.js.map