"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const category_controller_1 = require("../controllers/category.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.route('/')
    .get(category_controller_1.getCategories)
    .post(auth_middleware_1.protect, auth_middleware_1.admin, category_controller_1.createCategory);
router.route('/:id')
    .get(category_controller_1.getCategoryById)
    .put(auth_middleware_1.protect, auth_middleware_1.admin, category_controller_1.updateCategory)
    .delete(auth_middleware_1.protect, auth_middleware_1.admin, category_controller_1.deleteCategory);
exports.default = router;
//# sourceMappingURL=category.routes.js.map