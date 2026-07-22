import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaClient, Role, Category } from '../src/generated/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Car Dealership Inventory Database...');

  // Create Admin User
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@dealership.com' },
    update: {},
    create: {
      name: 'Executive Admin',
      email: 'admin@dealership.com',
      password: adminPasswordHash,
      role: Role.ADMIN,
    },
  });
  console.log('Created Admin User:', admin.email);

  // Create Regular Customer
  const userPasswordHash = await bcrypt.hash('user123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'customer@gmail.com' },
    update: {},
    create: {
      name: 'John Doe',
      email: 'customer@gmail.com',
      password: userPasswordHash,
      role: Role.USER,
    },
  });
  console.log('Created Regular User:', user.email);

  // Initial Vehicles
  const vehicles = [
    {
      vin: '1HGCR2F83HA100001',
      make: 'Tesla',
      model: 'Model Y Long Range',
      category: Category.EV,
      price: 48990,
      quantity: 8,
      imageUrl: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=1000&auto=format&fit=crop',
      description: 'Dual Motor All-Wheel Drive, 330 miles range, premium interior.',
    },
    {
      vin: '1HGCR2F83HA100002',
      make: 'Porsche',
      model: '911 Carrera S',
      category: Category.COUPE,
      price: 131300,
      quantity: 2,
      imageUrl: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=1000&auto=format&fit=crop',
      description: '3.0L Twin-Turbo Flat 6, 443 hp, 8-speed Porsche Doppelkupplung (PDK).',
    },
    {
      vin: '1HGCR2F83HA100003',
      make: 'Toyota',
      model: 'Camry XSE Hybrid',
      category: Category.HYBRID,
      price: 34250,
      quantity: 12,
      imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=1000&auto=format&fit=crop',
      description: '2.5L 4-Cylinder Hybrid, 208 hp, 47 MPG combined.',
    },
    {
      vin: '1HGCR2F83HA100004',
      make: 'Ford',
      model: 'F-150 Lightning XLT',
      category: Category.TRUCK,
      price: 54995,
      quantity: 4,
      imageUrl: 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?q=80&w=1000&auto=format&fit=crop',
      description: 'All-Electric Pickup Truck, 580 hp, 775 lb-ft torque, Pro Power Onboard.',
    },
    {
      vin: '1HGCR2F83HA100005',
      make: 'BMW',
      model: 'X5 xDrive40i',
      category: Category.SUV,
      price: 67500,
      quantity: 6,
      imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1000&auto=format&fit=crop',
      description: '3.0L BMW TwinPower Turbo inline 6-cylinder, xDrive All-Wheel Drive.',
    },
    {
      vin: '1HGCR2F83HA100006',
      make: 'Audi',
      model: 'e-tron GT',
      category: Category.EV,
      price: 106500,
      quantity: 0, // Out of stock example to demonstrate disabled purchase button
      imageUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=1000&auto=format&fit=crop',
      description: 'Grand Tourer EV, 522 hp with boost mode, 800V architecture fast charging.',
    },
  ];

  for (const v of vehicles) {
    await prisma.vehicle.upsert({
      where: { vin: v.vin },
      update: {
        make: v.make,
        model: v.model,
        category: v.category,
        price: v.price,
        quantity: v.quantity,
        imageUrl: v.imageUrl,
        description: v.description,
      },
      create: v,
    });
  }

  console.log(`Seeded ${vehicles.length} sample vehicles successfully.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
