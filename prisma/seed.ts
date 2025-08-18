import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create sample users
  const manager = await prisma.user.upsert({
    where: { email: 'manager@example.com' },
    update: {},
    create: {
      email: 'manager@example.com',
      name: 'John Manager',
      role: 'MANAGER',
    },
  });

  const careWorker1 = await prisma.user.upsert({
    where: { email: 'worker1@example.com' },
    update: {},
    create: {
      email: 'worker1@example.com',
      name: 'Alice Worker',
      role: 'CARE_WORKER',
    },
  });

  const careWorker2 = await prisma.user.upsert({
    where: { email: 'worker2@example.com' },
    update: {},
    create: {
      email: 'worker2@example.com',
      name: 'Bob Worker',
      role: 'CARE_WORKER',
    },
  });

  // Create a sample location perimeter (London coordinates as example)
  const perimeter = await prisma.locationPerimeter.upsert({
    where: { id: 'sample-perimeter' },
    update: {},
    create: {
      id: 'sample-perimeter',
      name: 'Main Office',
      latitude: 51.5074,
      longitude: -0.1278,
      radius: 2.0, // 2km radius
      isActive: true,
    },
  });

  // Create some sample time entries
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

  // Completed time entry from yesterday
  await prisma.timeEntry.create({
    data: {
      userId: careWorker1.id,
      clockInTime: new Date(yesterday.getTime() + 9 * 60 * 60 * 1000), // 9 AM yesterday
      clockInLat: 51.5074,
      clockInLng: -0.1278,
      clockInNote: 'Starting morning shift',
      clockOutTime: new Date(yesterday.getTime() + 17 * 60 * 60 * 1000), // 5 PM yesterday
      clockOutLat: 51.5074,
      clockOutLng: -0.1278,
      clockOutNote: 'End of shift',
      totalHours: 8.0,
    },
  });

  // Completed time entry from two days ago
  await prisma.timeEntry.create({
    data: {
      userId: careWorker2.id,
      clockInTime: new Date(twoDaysAgo.getTime() + 8 * 60 * 60 * 1000), // 8 AM two days ago
      clockInLat: 51.5074,
      clockInLng: -0.1278,
      clockInNote: 'Early start today',
      clockOutTime: new Date(twoDaysAgo.getTime() + 16 * 60 * 60 * 1000), // 4 PM two days ago
      clockOutLat: 51.5074,
      clockOutLng: -0.1278,
      clockOutNote: 'Finished early',
      totalHours: 8.0,
    },
  });

  console.log('Database seeded successfully!');
  console.log('Created users:', { manager, careWorker1, careWorker2 });
  console.log('Created perimeter:', perimeter);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });