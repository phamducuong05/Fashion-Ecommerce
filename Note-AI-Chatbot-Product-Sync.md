# AI Chatbot Product Sync Feature

## Overview
Automatic product synchronization system that keeps the AI chatbot's product knowledge up-to-date whenever admins add, update, or delete products.

## How It Works

### 1. Automatic Sync (Recommended)
Products are **automatically synced** to the AI service whenever:
- ✅ Admin creates a new product → Auto-sync triggered
- ✅ Admin updates a product → Auto-sync triggered  
- ✅ Admin deletes a product → Auto-sync triggered

**No manual action required!** The sync happens in the background.

### 2. Manual Sync (Optional)
Admin can also manually trigger a sync using the API endpoint:

**Endpoint**: `POST /api/admin/chatbot/sync`

**Usage**:
```bash
curl -X POST http://localhost:4000/api/admin/chatbot/sync \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**Response**:
```json
{
  "success": true,
  "syncedCount": 45,
  "message": "Products synced successfully"
}
```

## Technical Implementation

### Backend Architecture

#### 1. Sync Service (`chatbotService.ts`)
```typescript
syncProductsToAI() {
  // 1. Fetch all active products from database
  // 2. Transform to AI service format (colors, sizes, categories)
  // 3. POST to Python AI service: /api/sync-products
  // 4. Return sync result
}
```

#### 2. Product Controller Integration
```typescript
// After creating product
chatbotService.syncProductsToAI().catch(err => {
  console.error('Failed to auto-sync:', err.message);
});
```

#### 3. API Routes
- `POST /api/admin/chatbot/sync` - Manual sync endpoint (admin only)

### Data Format Sent to AI

```typescript
{
  products: [
    {
      id: "123",
      name: "Summer Dress",
      description: "Beautiful floral dress",
      price: 299000,
      originalPrice: 399000,
      image: "https://...",
      rating: 4.5,
      reviewCount: 28,
      colors: ["Red", "Blue", "White"],
      sizes: ["S", "M", "L", "XL"],
      categories: ["Dresses", "Summer Collection"],
      slug: "summer-dress-123"
    }
  ]
}
```

## Python AI Service Requirements

Your Python AI service must implement this endpoint:

```python
@app.post("/api/sync-products")
async def sync_products(request: SyncProductsRequest):
    """
    Receive product catalog updates from Node.js backend
    Update AI's product knowledge base
    """
    products = request.products
    
    # Update your AI's product database/embeddings
    # Refresh recommendation models
    # Update search indexes
    
    return {
        "success": True,
        "message": f"Synced {len(products)} products",
        "timestamp": datetime.now().isoformat()
    }
```

## Frontend Integration (Optional)

Add a "Sync Products" button in the admin product management page:

```typescript
const syncProducts = async () => {
  try {
    const response = await axios.post(
      '/api/admin/chatbot/sync',
      {},
      {
        headers: {
          Authorization: `Bearer ${adminToken}`
        }
      }
    );
    
    console.log('Sync result:', response.data);
    alert(`✅ Synced ${response.data.syncedCount} products`);
  } catch (error) {
    console.error('Sync failed:', error);
    alert('❌ Failed to sync products');
  }
};
```

## Error Handling

### Graceful Failure
- If sync fails, it **won't block** product creation/update
- Error is logged but not thrown
- Admin sees success for product operation
- Sync failure logged in server console

### Retry Strategy
```typescript
// Auto-sync uses fire-and-forget pattern
chatbotService.syncProductsToAI().catch(err => {
  console.error('Failed to auto-sync:', err.message);
  // Product operation continues successfully
});
```

## Testing

### Test Auto-Sync
1. Start server: `cd server && npm run dev`
2. Create a product via admin panel
3. Check server logs for: `✅ Products synced to AI service`
4. Verify Python AI service received the data

### Test Manual Sync
```bash
# Login as admin first to get token
curl -X POST http://localhost:4000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'

# Use the token
curl -X POST http://localhost:4000/api/admin/chatbot/sync \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Performance Considerations

### Optimization
- Only syncs **active products** (`isActive: true`)
- Sends minimal data (no full variant arrays)
- Uses 30-second timeout
- Non-blocking operation

### Scalability
- For large catalogs (1000+ products), consider:
  - Debouncing multiple rapid updates
  - Batch sync with queue system
  - Differential sync (only changed products)

## Benefits

### For Admins
- ✅ No manual work required
- ✅ Always up-to-date recommendations
- ✅ Instant product availability in chatbot
- ✅ Manual sync option for troubleshooting

### For Customers
- ✅ Chatbot recommends latest products
- ✅ Accurate product information
- ✅ Better shopping experience
- ✅ No stale recommendations

## Troubleshooting

### Sync Not Working?

1. **Check Python AI Service**
   ```bash
   curl http://localhost:8000/health
   ```

2. **Check Server Logs**
   ```
   ❌ Error syncing products to AI: ECONNREFUSED
   ```
   → AI service is not running

3. **Manual Sync Test**
   ```bash
   curl -X POST http://localhost:4000/api/admin/chatbot/sync
   ```

4. **Verify Database**
   ```sql
   SELECT COUNT(*) FROM "Product" WHERE "isActive" = true;
   ```

## Future Enhancements

- [ ] Sync only changed products (differential sync)
- [ ] Sync queue with retry mechanism
- [ ] Webhook notifications to AI service
- [ ] Sync status dashboard in admin panel
- [ ] Sync history and logs
- [ ] Batch sync scheduling (e.g., every hour)

---

**Status**: ✅ Implemented and Running
**Last Updated**: January 5, 2026
