const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');
const Group = require('../models/group');
const expect = require('chai').expect;

describe('API Tests', () => {
  let adminToken;
  let userToken;
  let groupId;

  before(async () => {
    // Clear database
    await User.deleteMany({});
    await Group.deleteMany({});

    // Create an admin user
    await request(app)
      .post('/api/users')
      .send({ username: 'admin', password: 'admin123', role: 'admin' });

    // Login as admin
    const adminRes = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'admin123' });
    adminToken = adminRes.body.token;

    // Create a normal user
    await request(app)
      .post('/api/users')
      .set('Authorization', adminToken)
      .send({ username: 'user', password: 'user123' });

    // Login as normal user
    const userRes = await request(app)
      .post('/api/auth/login')
      .send({ username: 'user', password: 'user123' });
    userToken = userRes.body.token;
  });

  after(async () => {
    // Close database connection after tests
    await mongoose.connection.close();
  });

  it('should create a new group', async () => {
    const res = await request(app)
      .post('/api/groups')
      .set('Authorization', userToken)
      .send({ name: 'Test Group', members: [] });

    expect(res.status).to.equal(201);
    expect(res.body.name).to.equal('Test Group');
    groupId = res.body._id;
  });

  it('should add a member to the group', async () => {
    const res = await request(app)
      .post('/api/groups/add-member')
      .set('Authorization', userToken)
      .send({ groupId, userId: 'user_id_here' }); // Replace 'user_id_here' with actual user ID

    expect(res.status).to.equal(200);
    expect(res.body.members.length).to.equal(1);
  });

  it('should send a message in the group', async () => {
    const res = await request(app)
      .post('/api/groups/send-message')
      .set('Authorization', userToken)
      .send({ groupId, content: 'Hello Group!' });

    expect(res.status).to.equal(200);
    expect(res.body.messages[0].content).to.equal('Hello Group!');
  });

  it('should like a message in the group', async () => {
    const res = await request(app)
      .post('/api/groups/like-message')
      .set('Authorization', userToken)
      .send({ groupId, messageId: 'message_id_here' }); // Replace 'message_id_here' with actual message ID

    expect(res.status).to.equal(200);
    expect(res.body.messages[0].likes.length).to.equal(1);
  });

  it('should delete the group', async () => {
    const res = await request(app)
      .delete(`/api/groups/${groupId}`)
      .set('Authorization', userToken);

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal('Group deleted');
  });
});
