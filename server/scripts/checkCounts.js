const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkCounts() {
  try {
    const productCount = await prisma.product.count();
    const variantCount = await prisma.productVariant.count();
    const categoryCount = await prisma.category.count();
    
    console.log('📊 Database counts:');
    console.log(`  ✅ Categories: ${categoryCount}`);
    console.log(`  ✅ Products: ${productCount}`);
    console.log(`  ✅ Variants: ${variantCount}`);
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('Error:', error.message);
    await prisma.$disconnect();
  }
}

checkCounts();
