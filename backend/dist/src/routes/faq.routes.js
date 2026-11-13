"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const faq_controller_1 = require("../controllers/faq.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.route('/')
    .get(faq_controller_1.getFAQs)
    .post(auth_middleware_1.protect, auth_middleware_1.admin, faq_controller_1.createFAQ);
router.get('/search', faq_controller_1.searchFAQs);
router.get('/categories', faq_controller_1.getFAQCategories);
router.post('/chatbot', faq_controller_1.getChatbotResponse);
router.route('/:id')
    .get(faq_controller_1.getFAQById)
    .put(auth_middleware_1.protect, auth_middleware_1.admin, faq_controller_1.updateFAQ)
    .delete(auth_middleware_1.protect, auth_middleware_1.admin, faq_controller_1.deleteFAQ);
exports.default = router;
//# sourceMappingURL=faq.routes.js.map