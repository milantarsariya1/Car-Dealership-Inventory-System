import 'dotenv/config';
import request from 'supertest';
import app from '../src/app';
import { PrismaClient } from '../src/generated/client';

jest.setTimeout(30000);

const prisma = new PrismaClient();

describe('Inventory Management Endpoints (/api/vehicles/:id/purchase & /restock)', () => {
  let adminToken: string;
  let userToken: string;
  let vehicleId: string;

  const testAdmin = {
    name: 'Inventory Admin',
    email: 'inventory_admin@test.com',
    password: 'password123',
    role: 'ADMIN',
  };

  const testUser = {
    name: 'Inventory User',
    email: 'inventory_user@test.com',
    password: 'password123',
    role: 'USER',
  };

  const inventoryVehicle = {
    vin: '1HGCR2F83HA999999',
    make: 'Tesla',
    model: 'Model 3',
    category: 'EV',
    price: 42000,
    quantity: 2,
    description: 'Electric Sedan in stock.',
  };

  beforeAll(async () => {
    await prisma.transaction.deleteMany({});
    await prisma.vehicle.deleteMany({ where: { vin: inventoryVehicle.vin } });
    await prisma.user.deleteMany({
      where: { email: { in: [testAdmin.email, testUser.email] } },
    });

    // Create Admin & User
    await request(app).post('/api/auth/register').send(testAdmin);
    const adminLogin = await request(app).post('/api/auth/login').send({
      email: testAdmin.email,
      password: testAdmin.password,
    });
    adminToken = adminLogin.body.token;

    await request(app).post('/api/auth/register').send(testUser);
    const userLogin = await request(app).post('/api/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    });
    userToken = userLogin.body.token;

    // Create Vehicle with quantity = 2
    const vehicleRes = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(inventoryVehicle);

    vehicleId = vehicleRes.body.data.id;
  });

  afterAll(async () => {
    await prisma.transaction.deleteMany({});
    await prisma.vehicle.deleteMany({ where: { vin: inventoryVehicle.vin } });
    await prisma.user.deleteMany({
      where: { email: { in: [testAdmin.email, testUser.email] } },
    });
    await prisma.$disconnect();
  });

  describe('POST /api/vehicles/:id/purchase', () => {
    it('should allow an authenticated user to purchase a vehicle and decrement quantity by 1', async () => {
      const res = await request(app)
        .post(`/api/vehicles/${vehicleId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 1 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.vehicle.quantity).toBe(1); // 2 - 1 = 1
      expect(res.body.data.transaction).toHaveProperty('id');
    });

    it('should decrement stock to 0 on second purchase', async () => {
      const res = await request(app)
        .post(`/api/vehicles/${vehicleId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 1 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.vehicle.quantity).toBe(0);
    });

    it('should reject purchase when stock quantity is 0', async () => {
      const res = await request(app)
        .post(`/api/vehicles/${vehicleId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 1 });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/out of stock|insufficient stock/i);
    });
  });

  describe('POST /api/vehicles/:id/restock', () => {
    it('should reject restock attempt by non-admin user', async () => {
      const res = await request(app)
        .post(`/api/vehicles/${vehicleId}/restock`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 5 });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('should allow admin to restock vehicle and increase quantity', async () => {
      const res = await request(app)
        .post(`/api/vehicles/${vehicleId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 10 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.vehicle.quantity).toBe(10); // 0 + 10 = 10
      expect(res.body.data.transaction.type).toBe('RESTOCK');
    });
  });
});
