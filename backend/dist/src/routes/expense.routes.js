"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const expense_controller_1 = require("../controllers/expense.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
// All routes are admin-only
router.use(auth_middleware_1.protect, auth_middleware_1.admin);
router.route('/')
    .get(expense_controller_1.getExpenses)
    .post(expense_controller_1.createExpense);
router.get('/summary', expense_controller_1.getExpenseSummary);
router.get('/categories', expense_controller_1.getExpenseCategories);
router.route('/:id')
    .get(expense_controller_1.getExpenseById)
    .put(expense_controller_1.updateExpense)
    .delete(expense_controller_1.deleteExpense);
exports.default = router;
//# sourceMappingURL=expense.routes.js.map