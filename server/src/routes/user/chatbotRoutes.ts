import { Router } from "express";
import chatbotController from "../../controllers/user/chatbotController";
import { authenticateToken } from "../../middlewares/auth.middleware";

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// 1. Get all chat sessions
router.get("/sessions", chatbotController.getChatSessions);

// 2. Create new chat session
router.post("/sessions", chatbotController.createChatSession);

// 3. Get chat session detail
router.get("/sessions/:id", chatbotController.getChatSessionById);

// 4. Send message to chat session
router.post("/sessions/:id/messages", chatbotController.sendMessage);

// 5. Delete chat session
router.delete("/sessions/:id", chatbotController.deleteChatSession);

export default router;
