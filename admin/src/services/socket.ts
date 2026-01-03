import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:4000';

class SocketService {
  private socket: Socket | null = null;
  private adminId: number | null = null;

  connect(adminId: number, adminName: string) {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.adminId = adminId;
    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket?.id);
      this.socket?.emit('user:join', {
        userId: adminId,
        userName: adminName,
        role: 'ADMIN',
      });
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    this.socket.on('message:error', (error) => {
      console.error('❌ Message error:', error);
      alert('Failed to send message: ' + (error.error || 'Unknown error'));
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket() {
    return this.socket;
  }

  // Admin gets all conversations
  getAllConversations(callback: (conversations: any[]) => void) {
    // Listen for response
    this.socket?.once('admin:conversationsList', callback);
    // Request conversations
    this.socket?.emit('admin:getConversations');
  }

  // Get messages for a specific conversation
  getMessages(conversationId: number, callback: (messages: any[]) => void) {
    // Listen for response
    this.socket?.once('conversation:messages', (data: { conversationId: number; messages: any[] }) => {
      callback(data.messages);
    });
    // Request messages
    this.socket?.emit('conversation:getMessages', conversationId);
  }

  // Mark conversation as read (reset unread count)
  markConversationAsRead(conversationId: number) {
    console.log('🔵 Marking conversation as read:', conversationId);
    this.socket?.emit('conversation:markAsRead', conversationId);
  }

  // Send a message
  sendMessage(data: { conversationId?: number; message: string; sender: 'ADMIN' }) {
    this.socket?.emit('message:send', data);
  }

  // Listen for new messages
  onMessageReceived(callback: (message: any) => void) {
    this.socket?.on('message:received', callback);
  }

  // Remove message listener
  offMessageReceived(callback: (message: any) => void) {
    this.socket?.off('message:received', callback);
  }
}

export const socketService = new SocketService();
