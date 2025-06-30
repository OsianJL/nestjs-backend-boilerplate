// prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding users...');

  const password = await bcrypt.hash('adminpass', 10);

  await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password,
      isAdmin: true,
      username: 'admin',
      provider: 'EMAIL',
    },
  });

  for (let i = 1; i <= 5; i++) {
    await prisma.user.create({
      data: {
        email: `user${i}@example.com`,
        password: await bcrypt.hash(`userpass${i}`, 10),
        username: `user${i}`,
        provider: 'EMAIL',
      },
    });
  }

  console.log('✅ Done!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
