"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const analytics_controller_1 = require("../controllers/analytics.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
// Public tracking endpoints
router.post('/view', analytics_controller_1.trackProductView);
router.post('/search', analytics_controller_1.trackSearchTerm);
// Admin analytics endpoints
router.get('/dashboard', auth_middleware_1.protect, auth_middleware_1.admin, analytics_controller_1.getDashboardAnalytics);
router.get('/sales', auth_middleware_1.protect, auth_middleware_1.admin, analytics_controller_1.getSalesAnalytics);
router.get('/products', auth_middleware_1.protect, auth_middleware_1.admin, analytics_controller_1.getProductAnalytics);
router.get('/users', auth_middleware_1.protect, auth_middleware_1.admin, analytics_controller_1.getUserAnalytics);
exports.default = router;
//# sourceMappingURL=analytics.routes.js.map