# Real-time Chat Feature 💬

## Overview
Socket.IO-based real-time chat system connecting customers with admin support.

## Features
- ✅ **Real-time messaging** - Instant message delivery between users and admin
- ✅ **Auto-conversation creation** - First message automatically creates a conversation
- ✅ **Connection status** - Visual indicators for online/offline status
- ✅ **Message history** - Persistent message storage in database
- ✅ **User validation** - Ensures users exist before creating conversations

## Architecture

### Backend (Socket.IO Server)
- **Port:** 4000
- **Events:**
  - `user:join` - User connects (CUSTOMER or ADMIN)
  - `message:send` - Send a message
  - `message:received` - Broadcast new message to all connected clients
  - `admin:getConversations` - Admin requests all conversations
  - `conversation:getMessages` - Get messages for a specific conversation

### Database Models
```prisma
ChatConversation {
  id          Int
  userId      Int (references User)
  status      ChatStatus (OPEN, CLOSED, PENDING)
  unreadCount Int
  messages    ChatMessage[]
}

ChatMessage {
  id             Int
  conversationId Int
  sender         MessageSender (CUSTOMER, ADMIN)
  content        String
  isRead         Boolean
  createdAt      DateTime
}
```

## Setup Instructions

### 1. Prerequisites
- User must exist in database (run seed or create user via Prisma Studio)
- Backend server running on port 4000
- Frontend(s) with Socket.IO client installed

### 2. Testing the Chat

#### **Admin Panel** (http://localhost:5173)
1. Login as admin (user with role: ADMIN)
2. Navigate to "Chat" section
3. Wait for customers to send messages
4. Select a conversation from the list
5. Send replies in real-time

#### **Client Panel** (http://localhost:3000)
1. Login as customer (user with role: CUSTOMER)
2. Click "Support Messages" button (bottom-right)
3. Select "Chat with Admin"
4. Send a message to start conversation
5. Receive admin replies in real-time

### 3. Important Notes

**User Authentication:**
- User data must be stored in `localStorage` with key `"user"`
- Required fields: `{ id: number, name: string, email: string }`
- Set this during login process

**Valid User IDs:**
- Must use existing user IDs from database
- Check Prisma Studio (http://localhost:5555) for valid IDs
- Run `npm run seed` to create test users

**Connection Flow:**
1. Frontend reads user from localStorage
2. Connects to Socket.IO server
3. Emits `user:join` with userId, userName, role
4. Server stores user in `onlineUsers` map
5. Ready to send/receive messages!

## API Reference

### Socket.IO Events

#### Client → Server

**user:join**
```typescript
socket.emit('user:join', {
  userId: number,
  userName: string,
  role: 'CUSTOMER' | 'ADMIN'
});
```

**message:send**
```typescript
socket.emit('message:send', {
  conversationId?: number,  // Optional for first message
  message: string,
  sender: 'CUSTOMER' | 'ADMIN'
});
```

**admin:getConversations** (Admin only)
```typescript
socket.emit('admin:getConversations', {}, (conversations) => {
  console.log(conversations);
});
```

**conversation:getMessages**
```typescript
socket.emit('conversation:getMessages', 
  { conversationId: number }, 
  (messages) => {
    console.log(messages);
  }
);
```

#### Server → Client

**message:received**
```typescript
socket.on('message:received', (message) => {
  // Handle new message
  console.log(message);
  /*
  {
    id: number,
    conversationId: number,
    sender: 'CUSTOMER' | 'ADMIN',
    content: string,
    createdAt: string,
    isRead: boolean,
    conversation: { ... }
  }
  */
});
```

**admin:online** (Sent to admins on join)
```typescript
socket.on('admin:online', () => {
  console.log('Admin is now online');
});
```

**message:error**
```typescript
socket.on('message:error', (error) => {
  console.error('Message error:', error);
});
```

## File Structure

```
server/
├── src/
│   ├── server.ts                    # Socket.IO server setup
│   └── services/admin/
│       └── chatService.ts           # Chat database operations

admin/
├── src/
│   ├── services/
│   │   └── socket.ts                # Admin Socket.IO service
│   └── components/
│       └── ChatInterface.tsx        # Admin chat UI

client/
├── src/
│   ├── services/
│   │   └── socket.ts                # Customer Socket.IO service
│   └── components/
│       └── SupportWidget.tsx        # Customer chat widget
```

## Troubleshooting

### "User not found" Error
- **Cause:** Trying to send message with non-existent userId
- **Solution:** 
  1. Open Prisma Studio: `npx prisma studio`
  2. Check User table for valid IDs
  3. Use a valid user ID when testing

### "Foreign key constraint violated"
- **Cause:** ConversationId doesn't exist in database
- **Solution:** Don't provide conversationId for first message, let server create it

### Messages Not Appearing
- **Check:** Browser console for Socket.IO connection
- **Check:** Backend logs for message events
- **Check:** User is stored in localStorage
- **Check:** Backend server is running on port 4000

### Connection Failed
- **Check:** CORS settings in server.ts (ports 5173, 3000)
- **Check:** Socket.IO URL matches backend (http://localhost:4000)
- **Check:** No firewall blocking WebSocket connections

## Development Tips

### Testing with Multiple Users
1. Open admin panel in one browser window
2. Open client panel in another browser (or incognito mode)
3. Login with different user accounts
4. Send messages back and forth

### Debugging
```typescript
// Enable Socket.IO debug mode (add to socket service)
import { io } from 'socket.io-client';

const socket = io('http://localhost:4000', {
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5,
  debug: true, // Enable debugging
});
```

### Database Queries
```typescript
// Get all conversations
const conversations = await prisma.chatConversation.findMany({
  include: { user: true, messages: true }
});

// Get messages for conversation
const messages = await prisma.chatMessage.findMany({
  where: { conversationId: 1 },
  orderBy: { createdAt: 'asc' }
});
```

## Next Steps / Future Enhancements
- [ ] Add typing indicators
- [ ] Add read receipts
- [ ] Add file/image upload
- [ ] Add emoji support
- [ ] Add notification sounds
- [ ] Add unread message counter
- [ ] Add conversation search/filter
- [ ] Add admin conversation assignment
- [ ] Add automated responses
- [ ] Add chat history export

## Support
For issues or questions about the chat feature, check:
1. Browser console for errors
2. Server logs for backend issues
3. Prisma Studio for database state
4. Socket.IO connection status in Network tab
