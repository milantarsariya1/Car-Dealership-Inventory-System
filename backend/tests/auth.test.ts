import 'dotenv/config';
import request from 'supertest';
import app from '../src/app';
import prisma from '../src/config/prisma';

describe('Auth Endpoints (/api/auth)', () => {
  const testUser = {
    name: 'Test Dealer',
    email: 'dealer@test.com',
    password: 'password123',
    role: 'USER',
  };

  beforeAll(async () => {
    await prisma.user.deleteMany({ where: { email: testUser.email } });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: testUser.email } });
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully and return user details (excluding password)', async () => {
      const res = await request(app).post('/api/auth/register').send(testUser);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.email).toBe(testUser.email);
      expect(res.body.data.role).toBe(testUser.role);
      expect(res.body.data).not.toHaveProperty('password');
    });

    it('should reject registration if email is already registered', async () => {
      const res = await request(app).post('/api/auth/register').send(testUser);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/already registered|already exists/i);
    });

    it('should reject registration if required fields are missing', async () => {
      const res = await request(app).post('/api/auth/register').send({ email: 'incomplete@test.com' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject registration with an invalid email format', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'Bad Email',
        email: 'not-an-email',
        password: 'password123',
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject registration with a password shorter than 6 characters', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'Short Pass',
        email: 'shortpass@test.com',
        password: '123',
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should authenticate user with valid credentials and return JWT token', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: testUser.email,
        password: testUser.password,
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.email).toBe(testUser.email);
    });

    it('should reject login with incorrect password', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: testUser.email,
        password: 'wrongpassword',
      });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/invalid credentials|incorrect/i);
    });
  });
});
