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
    try {
      if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGO_URI);
      }
      await User.deleteOne({ email: TEST_EMAIL });
    } catch (err) {
      console.error('Before hook failed:', err.message);
      throw err;
    }
  });

  after(async function () {
    try {
      await User.deleteOne({ email: TEST_EMAIL });
      await mongoose.disconnect();
    } catch (err) {
      console.error('After hook failed:', err.message);
      throw err;
    }
  });

  describe('POST /api/auth/signup', function () {
    it('rejects a signup with missing fields', async function () {
      try {
        const res = await request(app).post('/api/auth/signup').send({ email: TEST_EMAIL });
        expect(res.status).to.equal(400);
        expect(res.body.success).to.equal(false);
      } catch (err) {
        console.error('Test failed - missing fields signup:', err.message);
        throw err;
      }
    });

    it('creates a new user and returns a token + user', async function () {
      try {
        const res = await request(app)
          .post('/api/auth/signup')
          .send({ name: 'Test User', email: TEST_EMAIL, password: PASSWORD });

        expect(res.status).to.equal(201);
        expect(res.body).to.have.property('token');
        expect(res.body.user).to.include({ name: 'Test User', email: TEST_EMAIL });
        expect(res.body.user).to.have.property('avatar');
        expect(res.body.user).to.have.property('id');
      } catch (err) {
        console.error('Test failed - create user:', err.message);
        throw err;
      }
    });

    it('rejects a duplicate signup with the same email', async function () {
      try {
        const res = await request(app)
          .post('/api/auth/signup')
          .send({ name: 'Test User', email: TEST_EMAIL, password: PASSWORD });

        expect(res.status).to.equal(409);
      } catch (err) {
        console.error('Test failed - duplicate signup:', err.message);
        throw err;
      }
    });
  });

  describe('POST /api/auth/login', function () {
    it('rejects an invalid password', async function () {
      try {
        const res = await request(app)
          .post('/api/auth/login')
          .send({ email: TEST_EMAIL, password: 'wrong-password' });

        expect(res.status).to.equal(401);
      } catch (err) {
        console.error('Test failed - invalid password:', err.message);
        throw err;
      }
    });

    it('logs in with the correct credentials', async function () {
      try {
        const res = await request(app)
          .post('/api/auth/login')
          .send({ email: TEST_EMAIL, password: PASSWORD });

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('token');
        expect(res.body.user.email).to.equal(TEST_EMAIL);
      } catch (err) {
        console.error('Test failed - login:', err.message);
        throw err;
      }
    });
  });
});