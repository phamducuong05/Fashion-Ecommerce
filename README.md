# Fashion-Ecommerce 
Merge version of admin backend and user backend.

- Read Note-Schema.md and Note-Merge.md for more detail.

## Requirements
- **Node.js v18+** (recommended: v20 or v22)
- **npm v9+**

Check your version:
```bash
node --version  # Should be v18.x, v20.x, or v22.x
npm --version   # Should be v9.x or v10.x
```

## Quick Setup

### 1. Server (Backend)
```bash
cd server
npm install
# Create .env file with:
# PORT=4000
# DATABASE_URL="your-neondb-connection-string"
# JWT_SECRET="your-secret-key"
# JWT_EXPIRES_IN="7d"
npx prisma generate
npm run dev
```

### 2. Admin Frontend
```bash
cd admin
npm install
npm run dev
# Opens at http://localhost:5173
```

### 3. Client Frontend (User)
```bash
cd client
npm install
npm run dev
# Opens at http://localhost:3000
```

## Troubleshooting

### Blank page on client?
1. Make sure server is running first (port 4000)
2. Check browser console (F12) for errors
3. Try deleting and reinstalling:
```bash
cd client
rm -rf node_modules package-lock.json
npm install
npm run dev
```