'use strict';

const { app } = require('../../src/server');
const supertest = require('supertest');
const { db, User } = require('../../src/auth/models');
const request = supertest(app);

let person = {
  username: 'cow',
  password: 'password123',
  role: 'admin',
};

let person2 = {
  username: 'bird',
  role: 'admin',
};

let user;

beforeAll(async () => {
  await db.sync();

  user = await User.create({
    username: 'bear',
    password: 'password123',
    role: 'admin',
  });
});

afterAll(async () => {
  await db.drop();
});

describe('Auth', () => {
  test('/signup creates a new user and sends an object with the user and the token to the client.', async () => {
    let response = await request.post('/signup').send(person);

    expect(response.status).toEqual(201);
    expect(response.body.token).toBeDefined();
    expect(response.body.id).toBeDefined();
    expect(response.body.username).toEqual(person.username);
  });

  test('/signup fails with no password', async () => {
    let response = await request.post('/signup').send(person2);

    expect(response.status).toEqual(500);
  });
  

  test('/signin with basic authentication headers logs in a user and sends an object with the user and the token to the client', async () => {
    let response = await request.post('/signin').auth(person.username, person.password);

    expect(response.status).toEqual(200);
    expect(response.body.token).toBeDefined();
    expect(response.body.user.id).toBeDefined();
    expect(response.body.user.username).toEqual(person.username);
  });

  test('basic auth fails with unknown user', async () => {
    const response = await request.post('/signin').auth('test', 'banana');

    expect(response.status).toBe(403);
    expect(response.text).toEqual('Invalid login');
    expect(response.body.user).not.toBeDefined();
    expect(response.body.token).not.toBeDefined();
  });

  test('bearer auth fails with unknown token', async () => {
    const response = await request.get('/users').set('Authorization', `Bearer ${person.token}`);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({status: 500, message: 'Invalid login'});
  });

  test('admin can view all users', async () => {
    const response = await request.get('/users').set('Authorization', `Bearer ${user.token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{id: 1, username: 'bear'}, {id: 2, username: 'cow'}]);
  });

  test('admin can delete a user', async () => {
    const response = await request.delete('/delete/1').set('Authorization', `Bearer ${user.token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({});
    expect(response.text).toEqual('user deleted');
  });
});
