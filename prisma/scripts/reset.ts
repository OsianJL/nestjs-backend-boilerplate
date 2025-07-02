// prisma/reset.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Resetting userProfile and user tables...');
  await prisma.userProfile.deleteMany();
  await prisma.user.deleteMany();
  console.log('✅ All user profiles and users deleted');
}

main()
  .catch((e) => {
    console.error('❌ Error resetting database:', e);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
