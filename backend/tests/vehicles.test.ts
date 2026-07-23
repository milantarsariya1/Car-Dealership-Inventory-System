import 'dotenv/config';
import request from 'supertest';
import app from '../src/app';
import prisma from '../src/config/prisma';

jest.setTimeout(30000);

describe('Vehicle Inventory Endpoints (/api/vehicles)', () => {
  let adminToken: string;
  let userToken: string;
  let createdVehicleId: string;

  const testVehicle = {
    vin: 'TEST1234567890VIN',
    make: 'Porsche',
    model: '911 GT3 RS',
    category: 'COUPE',
    price: 223800,
    quantity: 3,
    description: 'Track-focused aerodynamic masterpiece with 518 hp naturally aspirated flat-six.',
  };

  beforeAll(async () => {
    // Clean database test data
    await prisma.vehicle.deleteMany({ where: { vin: testVehicle.vin } });
    await prisma.user.deleteMany({ where: { email: { in: ['veh_admin@test.com', 'veh_user@test.com'] } } });

    // Register & Login Admin
    await request(app).post('/api/auth/register').send({
      name: 'Vehicle Admin',
      email: 'veh_admin@test.com',
      password: 'password123',
    });
    
    // Manually promote to ADMIN since API blocks it
    await prisma.user.update({
      where: { email: 'veh_admin@test.com' },
      data: { role: 'ADMIN' },
    });
    const adminLoginRes = await request(app).post('/api/auth/login').send({
      email: 'veh_admin@test.com',
      password: 'password123',
    });
    adminToken = adminLoginRes.body.token;

    // Register & Login Customer
    await request(app).post('/api/auth/register').send({
      name: 'Vehicle Customer',
      email: 'veh_user@test.com',
      password: 'password123',
      role: 'USER',
    });
    const userLoginRes = await request(app).post('/api/auth/login').send({
      email: 'veh_user@test.com',
      password: 'password123',
    });
    userToken = userLoginRes.body.token;
  });

  afterAll(async () => {
    await prisma.vehicle.deleteMany({ where: { vin: testVehicle.vin } });
    await prisma.user.deleteMany({ where: { email: { in: ['veh_admin@test.com', 'veh_user@test.com'] } } });
  });

  describe('POST /api/vehicles (Admin Only)', () => {
    it('should allow ADMIN to add a new vehicle', async () => {
      const res = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(testVehicle);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.vin).toBe(testVehicle.vin);
      createdVehicleId = res.body.data.id;
    });

    it('should reject vehicle creation from non-admin user (403 Forbidden)', async () => {
      const res = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ ...testVehicle, vin: 'ANOTHERVIN999' });

      expect(res.status).toBe(403);
    });

    it('should reject vehicle creation with a negative price', async () => {
      const res = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ ...testVehicle, vin: 'NEGPRICEVIN12345', price: -100 });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject vehicle creation with a negative or fractional quantity', async () => {
      const res = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ ...testVehicle, vin: 'NEGQTYVIN123456', quantity: -3 });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/vehicles & /api/vehicles/search', () => {
    it('should return list of vehicles', async () => {
      const res = await request(app).get('/api/vehicles');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should filter vehicles by search query and category', async () => {
      const res = await request(app)
        .get('/api/vehicles/search')
        .query({ category: 'COUPE', query: 'Porsche' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0].make).toBe('Porsche');
    });
  });

  describe('PUT /api/vehicles/:id & DELETE /api/vehicles/:id', () => {
    it('should allow ADMIN to update vehicle price and quantity', async () => {
      const res = await request(app)
        .put(`/api/vehicles/${createdVehicleId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ price: 230000, quantity: 5 });

      expect(res.status).toBe(200);
      expect(res.body.data.price).toBe(230000);
      expect(res.body.data.quantity).toBe(5);
    });

    it('should allow ADMIN to delete a vehicle', async () => {
      const res = await request(app)
        .delete(`/api/vehicles/${createdVehicleId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
