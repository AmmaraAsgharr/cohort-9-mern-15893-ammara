require('dotenv').config();
const { expect } = require('chai');
const mongoose = require('mongoose');
const request = require('supertest');

const app = require('../src/app');
const User = require('../src/models/user.model');
const { Note } = require('../src/models/note.model');

const TEST_EMAIL = 'test.notes.user@example.com';
const PASSWORD = 'password123';
let authToken;
let userId;
let noteId;

describe('Notes API', function () {
  before(async function () {
    try {
      if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGO_URI);
      }
      await User.deleteOne({ email: TEST_EMAIL });
      await Note.deleteMany({ userId });

      // Create test user and get token
      const signupRes = await request(app)
        .post('/api/auth/signup')
        .send({ name: 'Test User', email: TEST_EMAIL, password: PASSWORD });

      authToken = signupRes.body.token;
      userId = signupRes.body.user.id;
    } catch (err) {
      console.error('Before hook failed:', err.message);
      throw err;
    }
  });

  after(async function () {
    try {
      await User.deleteOne({ email: TEST_EMAIL });
      await Note.deleteMany({ userId });
      await mongoose.disconnect();
    } catch (err) {
      console.error('After hook failed:', err.message);
      throw err;
    }
  });

  describe('POST /api/notes', function () {
    it('creates a new note with valid data', async function () {
      try {
        const res = await request(app)
          .post('/api/notes')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            title: 'Test Note',
            content: 'This is test content',
            color: '#FFA500',
            tags: ['test'],
          });

        expect(res.status).to.equal(201);
        expect(res.body).to.have.property('_id');
        expect(res.body.title).to.equal('Test Note');
        expect(res.body.wordCount).to.be.greaterThan(0);
        noteId = res.body._id;
      } catch (err) {
        console.error('Test failed - create note:', err.message);
        throw err;
      }
    });

    it('rejects note creation without auth token', async function () {
      try {
        const res = await request(app)
          .post('/api/notes')
          .send({ title: 'Test', content: 'Test' });

        expect(res.status).to.equal(401);
      } catch (err) {
        console.error('Test failed - no auth:', err.message);
        throw err;
      }
    });
  });

  describe('GET /api/notes', function () {
    it('retrieves all notes for authenticated user', async function () {
      try {
        const res = await request(app)
          .get('/api/notes')
          .set('Authorization', `Bearer ${authToken}`);

        expect(res.status).to.equal(200);
        expect(Array.isArray(res.body)).to.equal(true);
        expect(res.body.length).to.be.greaterThan(0);
      } catch (err) {
        console.error('Test failed - get notes:', err.message);
        throw err;
      }
    });
  });

  describe('GET /api/notes/:id', function () {
    it('retrieves a specific note by id', async function () {
      try {
        const res = await request(app)
          .get(`/api/notes/${noteId}`)
          .set('Authorization', `Bearer ${authToken}`);

        expect(res.status).to.equal(200);
        expect(res.body._id.toString()).to.equal(noteId.toString());
      } catch (err) {
        console.error('Test failed - get note:', err.message);
        throw err;
      }
    });

    it('returns 404 for non-existent note', async function () {
      try {
        const fakeId = new mongoose.Types.ObjectId();
        const res = await request(app)
          .get(`/api/notes/${fakeId}`)
          .set('Authorization', `Bearer ${authToken}`);

        expect(res.status).to.equal(404);
      } catch (err) {
        console.error('Test failed - not found:', err.message);
        throw err;
      }
    });
  });

  describe('PUT /api/notes/:id', function () {
    it('updates a note with valid data', async function () {
      try {
        const res = await request(app)
          .put(`/api/notes/${noteId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .send({ title: 'Updated Title', content: 'Updated content here' });

        expect(res.status).to.equal(200);
        expect(res.body.title).to.equal('Updated Title');
      } catch (err) {
        console.error('Test failed - update note:', err.message);
        throw err;
      }
    });
  });

  describe('DELETE /api/notes/:id', function () {
    it('deletes a note', async function () {
      try {
        const res = await request(app)
          .delete(`/api/notes/${noteId}`)
          .set('Authorization', `Bearer ${authToken}`);

        expect(res.status).to.equal(200);
        expect(res.body.success).to.equal(true);
      } catch (err) {
        console.error('Test failed - delete note:', err.message);
        throw err;
      }
    });
  });
});