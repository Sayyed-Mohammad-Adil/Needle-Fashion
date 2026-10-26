"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_routes_1 = __importDefault(require("./user.routes"));
const product_routes_1 = __importDefault(require("./product.routes"));
const category_routes_1 = __importDefault(require("./category.routes"));
const filter_routes_1 = __importDefault(require("./filter.routes"));
const order_routes_1 = __importDefault(require("./order.routes"));
const review_routes_1 = __importDefault(require("./review.routes"));
const faq_routes_1 = __importDefault(require("./faq.routes"));
const analytics_routes_1 = __importDefault(require("./analytics.routes"));
const expense_routes_1 = __importDefault(require("./expense.routes"));
const theme_routes_1 = __importDefault(require("./theme.routes"));
const notification_routes_1 = __importDefault(require("./notification.routes"));
const chat_routes_1 = __importDefault(require("./chat.routes"));
const upload_routes_1 = __importDefault(require("./upload.routes"));
const inquiry_routes_1 = __importDefault(require("./inquiry.routes"));
const error_middleware_1 = require("../middleware/error.middleware");
const security_middleware_1 = require("../middleware/security.middleware");
const router = express_1.default.Router();
// Apply security middleware to all API routes
router.use(security_middleware_1.sanitizeInput);
router.use(security_middleware_1.preventNoSQLInjection);
router.use(security_middleware_1.logSuspiciousActivity);
router.use('/api', (req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
});
// API routes
router.use('/api/users', user_routes_1.default);
router.use('/api/products', product_routes_1.default);
router.use('/api/categories', category_routes_1.default);
router.use('/api/filters', filter_routes_1.default);
router.use('/api/orders', order_routes_1.default);
router.use('/api/reviews', review_routes_1.default);
router.use('/api/faqs', faq_routes_1.default);
router.use('/api/analytics', analytics_routes_1.default);
router.use('/api/expenses', expense_routes_1.default);
router.use('/api/themes', theme_routes_1.default);
router.use('/api/notifications', notification_routes_1.default);
router.use('/api/chat', chat_routes_1.default);
router.use('/api/upload', upload_routes_1.default);
router.use('/api/inquiries', inquiry_routes_1.default);
// Health check endpoint
router.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});
// Error handling middleware
router.use(error_middleware_1.notFound);
router.use(error_middleware_1.errorHandler);
exports.default = router;
//# sourceMappingURL=index.js.map