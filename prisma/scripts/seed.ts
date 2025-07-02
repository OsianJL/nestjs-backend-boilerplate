// prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding users...');

  const password = await bcrypt.hash('adminpass', 10);

  // Crea usuario admin con perfil
  await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password,
      isAdmin: true,
      provider: 'EMAIL',
      userRole: 'admin',
      isVerified: true,
      userProfile: {
        create: {
          userName: 'admin',
          firstName: 'Admin',
          lastName: 'User',
          phone: '123456789',
          country: 'Adminland',
          language: 'es',
          timezone: 'UTC',
          bio: 'Administrador principal',
          receiveNotifications: true,
          showEmail: true,
        },
      },
    },
  });

  // Crea 5 usuarios normales con perfil
  for (let i = 1; i <= 5; i++) {
    await prisma.user.create({
      data: {
        email: `user${i}@example.com`,
        password: await bcrypt.hash(`userpass${i}`, 10),
        provider: 'EMAIL',
        userRole: 'user',
        isVerified: i % 2 === 0, // Algunos usuarios verificados y otros no
        userProfile: {
          create: {
            userName: `user${i}`,
            firstName: `User${i}`,
            lastName: `Test${i}`,
            phone: `555000${i}`,
            country: 'Testland',
            language: 'es',
            timezone: 'UTC+1',
            bio: `Usuario de prueba ${i}`,
            receiveNotifications: true,
            showEmail: false,
          },
        },
      },
    });
  }

  // Crea un moderador
  await prisma.user.create({
    data: {
      email: 'moderator@example.com',
      password: await bcrypt.hash('moderatorpass', 10),
      provider: 'EMAIL',
      userRole: 'moderator',
      isVerified: true,
      userProfile: {
        create: {
          userName: 'moderator',
          firstName: 'Moderator',
          lastName: 'User',
          phone: '987654321',
          country: 'Modland',
          language: 'es',
          timezone: 'UTC',
          bio: 'Moderador del sistema',
          receiveNotifications: true,
          showEmail: true,
        },
      },
    },
  });

  console.log('✅ Done!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
