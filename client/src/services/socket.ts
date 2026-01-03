import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:4000';

class SocketService {
  private socket: Socket | null = null;
  private userId: number | null = null;

  connect(userId: number, userName: string) {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.userId = userId;
    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket?.id);
      this.socket?.emit('user:join', {
        userId,
        userName,
        role: 'CUSTOMER',
      });
      console.log('👤 Emitted user:join event for customer:', userId);
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

  // Send a message (no conversationId needed for first message)
  sendMessage(data: { conversationId?: number; message: string; sender: 'CUSTOMER' }) {
    this.socket?.emit('message:send', data);
  }

  // Get messages for a conversation (for loading history)
  getMessages(conversationId: number, callback: (messages: any[]) => void) {
    this.socket?.once('conversation:messages', (data: { conversationId: number; messages: any[] }) => {
      console.log('📜 Received message history:', data.messages);
      callback(data.messages);
    });
    this.socket?.emit('conversation:getMessages', conversationId);
  }

  // Get customer's own conversation (loads conversation + message history)
  getMyConversation(callback: (data: { conversation: any; messages: any[] }) => void) {
    this.socket?.once('customer:myConversation', (data) => {
      console.log('📦 Received my conversation:', data);
      callback(data);
    });
    this.socket?.emit('customer:getMyConversation');
  }

  // Listen for new messages
  onMessageReceived(callback: (message: any) => void) {
    console.log('🎧 Setting up message:received listener');
    this.socket?.on('message:received', (message) => {
      console.log('🔔 Socket received message:received event:', message);
      callback(message);
    });
  }

  // Remove message listener
  offMessageReceived(callback: (message: any) => void) {
    this.socket?.off('message:received', callback);
  }

  // Listen for admin online status
  onAdminOnline(callback: () => void) {
    this.socket?.on('admin:online', callback);
  }
}

export const socketService = new SocketService();
