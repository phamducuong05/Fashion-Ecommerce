const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function sampleData() {
  try {
    const products = await prisma.product.findMany({
      take: 5,
      include: {
        variants: {
          take: 2
        },
        categories: true
      }
    });
    
    console.log('📦 Sample products:\n');
    products.forEach(p => {
      console.log(`🏷️  ${p.name} (ID: ${p.id})`);
      console.log(`   💰 Price: $${p.price} (was $${p.originalPrice})`);
      console.log(`   ⭐ Rating: ${p.rating} (${p.reviewCount} reviews)`);
      console.log(`   🎨 Variants: ${p.variants.length > 0 ? p.variants.map(v => `${v.color}-${v.size}`).join(', ') : 'None'}`);
      console.log(`   📁 Categories: ${p.categories.map(c => c.name).join(', ')}\n`);
    });
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('Error:', error.message);
    await prisma.$disconnect();
  }
}

sampleData();
