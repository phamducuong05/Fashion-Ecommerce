# Schema Update Notes - Chat System & Admin CRUD

## Date: January 2, 2026

## Overview
This document describes the schema changes made to implement:
1. A proper Chat system for the Admin Panel frontend
2. Banner system for promotions
3. Description field for Vouchers

---

## Schema Changes Summary

### 1. Chat System (Added)
- **ChatStatus** enum: `OPEN`, `CLOSED`, `PENDING`
- **MessageSender** enum: `CUSTOMER`, `ADMIN`
- **ChatConversation** model: Chat threads between customer and admin
- **ChatMessage** model: Individual messages in conversations

### 2. Banner System (Added)
- **Banner** model: Promotional banners for the storefront

### 3. Voucher Update
- Added `description` field to Voucher model

---

## New Models

### Banner
Represents promotional banners for the storefront.

```prisma
model Banner {
  id        Int      @id @default(autoincrement())
  title     String
  subtitle  String?
  imageUrl  String
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

| Field | Type | Description |
|-------|------|-------------|
| id | Int | Primary key |
| title | String | Banner title |
| subtitle | String? | Optional subtitle |
| imageUrl | String | Image URL |
| isActive | Boolean | Whether banner is active |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

### ChatConversation
Represents a chat thread between a customer and admin support.

```prisma
model ChatConversation {
  id          Int            @id @default(autoincrement())
  userId      Int
  user        User           @relation(fields: [userId], references: [id])
  
  status      ChatStatus     @default(OPEN)
  unreadCount Int            @default(0)
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt
  
  messages    ChatMessage[]
}
```

### ChatMessage
Represents individual messages within a conversation.

```prisma
model ChatMessage {
  id             Int              @id @default(autoincrement())
  conversationId Int
  conversation   ChatConversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  
  sender         MessageSender
  content        String           @db.Text
  isRead         Boolean          @default(false)
  createdAt      DateTime         @default(now())
}
```

---

## API Endpoints

### Products - CRUD
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/admin/products | List all products |
| GET | /api/admin/products/:id | Get product by ID |
| POST | /api/admin/products | Create new product |
| PUT | /api/admin/products/:id | Update product |
| DELETE | /api/admin/products/:id | Delete product |

### Discounts (Vouchers) - CRUD
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/admin/discounts | List all discounts |
| POST | /api/admin/discounts | Create new discount |
| PUT | /api/admin/discounts/:id | Update discount |
| DELETE | /api/admin/discounts/:id | Delete discount |

### Banners - CRUD
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/admin/banners | List all banners |
| POST | /api/admin/banners | Create new banner |
| PUT | /api/admin/banners/:id | Update banner |
| DELETE | /api/admin/banners/:id | Delete banner |

### Profile Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/admin/profile | Get admin profile |
| PUT | /api/admin/profile | Update profile (name, email) |
| POST | /api/admin/change-password | Change password |
| DELETE | /api/admin/account | Delete account |

### Chat
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/admin/chatmessages | List all chat conversations |
| GET | /api/admin/chatmessages/:id | Get chat conversation by ID |

---

## Migration Commands

Run these commands in order:

```bash
# 1. Navigate to server directory
cd server

# 2. Push schema changes to database
npx prisma db push

# 3. Generate new Prisma client
npx prisma generate

# 4. Run seed to populate data
npx prisma db seed
```

---

## Seed Data

The seed now creates:
- 50 Users (1 Admin, 50 Customers)
- 75+ Products with variants
- 30 Orders
- 3 Vouchers
- 20 Chat Conversations with 93 Messages
- 3 Banners

---

## Date: January 3, 2026

## Chatbot Session System (Added)

### Overview
Added a new chatbot session system to manage AI-powered chat conversations with product suggestions. This is separate from the admin chat system and is designed for the AI chatbot functionality.

### New Enum

#### ChatRole
```prisma
enum ChatRole {
  USER
  BOT
}
```

### New Models

#### ChatSession
Manages chatbot conversation sessions. Supports both logged-in users and guest users.

```prisma
model ChatSession {
  id        Int              @id @default(autoincrement())
  userId    Int?             // NULL nếu là khách vãng lai (Guest)
  user      User?            @relation(fields: [userId], references: [id], onDelete: SetNull)
  title     String           @default("New Chat")
  createdAt DateTime         @default(now())
  updatedAt DateTime         @updatedAt

  messages  ChatBotMessage[]
}
```

| Field | Type | Description |
|-------|------|-------------|
| id | Int | Primary key |
| userId | Int? | Optional - NULL for guest users |
| title | String | Chat title, defaults to "New Chat" |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

#### ChatBotMessage
Stores individual messages in a chatbot conversation.

```prisma
model ChatBotMessage {
  id        BigInt       @id @default(autoincrement())
  sessionId Int
  session   ChatSession  @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  role      ChatRole
  content   String       @db.Text
  createdAt DateTime     @default(now())

  products  MessageProduct[]
}
```

| Field | Type | Description |
|-------|------|-------------|
| id | BigInt | Primary key |
| sessionId | Int | Foreign key to ChatSession |
| role | ChatRole | USER or BOT |
| content | String | Message content |
| createdAt | DateTime | Creation timestamp |

#### MessageProduct
Stores AI-suggested products linked to a specific bot message.

```prisma
model MessageProduct {
  id        Int            @id @default(autoincrement())
  messageId BigInt
  message   ChatBotMessage @relation(fields: [messageId], references: [id], onDelete: Cascade)
  productId Int
  product   Product        @relation(fields: [productId], references: [id], onDelete: Cascade)
}
```

| Field | Type | Description |
|-------|------|-------------|
| id | Int | Primary key |
| messageId | BigInt | Foreign key to ChatBotMessage |
| productId | Int | Foreign key to Product |

### Updated Models

#### User
Added relation to ChatSession:
```prisma
chatSessions    ChatSession[]
```

#### Product
Added relation to MessageProduct:
```prisma
messageProducts MessageProduct[]
```

### Relationships Diagram

```
User (optional)
  │
  └──< ChatSession
          │
          └──< ChatBotMessage
                  │
                  └──< MessageProduct >── Product
```

### Migration Command

```bash
cd server
npx prisma migrate dev --name add_chatbot_sessions
```

---

## Chatbot Backend API Implementation

### Date: January 4, 2026

Created complete backend API for chatbot functionality with the following structure:

#### Files Created
1. **Service Layer**: `server/src/services/user/chatbotService.ts`
   - Business logic for chatbot operations
   - Integration with Python AI service
   - Product data formatting and enrichment

2. **Controller Layer**: `server/src/controllers/user/chatbotController.ts`
   - Request/response handling
   - Input validation
   - Error handling

3. **Routes**: `server/src/routes/user/chatbotRoutes.ts`
   - RESTful API endpoint definitions
   - Authentication middleware integration

4. **Documentation**: `server/CHATBOT_API.md`
   - Complete API documentation
   - Request/response examples
   - Testing commands

#### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/chat/sessions` | Get all chat sessions |
| POST | `/api/chat/sessions` | Create new chat session |
| GET | `/api/chat/sessions/:id` | Get session detail with messages |
| POST | `/api/chat/sessions/:id/messages` | Send message & get AI response |
| DELETE | `/api/chat/sessions/:id` | Delete chat session |

#### Key Features
- ✅ JWT Authentication on all endpoints
- ✅ User authorization (users can only access their own sessions)
- ✅ Auto-update session title from first message
- ✅ Integration with Python AI service via HTTP
- ✅ Product enrichment (includes colors, sizes, ratings)
- ✅ Cascade delete for sessions and messages
- ✅ Error handling with fallback messages
- ✅ 30-second timeout for AI service calls

#### Configuration
Added to `server/.env`:
```env
PYTHON_AI_SERVICE_URL="http://localhost:8000"
```

#### Dependencies Added
- `axios`: For HTTP requests to Python AI service

#### Python AI Service Contract

**Request Format:**
```json
{
  "session_id": 123,
  "query": "User's message"
}
```

**Expected Response:**
```json
{
  "content": "Bot's response text",
  "products": [55, 42, 38]
}
```