"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const theme_controller_1 = require("../controllers/theme.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
// Public routes
router.route('/').get(theme_controller_1.getThemes);
router.route('/default').get(theme_controller_1.getDefaultTheme);
router.route('/:id').get(theme_controller_1.getThemeById);
// Admin routes
router.route('/').post(auth_middleware_1.protect, auth_middleware_1.admin, theme_controller_1.createTheme);
router.route('/:id').put(auth_middleware_1.protect, auth_middleware_1.admin, theme_controller_1.updateTheme);
router.route('/:id').delete(auth_middleware_1.protect, auth_middleware_1.admin, theme_controller_1.deleteTheme);
router.route('/:id/default').put(auth_middleware_1.protect, auth_middleware_1.admin, theme_controller_1.setDefaultTheme);
exports.default = router;
//# sourceMappingURL=theme.routes.js.map