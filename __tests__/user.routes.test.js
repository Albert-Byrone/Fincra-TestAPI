// const request = require('supertest');
// const app = require('../app'); // Update the path to where your Express app is exported
// const authMiddleware = require('../middleware/authMiddleware');

// jest.mock('../middleware/authMiddleware', () => ({
//   authenticate: (req, res, next) => next(),
//   authorize: jest.fn().mockImplementation((role) => (req, res, next) => next()),
// }));

// describe('Comment Routes', () => {
//   it('POST /comment/create - should create a comment', async () => {
//     const testComment = {
//       text: 'This is a test comment',
//       ticketId: 'SOME_TICKET_ID',
//     };

//     const response = await request(app)
//       .post('/comment/create') // Corrected path
//       .send(testComment)
//       .set('Authorization', `Bearer valid_token`);

//     expect(response.statusCode).toBe(201);
//     expect(response.body).toHaveProperty('text', testComment.text);
//     expect(response.body).toHaveProperty('ticketId', testComment.ticketId);
//   });

//   it('POST /comment/create - should require authentication', async () => {
//     const testComment = {
//       text: 'This comment should not be created',
//       ticketId: 'SOME_TICKET_ID',
//     };

//     const response = await request(app)
//       .post('/comment/create') // Corrected path
//       .send(testComment);
//     // Expecting a failure due to lack of authentication
//     expect(response.statusCode).toBe(401);
//   });

//   it('POST /comment/create - should validate input fields', async () => {
//     const invalidComment = {};

//     const response = await request(app)
//       .post('/comment/create') // Corrected path
//       .send(invalidComment)
//       .set('Authorization', `Bearer valid_token`);

//     expect(response.statusCode).toBe(400);
//     expect(response.body).toHaveProperty('error');
//   });

//   // it('DELETE /comment/:id - should delete a comment', async () => {
//   //   const commentId = 'SOME_COMMENT_ID';

//   //   const response = await request(app)
//   //     .delete(`/comment/${commentId}`) // Path is already correct
//   //     .set('Authorization', `Bearer valid_token`);

//   //   expect(response.statusCode).toBe(200);
//   //   // Additional assertions to verify the comment is actually deleted
//   // });

//   // Add more tests as needed for other routes and functionalities
// });



// g AudioProcessingEventimport mongoose from 'mongoose';
const mongoose = require('mongoose');
// import supertest from 'supertest';
// import app from '../app'; // Assuming you have an Express app instance in app.ts
// import User from '../models/User';
const app = require('../app');
const supertest = require('supertest');
const request = supertest(app);
const User = require('../models/User');


afterEach(async () => {
  // Cleanup the database after each test
  await User.deleteMany({});
});


describe('User Registration and Login', () => {
  it('should register a new user', async () => {
    const response = await request.post('/users/register').send({
      username: 'testUser',
      email: 'test@example.com',
      password: 'password123',
      role: 'customer',
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User created successfully');
  });

  it('should prevent registration with an existing email', async () => {
    // First, create a user
    await request.post('/users/register').send({
      username: 'testUser',
      email: 'test@example.com',
      password: 'password123',
      role: 'customer',
    });

    // Try to create another user with the same email
    const response = await request.post('/users/register').send({
      username: 'anotherUser',
      email: 'test@example.com',
      password: 'password123',
      role: 'customer',
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('The user has already been registered');
  });

  it('should login an existing user', async () => {
    // First, create a user
    await request.post('/users/register').send({
      username: 'loginUser',
      email: 'login@example.com',
      password: 'password123',
      role: 'customer',
    });

    // Attempt to login
    const response = await request.post('/users/login').send({
      email: 'login@example.com',
      password: 'password123',
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('should not login with incorrect password', async () => {
    // First, create a user
    await request.post('/users/register').send({
      username: 'wrongPassUser',
      email: 'wrongpass@example.com',
      password: 'password123',
      role: 'customer',
    });

    // Attempt to login with wrong password
    const response = await request.post('/users/login').send({
      email: 'wrongpass@example.com',
      password: 'wrongPassword',
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid credentials');
  });
});
