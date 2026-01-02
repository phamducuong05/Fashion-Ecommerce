import fs from 'fs';
import path from 'path';
import prisma from '../../utils/prisma';

const dataDir = path.join(__dirname, '../../data');

function readJson<T>(filename: string): T {
  const p = path.join(dataDir, filename);
  const raw = fs.readFileSync(p, 'utf-8');
  return JSON.parse(raw) as T;
}

/**
 * Map database OrderStatus to frontend-compatible status
 * Database: PENDING, CONFIRMED, SHIPPING, COMPLETED, CANCELLED, RETURNED
 * Frontend: pending, delivered, cancelled
 * 
 * Mapping logic:
 * - PENDING, CONFIRMED, SHIPPING → 'pending' (orders that need action/are in progress)
 * - COMPLETED → 'delivered'
 * - CANCELLED, RETURNED → 'cancelled'
 */
function mapOrderStatus(dbStatus: string): 'pending' | 'delivered' | 'cancelled' {
  const status = (dbStatus || '').toUpperCase();
  switch (status) {
    case 'COMPLETED':
      return 'delivered';
    case 'CANCELLED':
    case 'RETURNED':
      return 'cancelled';
    case 'PENDING':
    case 'CONFIRMED':
    case 'SHIPPING':
    default:
      return 'pending';
  }
}

// Check if database is available
function isDatabaseAvailable(): boolean {
  return !!process.env.DATABASE_URL;
}

export class DataService {
  // Products
  static async getProducts() {
    if (isDatabaseAvailable()) {
      const rows = await prisma.product.findMany({ include: { variants: true, categories: true } });

      // Normalize product shape for admin UI
      return rows.map((p: any) => {
        const priceNum = Number(p.price || 0);
        const variants = (p.variants || []).map((v: any) => ({
          id: v.id,
          productId: v.productId,
          color: v.color,
          size: v.size,
          sku: v.sku,
          image: v.image,
          stock: v.stock,
        }));

        const totalStock = variants.reduce((s: number, v: any) => s + (Number(v.stock) || 0), 0);

        // Group variants into UI-friendly variants: by size -> colors
        const uiVariants: any[] = [];
        const mapBySize: Record<string, { size: string; colors: string[]; imageUrl: string } > = {};
        for (const v of variants) {
          if (!mapBySize[v.size]) mapBySize[v.size] = { size: v.size, colors: [], imageUrl: v.image || '' };
          if (v.color && !mapBySize[v.size].colors.includes(v.color)) mapBySize[v.size].colors.push(v.color);
        }
        for (const k of Object.keys(mapBySize)) uiVariants.push(mapBySize[k]);

        return {
          id: p.id,
          name: p.name,
          category: (p.categories && p.categories[0] && p.categories[0].name) || 'Uncategorized',
          price: Number(priceNum),
          stock: Number(totalStock),
          image: p.thumbnail || (variants[0] && variants[0].image) || '',
          status: totalStock > 0 ? 'available' : 'sold-out',
          variants: uiVariants,
        };
      });
    }
    return readJson<any[]>('product.json');
  }

  static async getProductById(id: number) {
    if (isDatabaseAvailable()) {
      const p = await (prisma as any).product.findUnique({ 
        where: { id }, 
        include: { variants: true, categories: true } 
      });
      
      if (!p) return null;
      
      // Format for UI (same as getProducts)
      const variants = (p.variants || []).map((v: any) => ({
        id: v.id,
        productId: v.productId,
        color: v.color,
        size: v.size,
        sku: v.sku,
        image: v.image,
        stock: v.stock,
      }));

      const totalStock = variants.reduce((s: number, v: any) => s + (Number(v.stock) || 0), 0);

      // Group variants into UI-friendly format: by size -> colors
      const mapBySize: Record<string, { size: string; colors: string[]; imageUrl: string }> = {};
      for (const v of variants) {
        if (!mapBySize[v.size]) mapBySize[v.size] = { size: v.size, colors: [], imageUrl: v.image || '' };
        if (v.color && !mapBySize[v.size].colors.includes(v.color)) mapBySize[v.size].colors.push(v.color);
      }
      const uiVariants = Object.values(mapBySize);

      return {
        id: p.id,
        name: p.name,
        category: (p.categories && p.categories[0] && p.categories[0].name) || 'Uncategorized',
        price: Number(p.price || 0),
        stock: Number(totalStock),
        image: p.thumbnail || (variants[0] && variants[0].image) || '',
        status: totalStock > 0 ? 'available' : 'sold-out',
        variants: uiVariants,
      };
    }
    const products = readJson<any[]>('product.json');
    return products.find((p) => p.id === id || p.id === String(id));
  }

  // Customers / Users
  static async getCustomers() {
    if (isDatabaseAvailable()) {
      const users = await prisma.user.findMany({
        include: {
          orders: {
            include: {
              orderItems: {
                include: {
                  variant: {
                    include: {
                      product: { include: { categories: true } }
                    }
                  }
                }
              }
            }
          }
        }
      });

      // Normalize to frontend Customer shape
      return users.map((u: any) => {
        const orders = (u.orders || []).map((o: any) => ({
          id: String(o.id),
          date: o.createdAt,
          total: Number(o.finalAmount || o.totalAmount || 0),
          status: mapOrderStatus(o.status),
          items: (o.orderItems || []).map((it: any) => ({
            productName: it.variant?.product?.name || 'Unknown',
            category: (it.variant?.product?.categories && it.variant.product.categories[0] && it.variant.product.categories[0].name) || 'Uncategorized',
            quantity: it.quantity,
            price: Number(it.price || 0),
            size: it.variant?.size || '',
            color: it.variant?.color || '',
            imageUrl: it.variant?.image || ''
          }))
        }));

        const totalSpent = orders.reduce((s: number, o: any) => s + Number(o.total || 0), 0);

        return {
          id: u.id,
          name: u.name || u.email,
          email: u.email,
          orders,
          totalSpent,
          joinDate: u.createdAt,
        };
      });
    }
    return readJson<any[]>('customer.json');
  }

  // Orders
  static async getOrders() {
    if (isDatabaseAvailable()) {
      const rows = await prisma.order.findMany({ include: { orderItems: { include: { variant: { include: { product: { include: { categories: true } } } } } }, user: true } });

      return rows.map((o: any) => ({
        id: String(o.id),
        date: o.createdAt,
        total: Number(o.finalAmount || o.totalAmount || 0),
        status: mapOrderStatus(o.status),
        customerName: o.user?.name || o.user?.email || 'Customer',
        customerEmail: o.user?.email || '',
        shippingAddress: o.shippingAddress,
        items: (o.orderItems || []).map((it: any) => ({
          productName: it.variant?.product?.name || 'Unknown',
          category: (it.variant?.product?.categories && it.variant.product.categories[0] && it.variant.product.categories[0].name) || 'Uncategorized',
          quantity: it.quantity,
          price: Number(it.price || 0),
          size: it.variant?.size || '',
          color: it.variant?.color || '',
          imageUrl: it.variant?.image || ''
        }))
      }));
    }
    return readJson<any[]>('order.json');
  }

  static async getOrderById(id: string) {
    if (isDatabaseAvailable()) {
      return prisma.order.findUnique({ where: { id: Number(id) }, include: { orderItems: true, user: true } });
    }
    const orders = readJson<any[]>('order.json');
    return orders.find((o) => o.id === id);
  }

  // Update order status
  static async updateOrderStatus(id: string, status: string) {
    // Map lowercase status to database enum values
    const statusMap: Record<string, string> = {
      'pending': 'PENDING',
      'confirmed': 'CONFIRMED',
      'shipping': 'SHIPPING',
      'delivered': 'COMPLETED',
      'completed': 'COMPLETED',
      'cancelled': 'CANCELLED',
      'returned': 'RETURNED',
    };

    const dbStatus = statusMap[status.toLowerCase()];
    if (!dbStatus) {
      throw new Error(`Invalid status: ${status}`);
    }

    if (isDatabaseAvailable()) {
      return prisma.order.update({
        where: { id: Number(id) },
        data: { status: dbStatus as any },
        include: { orderItems: true, user: true }
      });
    }
    
    // For JSON fallback (no actual update, just return the order)
    const orders = readJson<any[]>('order.json');
    const order = orders.find((o) => o.id === id);
    if (order) {
      order.status = dbStatus;
    }
    return order;
  }

  // Promotions / vouchers
  static async getPromotions() {
    if (isDatabaseAvailable()) {
      return prisma.voucher.findMany();
    }
    return readJson<any>('promotion.json');
  }

  // Dashboard - return aggregate-like JSON (from file if no DB)
  static async getDashboard() {
    if (isDatabaseAvailable()) {
      // Dashboard: counts, revenue trends, category distribution and top products
      
      // Only count revenue from non-cancelled/returned orders
      const totalRevenueResult = await prisma.order.aggregate({
        where: { status: { notIn: ['CANCELLED', 'RETURNED'] } },
        _sum: { finalAmount: true },
      });
      const totalRevenue = Number(totalRevenueResult._sum.finalAmount || 0);
      const totalOrders = await prisma.order.count();
      const totalCustomers = await prisma.user.count({ where: { role: 'CUSTOMER' } });

      // Calculate best selling products from actual OrderItems (not the Product.sold field)
      // Group by product and sum quantities from orders that are not cancelled/returned
      const orderItems = await prisma.orderItem.findMany({
        where: {
          order: { status: { notIn: ['CANCELLED', 'RETURNED'] } }
        },
        include: {
          variant: {
            include: {
              product: true
            }
          }
        }
      });

      // Aggregate sales by product
      const productSalesMap: Record<number, { product: any; totalQty: number; totalRevenue: number }> = {};
      for (const item of orderItems) {
        const product = item.variant?.product;
        if (!product) continue;
        
        const productId = product.id;
        const qty = item.quantity || 0;
        const itemRevenue = Number(item.price || 0) * qty;

        if (!productSalesMap[productId]) {
          productSalesMap[productId] = { product, totalQty: 0, totalRevenue: 0 };
        }
        productSalesMap[productId].totalQty += qty;
        productSalesMap[productId].totalRevenue += itemRevenue;
      }

      // Sort by quantity sold and take top 5
      const sortedProducts = Object.values(productSalesMap)
        .sort((a, b) => b.totalQty - a.totalQty)
        .slice(0, 5);

      const bestSellingProducts = sortedProducts.map((entry) => ({
        id: entry.product.id,
        name: entry.product.name,
        sales: entry.totalQty,
        revenue: entry.totalRevenue,
        trend: 'up',
        change: 0,
      }));

      // Build a simple revenue series for the last 7 days (exclude cancelled/returned orders)
      const today = new Date();
      const revenueData: { name: string; revenue: number }[] = [];
      for (let i = 6; i >= 0; i--) {
        const day = new Date(today);
        day.setDate(today.getDate() - i);
        const start = new Date(day);
        start.setHours(0, 0, 0, 0);
        const end = new Date(day);
        end.setHours(23, 59, 59, 999);

        const sumRes = await prisma.order.aggregate({
          where: { 
            createdAt: { gte: start, lte: end },
            status: { notIn: ['CANCELLED', 'RETURNED'] }
          },
          _sum: { finalAmount: true },
        });

        revenueData.push({ name: start.toISOString().slice(0, 10), revenue: Number(sumRes._sum.finalAmount || 0) });
      }

      // Category distribution - count sold items per category (not just product count)
      const categories = await prisma.category.findMany({ include: { products: true } });
      
      // Calculate actual sales per category from order items
      const categorySalesMap: Record<string, number> = {};
      for (const item of orderItems) {
        const product = item.variant?.product;
        if (!product) continue;
        
        // Find categories for this product
        const productWithCats = await prisma.product.findUnique({
          where: { id: product.id },
          include: { categories: true }
        });
        
        for (const cat of (productWithCats?.categories || [])) {
          categorySalesMap[cat.name] = (categorySalesMap[cat.name] || 0) + (item.quantity || 0);
        }
      }

      const categoryData = categories.map((c: any) => ({ 
        name: c.name, 
        value: categorySalesMap[c.name] || 0 
      })).filter((c: any) => c.value > 0); // Only show categories with sales

      // Build stats with change/trend placeholders (frontend expects these fields)
      const stats = [
        {
          title: 'Total Revenue',
          value: totalRevenue,
          change: 0,
          trend: 'up',
        },
        {
          title: 'Total Orders',
          value: totalOrders,
          change: 0,
          trend: 'up',
        },
        {
          title: 'Total Customers',
          value: totalCustomers,
          change: 0,
          trend: 'up',
        },
      ];

      // Add a Conversion Rate stat (orders per customer * 100 as percentage)
      const conversionRate = totalCustomers > 0 ? (totalOrders / totalCustomers) * 100 : 0;
      stats.push({ title: 'Conversion Rate', value: Number(conversionRate.toFixed(1)), change: 0, trend: 'up' });

      return {
        stats,
        revenueData,
        categoryData,
        bestSellingProducts,
      };
    }
    return readJson<any>('dashboard.json');
  }

  // Chat / support messages - Now using ChatConversation with messages
  static async getChat() {
    if (isDatabaseAvailable()) {
      // Fetch chat conversations with user info and messages
      const conversations = await (prisma as any).chatConversation.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            }
          },
          messages: {
            orderBy: {
              createdAt: 'asc'
            }
          }
        },
        orderBy: {
          updatedAt: 'desc'
        }
      });

      // Format for frontend Chat interface
      return conversations.map((conv: any) => {
        const lastMessage = conv.messages[conv.messages.length - 1];
        return {
          id: conv.id,
          customerName: conv.user?.name || 'Unknown Customer',
          customerEmail: conv.user?.email || '',
          avatar: conv.user?.avatar || '',
          lastMessage: lastMessage?.content || '',
          unread: conv.unreadCount || 0,
          lastActive: lastMessage?.createdAt || conv.updatedAt,
          status: conv.status,
          messages: conv.messages.map((msg: any) => ({
            id: msg.id,
            sender: msg.sender === 'ADMIN' ? 'admin' : 'customer',
            text: msg.content,
            timestamp: msg.createdAt,
            isRead: msg.isRead,
          }))
        };
      });
    }
    return readJson<any[]>('chat.json');
  }
}
