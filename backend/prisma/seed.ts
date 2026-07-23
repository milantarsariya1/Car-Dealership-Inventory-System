import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaClient, Role, Category } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Car Dealership Inventory Database...');

  // Create Admin User
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@dealership.com' },
    update: {
      phone: '+91 98765 00001',
      address: 'Apex Motors HQ, Worli Sea Face Road',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400018',
      country: 'India',
    },
    create: {
      name: 'Executive Admin',
      email: 'admin@dealership.com',
      password: adminPasswordHash,
      role: Role.ADMIN,
      phone: '+91 98765 00001',
      address: 'Apex Motors HQ, Worli Sea Face Road',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400018',
      country: 'India',
    },
  });
  console.log('Created Admin User:', admin.email);

  // Create Regular Customer
  const userPasswordHash = await bcrypt.hash('user123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'customer@gmail.com' },
    update: {
      phone: '+91 98200 12345',
      address: 'Flat 402, Seawood Towers, Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400050',
      country: 'India',
    },
    create: {
      name: 'John Doe',
      email: 'customer@gmail.com',
      password: userPasswordHash,
      role: Role.USER,
      phone: '+91 98200 12345',
      address: 'Flat 402, Seawood Towers, Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400050',
      country: 'India',
    },
  });
  console.log('Created Regular User:', user.email);

  // Initial Vehicles & 10 Popular Indian Market Motors (Converted at 1 USD = 96.64 INR)
  const vehicles = [
    {
      vin: '1HGCR2F83HA100001',
      make: 'Tesla',
      model: 'Model Y Long Range',
      category: Category.EV,
      price: 4734394,
      quantity: 8,
      imageUrl: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=1000&auto=format&fit=crop',
      description: 'Dual Motor All-Wheel Drive, 330 miles range, premium interior.',
    },
    {
      vin: '1HGCR2F83HA100002',
      make: 'Porsche',
      model: '911 Carrera S',
      category: Category.COUPE,
      price: 12688832,
      quantity: 2,
      imageUrl: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=1000&auto=format&fit=crop',
      description: '3.0L Twin-Turbo Flat 6, 443 hp, 8-speed Porsche Doppelkupplung (PDK).',
    },
    {
      vin: '1HGCR2F83HA100003',
      make: 'Toyota',
      model: 'Camry XSE Hybrid',
      category: Category.HYBRID,
      price: 3309920,
      quantity: 12,
      imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=1000&auto=format&fit=crop',
      description: '2.5L 4-Cylinder Hybrid, 208 hp, 47 MPG combined.',
    },
    {
      vin: '1HGCR2F83HA100004',
      make: 'Ford',
      model: 'F-150 Lightning XLT',
      category: Category.TRUCK,
      price: 5314717,
      quantity: 4,
      imageUrl: 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?q=80&w=1000&auto=format&fit=crop',
      description: 'All-Electric Pickup Truck, 580 hp, 775 lb-ft torque, Pro Power Onboard.',
    },
    {
      vin: '1HGCR2F83HA100005',
      make: 'BMW',
      model: 'X5 xDrive40i',
      category: Category.SUV,
      price: 6523200,
      quantity: 6,
      imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1000&auto=format&fit=crop',
      description: '3.0L BMW TwinPower Turbo inline 6-cylinder, xDrive All-Wheel Drive.',
    },
    {
      vin: '1HGCR2F83HA100006',
      make: 'Audi',
      model: 'e-tron GT',
      category: Category.EV,
      price: 10292160,
      quantity: 0,
      imageUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=1000&auto=format&fit=crop',
      description: 'Grand Tourer EV, 522 hp with boost mode, 800V architecture fast charging.',
    },
    // 10 Popular Motors Available in India
    {
      vin: 'MAHINDRA4X4THAR07',
      make: 'Mahindra',
      model: 'Thar LX 4x4 Hard Top',
      category: Category.SUV,
      price: 1826496,
      quantity: 9,
      imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1000&auto=format&fit=crop',
      description: 'Iconic Indian Off-Roader, mStallion 2.0L Turbo Petrol, 150 hp, shift-on-the-fly 4x4.',
    },
    {
      vin: 'TATANEXONEVMAX08',
      make: 'Tata',
      model: 'Nexon EV Max Dark Edition',
      category: Category.EV,
      price: 2116416,
      quantity: 11,
      imageUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1000&auto=format&fit=crop',
      description: 'India top-selling EV, 40.5 kWh battery, 453 km ARAI certified range, Harman sound system.',
    },
    {
      vin: 'HYUNDAICRETA202609',
      make: 'Hyundai',
      model: 'Creta SX (O) Turbo',
      category: Category.SUV,
      price: 2174400,
      quantity: 15,
      imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1000&auto=format&fit=crop',
      description: '1.5L Turbo GDi, Level 2 ADAS suite, 10.25-inch dual screens, panoramic sunroof.',
    },
    {
      vin: 'TOYOTAFORTUNER4X10',
      make: 'Toyota',
      model: 'Fortuner Legender 4x4 AT',
      category: Category.SUV,
      price: 5605120,
      quantity: 5,
      imageUrl: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=1000&auto=format&fit=crop',
      description: '2.8L Diesel Engine, 204 PS, 500 Nm torque, sequential turn indicators, 18-inch alloy wheels.',
    },
    {
      vin: 'BMW3GRANLIMO202611',
      make: 'BMW',
      model: '3 Series Gran Limousine M Sport',
      category: Category.SEDAN,
      price: 6958080,
      quantity: 4,
      imageUrl: 'https://images.unsplash.com/photo-1523983388277-336a66bf9bcd?q=80&w=1000&auto=format&fit=crop',
      description: '2.0L BMW TwinPower Turbo, extended wheelbase for ultimate rear seat comfort, Curved Display.',
    },
    {
      vin: 'MERCEDESGLA4MAT12',
      make: 'Mercedes-Benz',
      model: 'GLA 220d 4MATIC AMG Line',
      category: Category.SUV,
      price: 6233280,
      quantity: 3,
      imageUrl: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1000&auto=format&fit=crop',
      description: '2.0L Turbo Diesel, 190 hp, 8G-DCT, 64-color ambient lighting, MBUX infotainment.',
    },
    {
      vin: 'AUDIQ7QUATTRO55T13',
      make: 'Audi',
      model: 'Q7 55 TFSI Quattro Technology',
      category: Category.SUV,
      price: 9470720,
      quantity: 2,
      imageUrl: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?q=80&w=1000&auto=format&fit=crop',
      description: '3.0L V6 TFSI Engine, 340 hp, adaptive air suspension, Bang & Olufsen 3D Premium Sound.',
    },
    {
      vin: 'KIASELTOSGTLINE14',
      make: 'Kia',
      model: 'Seltos GT-Line 1.5 Turbo',
      category: Category.SUV,
      price: 2309696,
      quantity: 14,
      imageUrl: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1000&auto=format&fit=crop',
      description: '1.5L Smartstream Turbo Petrol, 160 PS, dual zone FATC, 8-inch Heads Up Display.',
    },
    {
      vin: 'MARUTIJIMNYALLG15',
      make: 'Maruti Suzuki',
      model: 'Jimny Alpha 4ALLGRIP Pro',
      category: Category.SUV,
      price: 1729856,
      quantity: 7,
      imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1000&auto=format&fit=crop',
      description: 'Heavy duty 4WD off-roader, ALLGRIP PRO transfer case, rigid ladder frame chassis.',
    },
    {
      vin: 'RANGEROVERVELAR16',
      make: 'Range Rover',
      model: 'Velar Dynamic HSE P250',
      category: Category.SUV,
      price: 11113600,
      quantity: 1,
      imageUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1000&auto=format&fit=crop',
      description: '2.0L Turbocharged Petrol, 250 PS, flush deployable door handles, Pivi Pro 11.4-inch glass touchscreen.',
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
