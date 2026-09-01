import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding RateHub database with rich live data...');

  // Clean existing records
  await prisma.rating.deleteMany();
  await prisma.store.deleteMany();
  await prisma.passwordResetToken.deleteMany();
  await prisma.user.deleteMany();

  const salt = await bcrypt.genSalt(10);

  // 1. System Administrator
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

  // 2. Store Owners
  const owner1Password = await bcrypt.hash('OwnerPassword123!', salt);
  const owner1 = await prisma.user.create({
    data: {
      name: 'Jonathan Storekeeper Miller',
      email: 'owner@brewnbloom.com',
      passwordHash: owner1Password,
      address: '100 Market Street, Downtown Arts District',
      role: Role.STORE_OWNER,
    },
  });

  const owner2Password = await bcrypt.hash('OwnerPassword123!', salt);
  const owner2 = await prisma.user.create({
    data: {
      name: 'Elena Vance Sterling',
      email: 'owner@urbanroast.com',
      passwordHash: owner2Password,
      address: '88 Fashion Boulevard, Suite 300, Midtown',
      role: Role.STORE_OWNER,
    },
  });

  const owner3Password = await bcrypt.hash('OwnerPassword123!', salt);
  const owner3 = await prisma.user.create({
    data: {
      name: 'Marcus Aurelius Bennett',
      email: 'owner@thebooknook.com',
      passwordHash: owner3Password,
      address: '52 University Avenue, Academic District',
      role: Role.STORE_OWNER,
    },
  });

  // 3. Normal Users
  const userPassword = await bcrypt.hash('UserPassword123!', salt);

  const user1 = await prisma.user.create({
    data: {
      name: 'Regular Customer Jackson',
      email: 'user@example.com',
      passwordHash: userPassword,
      address: '45 North Avenue, Apartment 12B, Central City',
      role: Role.NORMAL_USER,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Sophia Isabella Ramirez',
      email: 'sophia@example.com',
      passwordHash: userPassword,
      address: '128 Sunset Hills Parkway, Westside',
      role: Role.NORMAL_USER,
    },
  });

  const user3 = await prisma.user.create({
    data: {
      name: 'Daniel Alexander Hayes',
      email: 'daniel@example.com',
      passwordHash: userPassword,
      address: '900 Metro Station Plaza, North District',
      role: Role.NORMAL_USER,
    },
  });

  const user4 = await prisma.user.create({
    data: {
      name: 'Olivia Grace Montgomery',
      email: 'olivia@example.com',
      passwordHash: userPassword,
      address: '312 Beacon Street, Old Harbor Area',
      role: Role.NORMAL_USER,
    },
  });

  // 4. Stores
  const store1 = await prisma.store.create({
    data: {
      name: 'Brew & Bloom Specialty Cafe',
      email: 'contact@brewnbloom.com',
      address: '100 Market Street, Downtown Arts District',
      ownerId: owner1.id,
    },
  });

  const store2 = await prisma.store.create({
    data: {
      name: 'Artisan Boutique Apparel',
      email: 'shop@artisanboutique.com',
      address: '250 Fashion Boulevard, Suite 101',
      ownerId: owner1.id,
    },
  });

  const store3 = await prisma.store.create({
    data: {
      name: 'Urban Roast Coffee Lab',
      email: 'hello@urbanroast.com',
      address: '88 Grand Avenue, Innovation Sector',
      ownerId: owner2.id,
    },
  });

  const store4 = await prisma.store.create({
    data: {
      name: 'The Book & Brew Corner',
      email: 'books@thebooknook.com',
      address: '52 University Avenue, Academic District',
      ownerId: owner3.id,
    },
  });

  const store5 = await prisma.store.create({
    data: {
      name: 'Green Leaf Organic Market',
      email: 'info@greenleafmarket.com',
      address: '410 Maplewood Road, Valley Green',
      ownerId: owner2.id,
    },
  });

  const store6 = await prisma.store.create({
    data: {
      name: 'Apex Athletics & Fitness Hub',
      email: 'service@apexathletics.com',
      address: '67 Stadium Boulevard, Sportland',
      ownerId: owner3.id,
    },
  });

  // 5. Ratings
  const ratingsData = [
    { userId: user1.id, storeId: store1.id, value: 5 },
    { userId: user2.id, storeId: store1.id, value: 5 },
    { userId: user3.id, storeId: store1.id, value: 4 },

    { userId: user1.id, storeId: store2.id, value: 4 },
    { userId: user3.id, storeId: store2.id, value: 5 },

    { userId: user2.id, storeId: store3.id, value: 5 },
    { userId: user4.id, storeId: store3.id, value: 4 },

    { userId: user1.id, storeId: store4.id, value: 5 },
    { userId: user2.id, storeId: store4.id, value: 5 },
    { userId: user3.id, storeId: store4.id, value: 4 },
    { userId: user4.id, storeId: store4.id, value: 5 },

    { userId: user3.id, storeId: store5.id, value: 4 },
    { userId: user4.id, storeId: store5.id, value: 4 },

    { userId: user2.id, storeId: store6.id, value: 5 },
  ];

  for (const r of ratingsData) {
    await prisma.rating.create({
      data: r,
    });
  }

  console.log('✅ Database seeded successfully with real multi-role data!');
  console.log('------------------------------------------------------------');
  console.log('Admin Account:        admin@ratehub.com       / AdminPassword123!');
  console.log('Store Owner 1:        owner@brewnbloom.com    / OwnerPassword123!');
  console.log('Store Owner 2:        owner@urbanroast.com    / OwnerPassword123!');
  console.log('Normal User 1:        user@example.com        / UserPassword123!');
  console.log('Normal User 2:        sophia@example.com      / UserPassword123!');
  console.log('------------------------------------------------------------');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
