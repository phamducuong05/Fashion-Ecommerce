import { Request, Response } from 'express';
import { DataService } from '../../services/admin/dataService';

export class ChatController {
  static async listChats(req: Request, res: Response) {
    const chats = await DataService.getChat();
    res.json(chats);
  }

  static async getChat(req: Request, res: Response) {
    const id = Number(req.params.id);
    const chats = await DataService.getChat();
    const chat = chats.find((c) => c.id === id || c.id === String(id));
    if (!chat) return res.status(404).json({ message: 'Chat not found' });
    res.json(chat);
  }

  // Compatibility: frontend expects /api/chatmessages returning chat threads
  static async listChatMessages(req: Request, res: Response) {
    // getChat() already returns properly formatted chat data
    const chats = await DataService.getChat();
    res.json(chats);
  }

  static async getChatMessages(req: Request, res: Response) {
    const id = Number(req.params.id);
    const chats = await DataService.getChat();
    const chat = chats.find((c: any) => c.id === id || String(c.id) === String(id));
    if (!chat) return res.status(404).json({ message: 'Chat not found' });
    res.json(chat);
  }
}
