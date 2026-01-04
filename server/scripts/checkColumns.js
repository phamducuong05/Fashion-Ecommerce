const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkColumns() {
  try {
    const columns = await prisma.$queryRaw`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema='public' 
      AND table_name='Category'
      ORDER BY ordinal_position
    `;
    
    console.log('📋 Columns in Category table:');
    columns.forEach(c => console.log(`  - ${c.column_name} (${c.data_type})`));
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('Error:', error.message);
    await prisma.$disconnect();
  }
}

checkColumns();
