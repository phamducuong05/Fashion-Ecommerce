# Chatbot API Documentation

## Overview
RESTful API endpoints for managing AI-powered chatbot sessions and messages with product recommendations.

---

## Base URL
```
http://localhost:4000/api/chat
```

---

## Authentication
All endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Endpoints

### 1. Get All Chat Sessions
**Get list of chat conversation history for current user**

- **Method**: `GET`
- **URL**: `/api/chat/sessions`
- **Auth Required**: Yes

#### Response (200 OK)
```json
[
  {
    "id": 10,
    "title": "Váy đi biển mùa hè...",
    "updatedAt": "2023-10-25T14:00:00Z"
  },
  {
    "id": 9,
    "title": "Áo sơ mi công sở",
    "updatedAt": "2023-10-24T09:30:00Z"
  }
]
```

---

### 2. Get Chat Session Detail
**Get message history of a specific session with product details**

- **Method**: `GET`
- **URL**: `/api/chat/sessions/:id`
- **Auth Required**: Yes
- **Authorization**: Only the session owner can access

#### Response (200 OK)
```json
{
  "id": 10,
  "title": "Váy đi biển mùa hè...",
  "messages": [
    {
      "id": "101",
      "role": "user",
      "content": "Tìm váy đi biển",
      "products": [],
      "createdAt": "2023-10-25T14:00:00Z"
    },
    {
      "id": "102",
      "role": "bot",
      "content": "Đây là một số mẫu váy phù hợp với bạn:",
      "products": [
        {
          "id": 55,
          "name": "Váy Maxi Hoa",
          "price": 300000,
          "image": "https://example.com/img.jpg",
          "slug": "vay-maxi-hoa",
          "rating": 4.5,
          "reviewCount": 100,
          "colors": ["White", "Blue", "Pink"],
          "sizes": ["S", "M", "L"]
        }
      ],
      "createdAt": "2023-10-25T14:00:05Z"
    }
  ]
}
```

#### Error Response (404 Not Found)
```json
{
  "message": "Chat session not found or unauthorized"
}
```

---

### 3. Create New Chat Session
**Initialize a new chat session**

- **Method**: `POST`
- **URL**: `/api/chat/sessions`
- **Auth Required**: Yes

#### Response (201 Created)
```json
{
  "id": 11,
  "title": "New Chat",
  "updatedAt": "2023-10-25T15:00:00Z"
}
```

---

### 4. Send Message
**Send a message, process AI, and get bot response with product recommendations**

- **Method**: `POST`
- **URL**: `/api/chat/sessions/:id/messages`
- **Auth Required**: Yes

#### Request Body
```json
{
  "content": "Tôi muốn mua giày sneaker trắng size 40"
}
```

#### Process Flow
1. Validate session exists and belongs to user
2. Save user message to database
3. Auto-update session title if this is the first message (first 50 chars)
4. Call Python AI service with session_id and query
5. Save bot response message
6. Link suggested products to the message
7. Return bot message with product details

#### Response (200 OK)
```json
{
  "id": "205",
  "role": "bot",
  "content": "Dưới đây là các mẫu sneaker trắng size 40 bán chạy nhất:",
  "products": [
    {
      "id": 55,
      "name": "Nike Air Force 1",
      "price": 2500000,
      "image": "https://img.nike.com/...",
      "slug": "nike-air-force-1",
      "rating": 4.5,
      "reviewCount": 100,
      "colors": ["White", "Black"],
      "sizes": ["39", "40", "41"]
    }
  ],
  "createdAt": "2023-10-25T15:00:05Z"
}
```

#### Error Response (400 Bad Request)
```json
{
  "message": "Message content is required"
}
```

#### Error Response (404 Not Found)
```json
{
  "message": "Chat session not found or unauthorized"
}
```

---

### 5. Delete Chat Session
**Delete a chat session and all related messages**

- **Method**: `DELETE`
- **URL**: `/api/chat/sessions/:id`
- **Auth Required**: Yes
- **Cascade Delete**: All messages and product links are automatically deleted

#### Response (200 OK)
```json
{
  "success": true
}
```

#### Error Response (404 Not Found)
```json
{
  "message": "Chat session not found or unauthorized"
}
```

---

## Python AI Service Integration

### Actual Python API Endpoint
- **URL**: `http://localhost:8000/api/v1/chat`
- **Method**: POST
- **Content-Type**: application/json

### Request to Python Service
```json
{
  "session_id": 10,
  "query": "Tôi muốn mua giày sneaker trắng"
}
```

### Response from Python Service
```json
{
  "content": "Dưới đây là các mẫu sneaker trắng bán chạy nhất...",
  "intent": "PRODUCT_QUERY",
  "products": [
    {
      "id": "55",
      "name": "Nike Air Force 1",
      "price": 2500000,
      "image": "...",
      "rating": 4.5,
      "reviewCount": 120,
      "colors": ["White", "Black"],
      "sizes": ["39", "40", "41"]
    }
  ]
}
```

### Backend Processing
1. Receives full product details from Python service
2. Saves bot message to database
3. Extracts product IDs and saves to `message_products` table for linking
4. Returns products directly from Python response to frontend
5. When fetching history, enriches products with data from database (including slug)

### Configuration
Set the Python AI service URL in `.env`:
```env
PYTHON_AI_SERVICE_URL=http://localhost:8000
```

### Error Handling
If the AI service fails or times out (30s), the backend will:
1. Log the error
2. Save a fallback error message as bot response
3. Return the error message to the user

---

## Database Schema

### ChatSession
- Stores conversation sessions
- Links to User (nullable for guest support)
- Auto-updates `updatedAt` on changes

### ChatBotMessage
- Stores individual messages (user and bot)
- Links to ChatSession (cascade delete)
- Uses BIGINT for ID to handle large volume

### MessageProduct
- Links bot messages to suggested products
- Many-to-many relationship
- Cascade delete on both sides

---

## Testing with cURL

### Create Session
```bash
curl -X POST http://localhost:4000/api/chat/sessions \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Send Message
```bash
curl -X POST http://localhost:4000/api/chat/sessions/1/messages \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content": "Tìm váy đi biển"}'
```

### Get Sessions
```bash
curl -X GET http://localhost:4000/api/chat/sessions \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Session Detail
```bash
curl -X GET http://localhost:4000/api/chat/sessions/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Delete Session
```bash
curl -X DELETE http://localhost:4000/api/chat/sessions/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Notes

1. **Authorization**: All endpoints check that the session belongs to the authenticated user
2. **Cascade Delete**: Deleting a session automatically removes all messages and product links
3. **Auto Title**: First user message (up to 50 chars) becomes the session title
4. **BigInt IDs**: Message IDs use BigInt for scalability
5. **Product Details**: Bot responses include full product information (price, images, variants)
6. **Error Recovery**: AI service failures are handled gracefully with fallback messages
7. **Timeout**: AI service requests timeout after 30 seconds
