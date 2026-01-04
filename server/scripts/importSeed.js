const fs = require('fs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function importSeed() {
  try {
    console.log('📦 Reading seed data file...');
    const sql = fs.readFileSync('./scripts/seed_data_final.sql', 'utf8');
    
    console.log('🔄 Splitting SQL statements...');
    // Remove BEGIN/COMMIT and split by semicolons, filter out empty lines
    const statements = sql
      .replace(/BEGIN;/gi, '')
      .replace(/COMMIT;/gi, '')
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    console.log(`📝 Found ${statements.length} SQL statements`);
    console.log('🔄 Importing data into database...');
    
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < statements.length; i++) {
      try {
        await prisma.$executeRawUnsafe(statements[i]);
        successCount++;
        if ((i + 1) % 50 === 0) {
          console.log(`   Processed ${i + 1}/${statements.length} statements...`);
        }
      } catch (error) {
        errorCount++;
        if (error.message.includes('duplicate key') || error.message.includes('already exists')) {
          // Ignore duplicate key errors (data already exists)
        } else {
          console.warn(`   Warning on statement ${i + 1}: ${error.message}`);
          if (i < 5) {
            console.log(`   Statement: ${statements[i].substring(0, 150)}...`);
          }
        }
      }
    }
    
    console.log(`\n✅ Import completed!`);
    console.log(`   ✓ Successful: ${successCount}`);
    console.log(`   ⚠ Skipped/Errors: ${errorCount}`);
    
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error importing seed data:', error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
}

importSeed();
