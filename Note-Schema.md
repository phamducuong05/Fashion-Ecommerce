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
