const { PrismaClient, Role } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Proper password hashing using bcrypt
async function hashPassword(password: string): Promise<string> {
  // Generate a salt with cost factor 10
  const salt = await bcrypt.genSalt(10);
  // Hash the password with the generated salt
  return bcrypt.hash(password, salt);
}

async function main() {
  // Clean existing data
  await prisma.ride.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding database...');

  // Create users
  const driver1 = await prisma.user.create({
    data: {
      email: 'driver1@example.com',
      name: 'John Driver',
      password: await hashPassword('password123'),
      role: Role.DRIVER,
    },
  });

  const driver2 = await prisma.user.create({
    data: {
      email: 'driver2@example.com',
      name: 'Jane Driver',
      password: await hashPassword('password123'),
      role: Role.DRIVER,
    },
  });

  const passenger1 = await prisma.user.create({
    data: {
      email: 'passenger1@example.com',
      name: 'Bob Passenger',
      password: await hashPassword('password123'),
      role: Role.PASSENGER,
    },
  });

  const passenger2 = await prisma.user.create({
    data: {
      email: 'passenger2@example.com',
      name: 'Alice Passenger',
      password: await hashPassword('password123'),
      role: Role.PASSENGER,
    },
  });

  console.log('Created users');

  // Create vehicles
  const car1 = await prisma.vehicle.create({
    data: {
      userId: driver1.id,
      name: 'Tesla Model 3',
      image: '/images/vehicles/tesla-model-3.jpg',
      type: 'Electric Car',
      available: true,
    },
  });

  const car2 = await prisma.vehicle.create({
    data: {
      userId: driver1.id,
      name: 'Toyota Prius',
      image: '/images/vehicles/toyota-prius.jpg',
      type: 'Hybrid Car',
      available: true,
    },
  });

  const car3 = await prisma.vehicle.create({
    data: {
      userId: driver2.id,
      name: 'Ford Mustang',
      image: '/images/vehicles/ford-mustang.jpg',
      type: 'Sports Car',
      available: true,
    },
  });

  console.log('Created vehicles');

  // Create rides
  const ride1 = await prisma.ride.create({
    data: {
      userId: passenger1.id,
      vehicleId: car1.id,
      status: 'pending',
    },
  });

  const ride2 = await prisma.ride.create({
    data: {
      userId: passenger1.id,
      vehicleId: car3.id,
      status: 'accepted',
    },
  });

  const ride3 = await prisma.ride.create({
    data: {
      userId: passenger2.id,
      vehicleId: car2.id,
      status: 'completed',
    },
  });

  console.log('Created rides');

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
