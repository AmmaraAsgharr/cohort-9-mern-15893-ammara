require('dotenv').config();
const { expect } = require('chai');
const mongoose = require('mongoose');
const request = require('supertest');

const app = require('../src/app');
const User = require('../src/models/user.model');

const TEST_EMAIL = 'test.auth.user@example.com';
const PASSWORD = 'password123';

describe('Auth API', function () {
  before(async function () {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI);
    }
    await User.deleteOne({ email: TEST_EMAIL });
  });

  after(async function () {
    await User.deleteOne({ email: TEST_EMAIL });
    await mongoose.disconnect();
  });

  describe('POST /api/auth/signup', function () {
    it('rejects a signup with missing fields', async function () {
      const res = await request(app).post('/api/auth/signup').send({ email: TEST_EMAIL });
      expect(res.status).to.equal(400);
      expect(res.body.success).to.equal(false);
    });

    it('creates a new user and returns a token + user', async function () {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({ name: 'Test User', email: TEST_EMAIL, password: PASSWORD });

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('token');
      expect(res.body.user).to.include({ name: 'Test User', email: TEST_EMAIL });
      expect(res.body.user).to.have.property('avatar');
      expect(res.body.user).to.have.property('id');
    });

    it('rejects a duplicate signup with the same email', async function () {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({ name: 'Test User', email: TEST_EMAIL, password: PASSWORD });

      expect(res.status).to.equal(409);
    });
  });

  describe('POST /api/auth/login', function () {
    it('rejects an invalid password', async function () {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: TEST_EMAIL, password: 'wrong-password' });

      expect(res.status).to.equal(401);
    });

    it('logs in with the correct credentials', async function () {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: TEST_EMAIL, password: PASSWORD });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('token');
      expect(res.body.user.email).to.equal(TEST_EMAIL);
    });
  });
});