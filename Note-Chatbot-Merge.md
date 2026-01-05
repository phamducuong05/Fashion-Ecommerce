# Chatbot Integration - Merge Documentation

## 📅 Merge Date
January 5, 2026

## 🎯 Objective
Successfully merged `/server-chatbot` functionality into the main `/server` to consolidate the AI-powered chatbot feature with the existing eCommerce backend.

---

## 📦 What Was Merged

### 1. **Controller Layer**
- ✅ **File:** `server/src/controllers/user/chatbotController.ts`
- **Functions:**
  - `getChatSessions` - Get all chat sessions for a user
  - `getChatSessionById` - Get specific chat session with messages
  - `createChatSession` - Create new chat session
  - `sendMessage` - Send user message and get AI response
  - `deleteChatSession` - Delete a chat session

### 2. **Service Layer**
- ✅ **File:** `server/src/services/user/chatbotService.ts`
- **Functions:**
  - Database operations for chat sessions
  - Integration with Python AI service at `http://localhost:8000`
  - Product recommendations linking
  - Error handling for AI service failures

### 3. **Routes Layer**
- ✅ **File:** `server/src/routes/user/chatbotRoutes.ts`
- **Endpoints:**
  - `GET /api/chat/sessions` - List all sessions
  - `POST /api/chat/sessions` - Create new session
  - `GET /api/chat/sessions/:id` - Get session details
  - `POST /api/chat/sessions/:id/messages` - Send message
  - `DELETE /api/chat/sessions/:id` - Delete session

### 4. **Dependencies**
- ✅ Added `axios@^1.13.2` to `package.json` for AI service communication

### 5. **Configuration**
- ✅ Added `PYTHON_AI_SERVICE_URL="http://localhost:8000"` to `.env`

### 6. **Documentation**
- ✅ Copied `CHATBOT_API.md` to `/server` directory

---

## 🔧 Integration Changes

### Modified Files

#### 1. `server/src/server.ts`
**Added chatbot route:**
```typescript
import chatbotRoutes from "./routes/user/chatbotRoutes";

// In routes section:
app.use("/api/chat", chatbotRoutes);
```

#### 2. `server/package.json`
**Added dependency:**
```json
{
  "dependencies": {
    "axios": "^1.13.2"
  }
}
```

#### 3. `server/.env`
**Added configuration:**
```
PYTHON_AI_SERVICE_URL="http://localhost:8000"
```

---

## 🏗️ Architecture

### Request Flow
```
Customer → Frontend → Node.js Backend → Python AI Service
                          ↓
                    PostgreSQL Database
                          ↓
                    Product Recommendations
                          ↓
                    Response with Products
```

### Database Models Used
- **ChatSession** - Stores chat session metadata
- **ChatBotMessage** - Stores individual messages (USER/BOT)
- **MessageProduct** - Links messages to recommended products
- **Product** - Product details for recommendations

---

## 🚀 How to Use

### Prerequisites
1. ✅ Node.js server running (`npm run dev`)
2. ⚠️ Python AI service must be running at `http://localhost:8000`
3. ✅ PostgreSQL database with Prisma schema applied
4. ✅ User authentication (JWT token required)

### API Endpoints

#### Create New Chat Session
```bash
POST /api/chat/sessions
Authorization: Bearer <token>

Response:
{
  "id": 1,
  "title": "New Chat",
  "updatedAt": "2026-01-05T..."
}
```

#### Send Message
```bash
POST /api/chat/sessions/:id/messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Tìm váy đi biển"
}

Response:
{
  "id": "102",
  "role": "bot",
  "content": "Đây là một số mẫu váy phù hợp với bạn:",
  "products": [
    {
      "id": 55,
      "name": "Váy Maxi Hoa",
      "price": 300000,
      "image": "https://...",
      "rating": 4.5,
      "reviewCount": 100,
      "colors": ["White", "Blue"],
      "sizes": ["S", "M", "L"]
    }
  ],
  "createdAt": "2026-01-05T..."
}
```

#### Get All Sessions
```bash
GET /api/chat/sessions
Authorization: Bearer <token>

Response:
[
  {
    "id": 1,
    "title": "Váy đi biển...",
    "updatedAt": "2026-01-05T..."
  }
]
```

#### Get Session Detail
```bash
GET /api/chat/sessions/:id
Authorization: Bearer <token>

Response:
{
  "id": 1,
  "title": "Váy đi biển...",
  "messages": [...]
}
```

#### Delete Session
```bash
DELETE /api/chat/sessions/:id
Authorization: Bearer <token>

Response:
{
  "success": true
}
```

---

## 🔐 Security Features

- ✅ **JWT Authentication Required** - All endpoints protected
- ✅ **User Ownership Validation** - Users can only access their own sessions
- ✅ **Product Validation** - Only existing products are linked
- ✅ **Error Handling** - Graceful fallback when AI service fails

---

## 📊 Features

### Current Capabilities
- ✅ Multi-turn conversations with AI
- ✅ Product recommendations based on user queries
- ✅ Conversation history persistence
- ✅ Session management (create, read, delete)
- ✅ Auto-title generation from first message
- ✅ Graceful error handling
- ✅ Product metadata (colors, sizes, ratings)

### Error Handling
- If Python AI service is down, bot returns: 
  - *"Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau."*
- User message is still saved
- Session remains valid

---

## 🧪 Testing

### Manual Testing
1. Start Node.js server: `cd server && npm run dev`
2. Start Python AI service: `cd chatbot && python main.py` (or equivalent)
3. Login to get JWT token
4. Test endpoints using Postman/cURL:

```bash
# Get token first
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password"}'

# Create session
curl -X POST http://localhost:4000/api/chat/sessions \
  -H "Authorization: Bearer <token>"

# Send message
curl -X POST http://localhost:4000/api/chat/sessions/1/messages \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"content": "Tìm áo sơ mi công sở"}'
```

---

## ⚠️ Important Notes

### Python AI Service Dependency
- The chatbot **requires** the Python AI service to be running
- Default URL: `http://localhost:8000`
- Can be changed via `PYTHON_AI_SERVICE_URL` environment variable
- If service is unavailable, error message is returned to user

### Database Schema
Make sure your Prisma schema includes:
- `ChatSession` model
- `ChatBotMessage` model with `MessageRole` enum (USER/BOT)
- `MessageProduct` junction table
- Relations properly configured

### Performance Considerations
- AI service has 30-second timeout
- Product validation queries run for each recommendation
- Consider caching product data for better performance

---

## 🎯 Next Steps

### Recommended Improvements
- [ ] Add real-time Socket.IO updates for chat
- [ ] Implement typing indicators
- [ ] Add message search functionality
- [ ] Cache frequently recommended products
- [ ] Add rate limiting for AI requests
- [ ] Implement conversation context management
- [ ] Add admin dashboard to monitor chats
- [ ] Support image uploads in chat
- [ ] Add multi-language support
- [ ] Implement sentiment analysis

---

## 📚 Documentation

- **Full API Documentation**: See `server/CHATBOT_API.md`
- **Python AI Service**: Check `/chatbot` directory
- **Frontend Integration**: See `/client-chatbot` directory

---

## ✅ Merge Checklist

- [x] Controller files copied
- [x] Service files copied  
- [x] Route files copied
- [x] Routes registered in server.ts
- [x] Dependencies installed (axios)
- [x] Environment variables added
- [x] Documentation copied
- [x] Server starts without errors
- [x] All endpoints accessible

---

## 🎉 Result

✅ **Chatbot successfully merged into main server!**

The AI-powered chatbot is now integrated with the main eCommerce backend, accessible at:
- **Base URL:** `http://localhost:4000/api/chat`
- **Authentication:** Required (JWT token)
- **Status:** Production-ready for testing environment

---

## 👥 Contributors
- **Merge Implementation:** GitHub Copilot
- **Original Chatbot:** phamducuong05
- **Testing:** phamducuong05

**Date:** January 5, 2026
