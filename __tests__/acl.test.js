'use strict';

const { app } = require('../src/server');
const supertest = require('supertest');
const { db, User } = require('../src/auth/models');
const { Survey } = require('../src/models');
const request = supertest(app);

let person;
// let person2;

beforeAll(async () => {
  try {
    await db.sync();
    person = await User.create({
      username: 'fox',
      password: 'password123',
      role: 'admin',
    });
    await Survey.create({
      title: 'Animals',
      questions: ['what\'s your favorite animal?'],
    });
    await Survey.create({
      name: 'Food',
      questions: ['what\'s the last food that you ate?', 'did you like it?'],
    });
  } catch (err) {
    console.error('Error syncing database:', err);
    process.exit(1); // Exit the process if there's an error
  }
  // person2 = await User.create({
  //   username: 'goat',
  //   password: 'password123',
  //   role: 'user',
  // });
});

afterAll(async () => {
  await db.drop();
});

describe('Access control', () => {
  test('allows read access', async () => {
    let response = await request.get('/surveys').set('Authorization', `Bearer ${person.token}`);
    let response2 = await request.get('/surveys/1').set('Authorization', `Bearer ${person.token}`);

    expect(response.status).toEqual(200);
    expect(response.body.length).toEqual(2);
    expect(response2.status).toEqual(200);
    expect(response2.body.title).toEqual('Animals');
  });

  // test('does not allow a reader update access', async () => {
  //   let response = await request.put('/api/v2/food/0').set('Authorization', `Bearer ${person2.token}`);

  //   expect(response.status).toEqual(500);
  //   expect(response.text).toEqual('{"status":500,"message":"Access Denied"}');
  // });

  // test('adds an item to the DB and returns an object with the added item', async () => {
  //   let object = {
  //     name: 'cheese',
  //     calories: 100,
  //     type: 'protein',
  //   };
  //   let response = await request.post('/api/v2/food').set('Authorization', `Bearer ${person.token}`).send(object);

  //   expect(response.status).toBe(201);
  //   expect(response.body.name).toEqual('cheese');
  // });

  // test('returns a single, updated item by ID.', async () => {
  //   let object = {
  //     name: 'cheese',
  //     calories: 90,
  //     type: 'protein',
  //   };
  //   let response = await request.put('/api/v2/food/3').set('Authorization', `Bearer ${person.token}`).send(object);

  //   expect(response.status).toBe(200);
  //   expect(response.body.calories).toEqual(90);
  // });

  // test('returns an empty object. Subsequent GET for the same ID should result in nothing found.', async () => {
  //   let response = await request.delete('/api/v2/food/3').set('Authorization', `Bearer ${person.token}`);
  //   let response2 = await request.get('/api/v2/food/3').set('Authorization', `Bearer ${person.token}`);

  //   expect(response.status).toBe(200);
  //   expect(response.body).toEqual(1);
  //   expect(response2.body).toBeNull;
  // });
});