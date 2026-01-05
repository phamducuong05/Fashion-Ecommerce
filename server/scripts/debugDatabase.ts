/**
 * Debug script to check database data vs what backend returns
 * Run with: npx ts-node scripts/debugDatabase.ts
 */

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function debugDatabase() {
  console.log('\n========================================');
  console.log('🔍 DATABASE DEBUG REPORT');
  console.log('========================================\n');

  // 1. Check Orders
  console.log('📦 ORDERS CHECK:');
  console.log('----------------------------------------');
  const allOrders = await prisma.order.findMany({
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: true
            }
          }
        }
      },
      user: true
    }
  });

  console.log(`Total orders in DB: ${allOrders.length}`);
  
  // Group by status
  const statusCount: Record<string, number> = {};
  for (const order of allOrders) {
    const status = order.status;
    statusCount[status] = (statusCount[status] || 0) + 1;
  }
  console.log('Orders by status:', statusCount);
  
  console.log('\nOrder details:');
  for (const order of allOrders) {
    console.log(`  - Order #${order.id}: status=${order.status}, items=${order.items.length}, total=${order.finalAmount}, user=${order.user?.email || 'N/A'}`);
  }

  // 2. Check Products
  console.log('\n📦 PRODUCTS CHECK:');
  console.log('----------------------------------------');
  const allProducts = await prisma.product.findMany({
    include: {
      variants: true,
      categories: true
    }
  });

  console.log(`Total products in DB: ${allProducts.length}`);
  
  console.log('\nProduct details with sold count:');
  for (const product of allProducts) {
    const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
    console.log(`  - ${product.name}: sold=${product.sold}, stock=${totalStock}, price=${product.price}, rating=${product.rating}`);
  }

  // 3. Check Best Selling (what dashboard should show)
  console.log('\n🏆 BEST SELLING PRODUCTS (top 5 by sold):');
  console.log('----------------------------------------');
  const bestSelling = await prisma.product.findMany({
    take: 5,
    orderBy: { sold: 'desc' }
  });

  for (const product of bestSelling) {
    const priceNum = Number(product.price || 0);
    const soldNum = Number(product.sold || 0);
    const revenue = soldNum * priceNum;
    console.log(`  - ${product.name}: sold=${soldNum}, price=${priceNum}, revenue=${revenue}`);
  }

  // 4. Check Revenue calculation
  console.log('\n💰 REVENUE CHECK:');
  console.log('----------------------------------------');
  const revenueResult = await prisma.order.aggregate({
    _sum: { finalAmount: true }
  });
  console.log(`Total revenue (sum of finalAmount): ${revenueResult._sum.finalAmount}`);

  // Revenue by status
  for (const status of ['DELIVERED', 'SHIPPED', 'PROCESSING', 'PENDING', 'CANCELLED']) {
    const statusRevenue = await prisma.order.aggregate({
      where: { status: status as any },
      _sum: { finalAmount: true }
    });
    console.log(`  Revenue for ${status}: ${statusRevenue._sum.finalAmount || 0}`);
  }

  // 5. Check last 7 days revenue (what graph shows)
  console.log('\n📊 LAST 7 DAYS REVENUE (for graph):');
  console.log('----------------------------------------');
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const day = new Date(today);
    day.setDate(today.getDate() - i);
    const start = new Date(day);
    start.setHours(0, 0, 0, 0);
    const end = new Date(day);
    end.setHours(23, 59, 59, 999);

    const dayOrders = await prisma.order.findMany({
      where: { createdAt: { gte: start, lte: end } }
    });
    
    const sumRes = await prisma.order.aggregate({
      where: { createdAt: { gte: start, lte: end } },
      _sum: { finalAmount: true }
    });

    console.log(`  ${start.toISOString().slice(0, 10)}: ${dayOrders.length} orders, revenue=${sumRes._sum.finalAmount || 0}`);
  }

  // 6. Check all order dates
  console.log('\n📅 ALL ORDER DATES:');
  console.log('----------------------------------------');
  for (const order of allOrders) {
    console.log(`  Order #${order.id}: createdAt=${order.createdAt.toISOString()}`);
  }

  // 7. Check Customers
  console.log('\n👥 CUSTOMERS CHECK:');
  console.log('----------------------------------------');
  const totalCustomers = await prisma.user.count();
  console.log(`Total users in DB: ${totalCustomers}`);

  // 8. Check Categories
  console.log('\n🏷️ CATEGORIES CHECK:');
  console.log('----------------------------------------');
  const categories = await prisma.category.findMany({
    include: { products: true }
  });
  for (const cat of categories) {
    console.log(`  - ${cat.name}: ${cat.products.length} products`);
  }

  // 9. Check OrderItems to verify they link correctly
  console.log('\n🔗 ORDER ITEMS CHECK:');
  console.log('----------------------------------------');
  const orderItems = await prisma.orderItem.findMany({
    include: {
      order: true,
      variant: {
        include: {
          product: true
        }
      }
    }
  });
  console.log(`Total order items: ${orderItems.length}`);
  for (const item of orderItems) {
    console.log(`  - OrderItem #${item.id}: Order #${item.orderId}, Product: ${item.variant?.product?.name || 'MISSING'}, qty=${item.quantity}`);
  }

  console.log('\n========================================');
  console.log('🔍 DEBUG COMPLETE');
  console.log('========================================\n');

  await prisma.$disconnect();
}

debugDatabase().catch((e) => {
  console.error('Error:', e);
  prisma.$disconnect();
  process.exit(1);
});
