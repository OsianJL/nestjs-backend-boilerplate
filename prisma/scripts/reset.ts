// prisma/reset.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Resetting users table...');
  await prisma.user.deleteMany();
  console.log('✅ All users deleted');
}

main()
  .catch((e) => {
    console.error('❌ Error resetting database:', e);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
