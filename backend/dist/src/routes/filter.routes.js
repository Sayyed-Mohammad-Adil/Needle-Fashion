"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const filter_controller_1 = require("../controllers/filter.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.route('/')
    .get(filter_controller_1.getFilters)
    .post(auth_middleware_1.protect, auth_middleware_1.admin, filter_controller_1.createFilter);
router.route('/:id')
    .get(filter_controller_1.getFilterById)
    .put(auth_middleware_1.protect, auth_middleware_1.admin, filter_controller_1.updateFilter)
    .delete(auth_middleware_1.protect, auth_middleware_1.admin, filter_controller_1.deleteFilter);
router.route('/:id/values')
    .post(auth_middleware_1.protect, auth_middleware_1.admin, filter_controller_1.addFilterValue);
router.route('/:id/values/:value')
    .delete(auth_middleware_1.protect, auth_middleware_1.admin, filter_controller_1.removeFilterValue);
exports.default = router;
//# sourceMappingURL=filter.routes.js.map