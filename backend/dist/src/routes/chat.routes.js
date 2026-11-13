"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chatbot_controller_1 = require("../controllers/chatbot.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
// Public routes (but session-based)
router.route('/sessions/:sessionId').get(chatbot_controller_1.getChatSession);
router.route('/sessions/:sessionId/messages').post(chatbot_controller_1.sendMessage);
router.route('/sessions/:sessionId/end').put(chatbot_controller_1.endChatSession);
// Protected routes
router.route('/sessions').get(auth_middleware_1.protect, chatbot_controller_1.getAllSessions);
router.route('/history').get(auth_middleware_1.protect, chatbot_controller_1.getChatHistory);
exports.default = router;
//# sourceMappingURL=chat.routes.js.map