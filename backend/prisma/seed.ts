import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding RateHub database...');

  // Clean existing data
  await prisma.rating.deleteMany();
  await prisma.store.deleteMany();
  await prisma.passwordResetToken.deleteMany();
  await prisma.user.deleteMany();

  const salt = await bcrypt.genSalt(10);

  // 1. System Admin
  const adminPasswordHash = await bcrypt.hash('AdminPassword123!', salt);
  const admin = await prisma.user.create({
    data: {
      name: 'System Administrator Account',
      email: 'admin@ratehub.com',
      passwordHash: adminPasswordHash,
      address: '742 Evergreen Terrace, Sector 4, Silicon Hub',
      role: Role.SYSTEM_ADMIN,
    },
  });

  // 2. Store Owner
  const ownerPasswordHash = await bcrypt.hash('OwnerPassword123!', salt);
  const owner = await prisma.user.create({
    data: {
      name: 'Jonathan Storekeeper Miller',
      email: 'owner@brewnbloom.com',
      passwordHash: ownerPasswordHash,
      address: '100 Market Street, Downtown Arts District',
      role: Role.STORE_OWNER,
    },
  });

  // 3. Normal User
  const userPasswordHash = await bcrypt.hash('UserPassword123!', salt);
  const user = await prisma.user.create({
    data: {
      name: 'Regular Customer Jackson',
      email: 'user@example.com',
      passwordHash: userPasswordHash,
      address: '45 North Avenue, Apartment 12B, Central City',
      role: Role.NORMAL_USER,
    },
  });

  // 4. Sample Stores
  const store1 = await prisma.store.create({
    data: {
      name: 'Brew & Bloom Specialty Cafe',
      email: 'contact@brewnbloom.com',
      address: '100 Market Street, Downtown Arts District',
      ownerId: owner.id,
    },
  });

  const store2 = await prisma.store.create({
    data: {
      name: 'Artisan Boutique Apparel',
      email: 'shop@artisanboutique.com',
      address: '250 Fashion Boulevard, Suite 101',
      ownerId: owner.id,
    },
  });

  // 5. Sample Ratings
  await prisma.rating.create({
    data: {
      value: 5,
      userId: user.id,
      storeId: store1.id,
    },
  });

  await prisma.rating.create({
    data: {
      value: 4,
      userId: user.id,
      storeId: store2.id,
    },
  });

  console.log('✅ Seeding complete!');
  console.log('----------------------------------------------------');
  console.log('Admin Account:       admin@ratehub.com / AdminPassword123!');
  console.log('Store Owner Account: owner@brewnbloom.com / OwnerPassword123!');
  console.log('Normal User Account: user@example.com / UserPassword123!');
  console.log('----------------------------------------------------');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
