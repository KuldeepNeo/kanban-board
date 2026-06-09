import request from 'supertest';
import app from '../src/app.js';
import { getDatabaseConnection } from '../src/config/database.js';

describe('Auth API Endpoint Tests', () => {
  const sampleUser = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123'
  };

  describe('POST /register', () => {
    it('should register a user successfully and return 201', async () => {
      const res = await request(app)
        .post('/register')
        .send(sampleUser);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('message', 'User registered successfully');
      expect(res.body).toHaveProperty('userId');

      const db = await getDatabaseConnection();
      const user = await db.get('SELECT * FROM User WHERE id = ?', [res.body.userId]);
      expect(user).toBeDefined();
      expect(user.username).toBe('testuser');
      expect(user.email).toBe('test@example.com');
      expect(user.password_hash).not.toBe('password123'); // must be hashed
    });

    it('should return 400 validation error for missing username', async () => {
      const res = await request(app)
        .post('/register')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error', 'Username is required');
    });

    it('should return 400 validation error for invalid email format', async () => {
      const res = await request(app)
        .post('/register')
        .send({
          username: 'testuser',
          email: 'invalid-email',
          password: 'password123'
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error', 'Invalid email format');
    });

    it('should return 400 validation error for short password', async () => {
      const res = await request(app)
        .post('/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: '123'
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error', 'Password must be at least 6 characters long');
    });

    it('should return 409 conflict when username is already taken', async () => {
      // First registration
      await request(app).post('/register').send(sampleUser);

      // Conflict registration
      const res = await request(app)
        .post('/register')
        .send({
          username: 'testuser',
          email: 'different@example.com',
          password: 'password123'
        });

      expect(res.status).toBe(409);
      expect(res.body).toHaveProperty('error', 'Username already exists');
    });

    it('should return 409 conflict when email is already taken', async () => {
      // First registration
      await request(app).post('/register').send(sampleUser);

      // Conflict registration
      const res = await request(app)
        .post('/register')
        .send({
          username: 'differentuser',
          email: 'test@example.com',
          password: 'password123'
        });

      expect(res.status).toBe(409);
      expect(res.body).toHaveProperty('error', 'Email already exists');
    });
  });

  describe('POST /login', () => {
    beforeEach(async () => {
      // Register the sample user
      await request(app).post('/register').send(sampleUser);
    });

    it('should authenticate user with valid username and password', async () => {
      const res = await request(app)
        .post('/login')
        .send({
          emailOrUsername: 'testuser',
          password: 'password123'
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('userId');
    });

    it('should authenticate user with valid email and password', async () => {
      const res = await request(app)
        .post('/login')
        .send({
          emailOrUsername: 'test@example.com',
          password: 'password123'
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('userId');
    });

    it('should return 401 for non-existent credentials', async () => {
      const res = await request(app)
        .post('/login')
        .send({
          emailOrUsername: 'nonexistent',
          password: 'password123'
        });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error', 'Invalid credentials');
    });

    it('should return 401 for wrong password', async () => {
      const res = await request(app)
        .post('/login')
        .send({
          emailOrUsername: 'testuser',
          password: 'wrongpassword'
        });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error', 'Invalid credentials');
    });
  });

  describe('POST /logout', () => {
    it('should return 401 if unauthorized', async () => {
      const res = await request(app).post('/logout');
      expect(res.status).toBe(401);
    });

    it('should return 200 on successful logout', async () => {
      // Register and login
      await request(app).post('/register').send(sampleUser);
      const loginRes = await request(app)
        .post('/login')
        .send({
          emailOrUsername: 'testuser',
          password: 'password123'
        });

      const token = loginRes.body.token;
      const res = await request(app)
        .post('/logout')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'Logged out successfully');
    });
  });
});
