const { PrismaClient, Role, RideStatus } = require('@prisma/client');
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
  await prisma.review.deleteMany();
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
      make: 'Tesla',
      model: 'Model 3',
      year: 2023,
      licensePlate: 'EV-123',
      capacity: 5,
      description: 'Comfortable electric sedan with autopilot features and long range battery.',
      imageUrl: '/images/vehicles/tesla-model-3.jpg',
      vehicleType: 'SEDAN',
      available: true,
    },
  });

  const car2 = await prisma.vehicle.create({
    data: {
      userId: driver1.id,
      make: 'Toyota',
      model: 'Prius',
      year: 2022,
      licensePlate: 'HB-456',
      capacity: 4,
      description: 'Fuel-efficient hybrid vehicle with spacious interior and excellent mileage.',
      imageUrl: '/images/vehicles/toyota-prius.jpg',
      vehicleType: 'HATCHBACK',
      available: true,
    },
  });

  const car3 = await prisma.vehicle.create({
    data: {
      userId: driver2.id,
      make: 'Ford',
      model: 'Mustang',
      year: 2021,
      licensePlate: 'SP-789',
      capacity: 2,
      description: 'Powerful sports car with V8 engine and premium sound system. Perfect for quick trips.',
      imageUrl: '/images/vehicles/ford-mustang.jpg',
      vehicleType: 'SEDAN',
      available: true,
    },
  });

  console.log('Created vehicles');

  // Create rides
  const ride1 = await prisma.ride.create({
    data: {
      userId: passenger1.id,
      vehicleId: car1.id,
      status: RideStatus.REQUESTED,
      pickupLocation: '123 Main St, Anytown',
      dropoffLocation: '456 Oak Ave, Anytown',
      pickupTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      price: 25.50,
      notes: 'Please call when you arrive',
    },
  });

  const ride2 = await prisma.ride.create({
    data: {
      userId: passenger1.id,
      vehicleId: car3.id,
      status: RideStatus.ACCEPTED,
      pickupLocation: '789 Pine Rd, Anytown',
      dropoffLocation: '101 River Dr, Othertown',
      pickupTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
      price: 42.75,
      notes: 'I have luggage',
    },
  });

  const ride3 = await prisma.ride.create({
    data: {
      userId: passenger2.id,
      vehicleId: car2.id,
      status: RideStatus.COMPLETED,
      pickupLocation: '202 Mountain View, Othertown',
      dropoffLocation: '303 Beach Blvd, Coastville',
      pickupTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 2 hours after pickup
      price: 35.00,
    },
  });

  // Create a review for the completed ride
  const review1 = await prisma.review.create({
    data: {
      userId: passenger2.id,
      rideId: ride3.id,
      rating: 5,
      comment: 'Great driver, very punctual and friendly!',
    },
  });

  console.log('Created rides and reviews');

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
