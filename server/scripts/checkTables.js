const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkTables() {
  try {
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema='public' 
      AND table_type='BASE TABLE' 
      ORDER BY table_name
    `;
    
    console.log('📋 Tables in database:');
    tables.forEach(t => console.log(`  - ${t.table_name}`));
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('Error:', error.message);
    await prisma.$disconnect();
  }
}

checkTables();
