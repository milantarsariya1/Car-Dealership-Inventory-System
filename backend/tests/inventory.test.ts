import 'dotenv/config';
import request from 'supertest';
import app from '../src/app';
import prisma from '../src/config/prisma';

jest.setTimeout(30000);

describe('Inventory Transactions - Purchase & Restock', () => {
  let adminToken: string;
  let userToken: string;
  let vehicleId: string;

  const inventoryVehicle = {
    vin: 'STOCK888999000111',
    make: 'Tesla',
    model: 'CyberTruck Cyberbeast',
    category: 'EV',
    price: 99990,
    quantity: 2,
    description: 'Tri-Motor All-Wheel Drive, 845 hp, 0-60 mph in 2.6 seconds.',
  };

  beforeAll(async () => {
    await prisma.vehicle.deleteMany({ where: { vin: inventoryVehicle.vin } });
    await prisma.user.deleteMany({ where: { email: { in: ['inv_admin@test.com', 'inv_user@test.com'] } } });

    // Setup Admin
    await request(app).post('/api/auth/register').send({
      name: 'Inv Admin',
      email: 'inv_admin@test.com',
      password: 'password123',
    });

    await prisma.user.update({
      where: { email: 'inv_admin@test.com' },
      data: { role: 'ADMIN' },
    });
    const adminLoginRes = await request(app).post('/api/auth/login').send({
      email: 'inv_admin@test.com',
      password: 'password123',
    });
    adminToken = adminLoginRes.body.token;

    // Setup User
    await request(app).post('/api/auth/register').send({
      name: 'Inv User',
      email: 'inv_user@test.com',
      password: 'password123',
      role: 'USER',
    });
    const userLoginRes = await request(app).post('/api/auth/login').send({
      email: 'inv_user@test.com',
      password: 'password123',
    });
    userToken = userLoginRes.body.token;

    // Create Vehicle
    const vehicleRes = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(inventoryVehicle);
    vehicleId = vehicleRes.body.data.id;
  });

  afterAll(async () => {
    await prisma.vehicle.deleteMany({ where: { vin: inventoryVehicle.vin } });
    await prisma.user.deleteMany({ where: { email: { in: ['inv_admin@test.com', 'inv_user@test.com'] } } });
  });

  describe('POST /api/vehicles/:id/purchase', () => {
    it('should deduct stock quantity when a user purchases a vehicle', async () => {
      const res = await request(app)
        .post(`/api/vehicles/${vehicleId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 1 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.vehicle.quantity).toBe(1);
    });

    it('should prevent purchase when stock quantity reaches 0', async () => {
      // Purchase second remaining vehicle
      await request(app)
        .post(`/api/vehicles/${vehicleId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 1 });

      // Attempt 3rd purchase when stock is 0
      const res = await request(app)
        .post(`/api/vehicles/${vehicleId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 1 });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/out of stock/i);
    });
  });

  describe('POST /api/vehicles/:id/restock (Admin Only)', () => {
    it('should increase vehicle stock quantity when ADMIN restocks', async () => {
      const res = await request(app)
        .post(`/api/vehicles/${vehicleId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 10 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.vehicle.quantity).toBe(10);
    });

    it('should reject restock request from non-admin user (403 Forbidden)', async () => {
      const res = await request(app)
        .post(`/api/vehicles/${vehicleId}/restock`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 5 });

      expect(res.status).toBe(403);
    });
  });

  describe('Purchase authorization & concurrency safety', () => {
    it('should reject purchase attempts from ADMIN accounts (403 Forbidden)', async () => {
      const res = await request(app)
        .post(`/api/vehicles/${vehicleId}/purchase`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 1 });

      expect(res.status).toBe(403);
    });

    it('should reject purchase with a non-integer or non-positive quantity', async () => {
      const res = await request(app)
        .post(`/api/vehicles/${vehicleId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 1.5 });

      expect(res.status).toBe(400);
    });

    it('should never oversell when two concurrent purchases race for the last unit', async () => {
      // Reset stock to exactly one unit
      await prisma.vehicle.update({
        where: { id: vehicleId },
        data: { quantity: 1 },
      });

      const [res1, res2] = await Promise.all([
        request(app)
          .post(`/api/vehicles/${vehicleId}/purchase`)
          .set('Authorization', `Bearer ${userToken}`)
          .send({ quantity: 1 }),
        request(app)
          .post(`/api/vehicles/${vehicleId}/purchase`)
          .set('Authorization', `Bearer ${userToken}`)
          .send({ quantity: 1 }),
      ]);

      // Exactly one purchase succeeds; the other is rejected as out of stock
      const statuses = [res1.status, res2.status].sort();
      expect(statuses).toEqual([200, 400]);

      // Stock must be exactly 0 — never negative
      const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
      expect(vehicle?.quantity).toBe(0);
    });
  });
});
