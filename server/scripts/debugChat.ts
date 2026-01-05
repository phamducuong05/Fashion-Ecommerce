// Debug script to check chat data in database
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('=== Checking Chat Data in Database ===\n');

  // Check ChatConversation count
  const convCount = await prisma.chatConversation.count();
  console.log(`Total ChatConversations: ${convCount}`);

  // Check ChatMessage count
  const msgCount = await prisma.chatMessage.count();
  console.log(`Total ChatMessages: ${msgCount}`);

  // Get first conversation with messages
  const conv = await prisma.chatConversation.findFirst({
    include: {
      user: {
        select: { id: true, name: true, email: true }
      },
      messages: true
    }
  });

  console.log('\n=== First Conversation ===');
  console.log(JSON.stringify(conv, null, 2));

  // Get all users with name
  const usersWithName = await prisma.user.findMany({
    where: { name: { not: null } },
    take: 5,
    select: { id: true, name: true, email: true }
  });
  console.log('\n=== Sample Users with Name ===');
  console.log(JSON.stringify(usersWithName, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
