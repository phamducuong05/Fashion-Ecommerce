import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import chatbotService from "../../services/user/chatbotService";

// 1. Get all chat sessions
const getChatSessions = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const sessions = await chatbotService.getChatSessions(userId);
    res.status(200).json(sessions);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Get chat session detail
const getChatSessionById = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const sessionId = parseInt(req.params.id);
    const session = await chatbotService.getChatSessionById(sessionId, userId);
    res.status(200).json(session);
  } catch (error: any) {
    const status = error.statusCode || 500;
    res.status(status).json({ message: error.message });
  }
};

// 3. Create new chat session
const createChatSession = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    console.log('Creating chat session for user:', userId);
    const newSession = await chatbotService.createChatSession(userId);
    console.log('Session created:', newSession);
    res.status(201).json(newSession);
  } catch (error: any) {
    console.error('Error creating chat session:', error);
    res.status(500).json({ message: error.message });
  }
};

// 4. Send message
const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const sessionId = parseInt(req.params.id);
    const { content } = req.body;

    if (!content || content.trim() === "") {
      return res.status(400).json({ message: "Message content is required" });
    }

    const botResponse = await chatbotService.sendMessage(
      sessionId,
      userId,
      content
    );
    res.status(200).json(botResponse);
  } catch (error: any) {
    const status = error.statusCode || 500;
    res.status(status).json({ message: error.message });
  }
};

// 5. Delete chat session
const deleteChatSession = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const sessionId = parseInt(req.params.id);
    const result = await chatbotService.deleteChatSession(sessionId, userId);
    res.status(200).json(result);
  } catch (error: any) {
    const status = error.statusCode || 500;
    res.status(status).json({ message: error.message });
  }
};

export default {
  getChatSessions,
  getChatSessionById,
  createChatSession,
  sendMessage,
  deleteChatSession,
};
