import 'dotenv/config';
import request from 'supertest';
import app from '../src/app';
import { PrismaClient } from '../src/generated/client';

jest.setTimeout(30000);

const prisma = new PrismaClient();

describe('Vehicles Endpoints (/api/vehicles)', () => {
  let adminToken: string;
  let userToken: string;
  let createdVehicleId: string;

  const testAdmin = {
    name: 'Admin Dealer',
    email: 'admin_vehicle_test@test.com',
    password: 'password123',
    role: 'ADMIN',
  };

  const testUser = {
    name: 'Regular Customer',
    email: 'user_vehicle_test@test.com',
    password: 'password123',
    role: 'USER',
  };

  const sampleVehicle = {
    vin: '1HGCR2F83HA000001',
    make: 'Honda',
    model: 'Accord',
    category: 'SEDAN',
    price: 28500,
    quantity: 5,
    imageUrl: 'https://images.unsplash.com/photo-1590362891991-f776e747a588',
    description: 'Reliable sedan with modern safety features.',
  };

  beforeAll(async () => {
    // Cleanup existing test users & vehicles
    await prisma.vehicle.deleteMany({ where: { vin: sampleVehicle.vin } });
    await prisma.user.deleteMany({
      where: { email: { in: [testAdmin.email, testUser.email] } },
    });

    // Register & login admin
    const adminReg = await request(app).post('/api/auth/register').send(testAdmin);
    const adminLogin = await request(app).post('/api/auth/login').send({
      email: testAdmin.email,
      password: testAdmin.password,
    });
    adminToken = adminLogin.body.token;

    // Register & login regular user
    const userReg = await request(app).post('/api/auth/register').send(testUser);
    const userLogin = await request(app).post('/api/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    });
    userToken = userLogin.body.token;
  });

  afterAll(async () => {
    await prisma.vehicle.deleteMany({ where: { vin: sampleVehicle.vin } });
    await prisma.user.deleteMany({
      where: { email: { in: [testAdmin.email, testUser.email] } },
    });
    await prisma.$disconnect();
  });

  describe('POST /api/vehicles', () => {
    it('should allow admin to create a new vehicle', async () => {
      const res = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(sampleVehicle);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.vin).toBe(sampleVehicle.vin);
      expect(res.body.data.make).toBe(sampleVehicle.make);
      expect(res.body.data.quantity).toBe(sampleVehicle.quantity);

      createdVehicleId = res.body.data.id;
    });

    it('should reject vehicle creation without authorization token', async () => {
      const res = await request(app).post('/api/vehicles').send(sampleVehicle);

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should reject vehicle creation by regular non-admin user', async () => {
      const res = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ ...sampleVehicle, vin: '1HGCR2F83HA000002' });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/vehicles', () => {
    it('should return a list of all vehicles', async () => {
      const res = await request(app).get('/api/vehicles');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/vehicles/search', () => {
    it('should filter vehicles by make, model, category, and price range', async () => {
      const res = await request(app)
        .get('/api/vehicles/search')
        .query({
          make: 'Honda',
          category: 'SEDAN',
          minPrice: 20000,
          maxPrice: 30000,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.some((v: any) => v.make === 'Honda')).toBe(true);
    });
  });

  describe('GET /api/vehicles/:id', () => {
    it('should return vehicle details for a valid ID', async () => {
      const res = await request(app).get(`/api/vehicles/${createdVehicleId}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(createdVehicleId);
    });

    it('should return 404 for a non-existent vehicle ID', async () => {
      const res = await request(app).get('/api/vehicles/non-existent-id-12345');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('PUT /api/vehicles/:id', () => {
    it('should update vehicle details', async () => {
      const updatedPrice = 27000;
      const res = await request(app)
        .put(`/api/vehicles/${createdVehicleId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ price: updatedPrice });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.price).toBe(updatedPrice);
    });
  });

  describe('DELETE /api/vehicles/:id', () => {
    it('should forbid non-admin user from deleting vehicle', async () => {
      const res = await request(app)
        .delete(`/api/vehicles/${createdVehicleId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('should allow admin to delete a vehicle', async () => {
      const res = await request(app)
        .delete(`/api/vehicles/${createdVehicleId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
