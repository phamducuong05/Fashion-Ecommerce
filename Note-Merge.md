# Server Merge Notes

## Overview

This document details the merge of the **user-server** and **admin-server** into a single unified **server** directory, following proper OOP naming conventions.

---

## Merge Summary

### Before Merge
```
Fashion-Ecommerce-frontend-admin-panel/
├── admin-server/      # Admin API server
│   ├── controllers/
│   ├── routes/
│   └── services/
├── user-server/       # User API server  
│   ├── controllers/
│   ├── routes/
│   └── services/
```

### After Merge (Final Structure)
```
Fashion-Ecommerce-frontend-admin-panel/
├── admin/                           # Admin frontend (React + Vite)
│   └── src/
│       └── components/
│           ├── ProductManagement.tsx
│           ├── PromotionManagement.tsx
│           ├── CustomerManagement.tsx
│           ├── OrderManagement.tsx
│           ├── Dashboard.tsx
│           └── ChatInterface.tsx
├── client/                          # User frontend (React + Vite)
│   └── src/
│       ├── pages/
│       │   ├── home.tsx
│       │   ├── products.tsx
│       │   ├── cart.tsx
│       │   ├── profile.tsx
│       │   ├── signin.tsx
│       │   └── register.tsx
│       └── components/
│           ├── ProductDetails.tsx
│           ├── AddressBook.tsx
│           ├── OrderHistory.tsx
│           └── OrderDetailPage.tsx
└── server/                          # Unified server
    ├── prisma/
    │   ├── schema.prisma
    │   └── seed.ts
    ├── src/
    │   ├── server.ts               # Main server entry point
    │   ├── controllers/
    │   │   ├── admin/              # Admin controllers
    │   │   │   ├── chatController.ts
    │   │   │   ├── customerController.ts
    │   │   │   ├── dashboardController.ts
    │   │   │   ├── orderController.ts
    │   │   │   ├── productController.ts
    │   │   │   ├── profileController.ts
    │   │   │   └── promotionController.ts
    │   │   └── user/               # User controllers
    │   │       ├── addressController.ts
    │   │       ├── authController.ts
    │   │       ├── cartController.ts
    │   │       ├── categoryController.ts
    │   │       ├── orderController.ts
    │   │       ├── productController.ts
    │   │       └── userController.ts
    │   ├── routes/
    │   │   ├── admin/              # Admin routes
    │   │   │   └── index.ts
    │   │   └── user/               # User routes
    │   │       ├── addressRoutes.ts
    │   │       ├── authRoutes.ts
    │   │       ├── cartRoutes.ts
    │   │       ├── categoryRoutes.ts
    │   │       ├── orderRoutes.ts
    │   │       ├── productRoutes.ts
    │   │       └── userRoutes.ts
    │   ├── services/
    │   │   ├── admin/              # Admin services
    │   │   │   └── dataService.ts
    │   │   └── user/               # User services
    │   │       ├── addressService.ts
    │   │       ├── authService.ts
    │   │       ├── cartService.ts
    │   │       ├── categoryService.ts
    │   │       ├── orderService.ts
    │   │       ├── productService.ts
    │   │       └── userService.ts
    │   ├── middlewares/
    │   │   ├── auth.middleware.ts
    │   │   └── error.middleware.ts
    │   └── utils/
    │       ├── AppError.ts
    │       └── prisma.ts
    └── package.json
```

---

## File Naming Convention (OOP Standard)

### Admin Controllers (`/controllers/admin/`)
Using **PascalCase** class names with **camelCase** file names:

| File Name | Class Name | Description |
|-----------|------------|-------------|
| `chatController.ts` | `ChatController` | Chat/Support message management |
| `customerController.ts` | `CustomerController` | Customer data management |
| `dashboardController.ts` | `DashboardController` | Dashboard statistics |
| `orderController.ts` | `OrderController` | Order management |
| `productController.ts` | `ProductController` | Product CRUD operations |
| `profileController.ts` | `ProfileController` | Admin profile management |
| `promotionController.ts` | `PromotionController` | Discounts & Banners CRUD |

### Admin Services (`/services/admin/`)
Using **PascalCase** class names with **camelCase** file names:

| File Name | Class Name | Description |
|-----------|------------|-------------|
| `dataService.ts` | `DataService` | Data aggregation service |

### Admin Routes (`/routes/admin/`)
Using **camelCase** file names:

| File Name | Prefix | Description |
|-----------|--------|-------------|
| `index.ts` | `/api/admin` | All admin API routes |

---

## API Endpoints Structure

### Admin API (`/api/admin`)

#### Dashboard
- `GET /dashboard` - Dashboard statistics

#### Customers
- `GET /customers` - List all customers
- `GET /customers/:id` - Get customer details

#### Orders
- `GET /orders` - List all orders
- `GET /orders/:id` - Get order details
- `PUT /orders/:id/status` - Update order status

#### Products (Full CRUD)
- `GET /products` - List all products
- `GET /products/:id` - Get product details
- `POST /products` - Create new product
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product

#### Promotions - Discounts (Full CRUD)
- `GET /discounts` - List all discounts/vouchers
- `POST /discounts` - Create new discount
- `PUT /discounts/:id` - Update discount
- `DELETE /discounts/:id` - Delete discount

#### Promotions - Banners (Full CRUD)
- `GET /banners` - List all banners
- `POST /banners` - Create new banner
- `PUT /banners/:id` - Update banner
- `DELETE /banners/:id` - Delete banner

#### Chat/Support
- `GET /chatmessages` - List all chat conversations
- `GET /chatmessages/:id` - Get chat messages

#### Profile Management
- `GET /profile` - Get admin profile
- `PUT /profile` - Update admin profile
- `POST /change-password` - Change password
- `DELETE /account` - Delete admin account

### User API (`/api`)
- `/api/auth/*` - Authentication routes
- `/api/users/*` - User management
- `/api/products/*` - Product browsing
- `/api/categories/*` - Category browsing
- `/api/cart/*` - Shopping cart
- `/api/orders/*` - User orders
- `/api/addresses/*` - User addresses

---

## Database Schema Changes

During the merge process, the following schema updates were made:

### New Models Added
1. **ChatConversation** - For managing chat conversations
2. **ChatMessage** - For storing individual chat messages
3. **Banner** - For promotional banners

### New Enums Added
1. **ChatStatus** - `OPEN`, `CLOSED`, `PENDING`
2. **MessageSender** - `CUSTOMER`, `ADMIN`

### Modified Models
1. **Voucher** - Added `description` field

See `Note-Schema.md` for detailed schema documentation.

---

## Server Configuration

### Single Server Entry Point
```typescript
// src/server.ts
const PORT = process.env.PORT || 4000;

// Admin routes: /api/admin/*
app.use('/api/admin', adminRoutes);

// User routes: /api/*
app.use('/api', userRoutes);
```

### Port Configuration
- **Backend Server**: Port 4000
- **Frontend Admin Panel**: Port 5173 (Vite dev server)
- **Frontend Client (User)**: Port 3000 (Vite dev server)

### Proxy Configuration (Vite)

**Admin Panel** (`admin/vite.config.ts`):
```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:4000',
      changeOrigin: true,
    },
  },
}
```

**Client (User FE)** (`client/vite.config.ts`):
```typescript
server: {
  port: 3000,
  proxy: {
    '/api': {
      target: 'http://localhost:4000',
      changeOrigin: true,
      secure: false,
    },
  },
}
```

---

## Frontend Changes

### Admin Panel (`/admin`)

#### ProductManagement.tsx - Modal Fix
**Issue:** Edit/Add buttons for products did nothing when clicked.

**Cause:** The `showModal` state was being set but **no modal JSX was rendered** in the component.

**Solution:** Added complete product modal component (~170 lines) with:
- Form fields: name, category, status, price, stock, image URL
- Variants management section with size/color inputs
- Save/Cancel buttons with API integration
- Proper state management for edit vs. add modes

### Client (User FE) (`/client`)

#### URL Configuration Updates
**Issue:** Client was hardcoded to use `http://localhost:3000/api/` which doesn't work with the backend on port 4000.

**Solution:** 
1. Added Vite proxy configuration to forward `/api` requests to port 4000
2. Updated all API calls to use relative paths (`/api/...` instead of hardcoded URLs)

**Files Updated (11 files, 20 occurrences):**

| File | Changes | API Calls |
|------|---------|-----------|
| `App.tsx` | 3 | Cart operations |
| `AddressBook.tsx` | 4 | Address CRUD |
| `cart.tsx` | 3 | Cart view/update/delete |
| `home.tsx` | 1 | Products listing |
| `products.tsx` | 2 | Categories, Products listing |
| `profile.tsx` | 2 | Profile get/update |
| `register.tsx` | 1 | User registration |
| `signin.tsx` | 1 | User login |
| `OrderDetailPage.tsx` | 1 | Order details |
| `OrderHistory.tsx` | 1 | Order history |
| `ProductDetails.tsx` | 1 | Product details |

**Before:**
```typescript
const res = await fetch("http://localhost:3000/api/products");
```

**After:**
```typescript
const res = await fetch("/api/products");
```

---

## Migration Steps Performed

1. **Merged Directory Structure**
   - Combined admin-server and user-server into single server directory
   - Created subdirectories for user-specific controllers/services/routes

2. **Unified Prisma Schema**
   - Single schema.prisma file with all models
   - Single seed.ts file with all seeding logic

3. **Unified Server Entry Point**
   - Single server.ts handling both admin and user routes
   - Proper CORS configuration for frontend

4. **Updated Imports**
   - Fixed all import paths after merge
   - Created shared utils (prisma client instance)

---

## Development Commands

```bash
# Start backend server
cd server && npm run dev

# Start admin frontend
cd admin && npm run dev

# Start client (user) frontend
cd client && npm run dev

# Run Prisma migrations
cd server && npx prisma migrate dev

# Seed database
cd server && npx prisma db seed

# Reset database and reseed
cd server && npx prisma migrate reset
```

---

## Running Services Summary

| Service | Port | URL | Description |
|---------|------|-----|-------------|
| Backend Server | 4000 | http://localhost:4000 | Express API |
| Admin Frontend | 5173 | http://localhost:5173 | Admin panel |
| Client Frontend | 3000 | http://localhost:3000 | User-facing app |

---

## Notes

- All admin controllers use static methods following OOP conventions
- User controllers follow similar patterns in the `user/` subdirectory
- The unified server maintains separation of concerns through directory structure
- Authentication middleware can be applied to specific route groups as needed

---

*Document created: January 2025*
*Last updated: January 2, 2026 - Frontend changes (Product modal fix, Client URL configuration)*
