'use strict';

const { app } = require('../src/server');
const supertest = require('supertest');
const { db, User } = require('../src/auth/models');
const { Survey } = require('../src/models');
const request = supertest(app);

let creator;
let user;

beforeAll(async () => {
  try {
    await db.sync();

    // create users
    creator = await User.create({
      username: 'fox',
      password: 'password123',
      role: 'creator',
    });
    user = await User.create({
      username: 'goat',
      password: 'password123',
      role: 'user',
    });

    // create surveys
    await Survey.create({
      title: 'Animals',
      questions: ['what\'s your favorite animal?'],
      created_by_user_id: 1,
    });
    await Survey.create({
      name: 'Food',
      questions: ['what\'s the last food that you ate?', 'did you like it?'],
      created_by_user_id: 1,
    });
  } catch (err) {
    console.error('Error syncing database:', err);
    process.exit(1); // Exit the process if there's an error
  }
});

afterAll(async () => {
  await db.drop();
});

describe('Access control', () => {
  test('allows read access', async () => {
    let response = await request.get('/surveys').set('Authorization', `Bearer ${creator.token}`);
    let response2 = await request.get('/surveys/1').set('Authorization', `Bearer ${creator.token}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toEqual(2);
    expect(response2.status).toBe(200);
    expect(response2.body.title).toEqual('Animals');
  });

  test('adds a survey and returns an object with the added survey', async () => {
    let survey = {
      title: 'Music',
      questions: ['what music artist\'s do you listen to the most?'],
      created_by_user_id: '1',
    };
    let response = await request.post('/surveys').set('Authorization', `Bearer ${creator.token}`).send(survey);

    expect(response.status).toBe(201);
    expect(response.body.title).toEqual('Music');
  });

  test('does not allow someone who is just a user to post survey', async () => {
    let response = await request.post('/surveys').set('Authorization', `Bearer ${user.token}`);

    expect(response.status).toBe(403);
    expect(response.text).toEqual('Access denied');
  });

  test('updates a survey and returns an object with the updated survey', async () => {
    let survey = {
      title: 'Music',
      questions: ['what song\'s do you listen to the most?'],
      created_by_user_id: '1',
    };
    let response = await request.put('/surveys/3').set('Authorization', `Bearer ${creator.token}`).send(survey);

    expect(response.status).toBe(200);
    expect(response.body.questions[0]).toEqual('what song\'s do you listen to the most?');
  });

  test('does not allow someone who is just a user to update survey', async () => {
    let response = await request.put('/surveys/3').set('Authorization', `Bearer ${user.token}`);

    expect(response.status).toBe(403);
    expect(response.text).toEqual('Access denied');
  });

  test('delete a survey. Subsequent GET for the same survey ID should result in nothing found.', async () => {
    let response = await request.delete('/surveys/3').set('Authorization', `Bearer ${creator.token}`);
    let response2 = await request.get('/surveys/3').set('Authorization', `Bearer ${user.token}`);

    expect(response.status).toBe(200);
    expect(response.text).toEqual('deleted survey');
    expect(response.body).toEqual({});
    expect(response2.body).toBeNull;
  });

  test('does not allow someone who is just a user to delete survey', async () => {
    let response = await request.delete('/surveys/3').set('Authorization', `Bearer ${user.token}`);

    expect(response.status).toBe(403);
    expect(response.text).toEqual('Access denied');
  });

  test('create a response', async () => {
    let response = await request.post('/responses').set('Authorization', `Bearer ${user.token}`).send({
      response: 'tipsycow',
      survey_id: 1,
    });

    expect(response.status).toBe(201);
    expect(response.body.response).toEqual('tipsycow');
  });

  test('only a logged in creator can view responses to their surveys', async () => {
    let newUser = await User.create({
      username: 'duck',
      password: 'password123',
      role: 'creator',
    });

    let response = await request.get('/responses/1/1').set('Authorization', `Bearer ${creator.token}`); // user #1, survey #1
    let response2 = await request.get('/responses/3/1').set('Authorization', `Bearer ${creator.token}`); // user #3, survey #1

    // create new survey by newUser
    await request.post('/surveys').set('Authorization', `Bearer ${newUser.token}`).send({
      title: 'Hats',
      questions:['how many hats do you own?'],
      created_by_user_id: 3,
    });
    let response3 = await request.get('/responses/3/4').set('Authorization', `Bearer ${newUser.token}`); // user #3, survey #4
    let response4 = await request.get('/responses/3/1').set('Authorization', `Bearer ${newUser.token}`); // user #3, survey #1

    expect(response.status).toBe(200);
    expect(response.body.length).toEqual(1);
    expect(response.body[0].response).toEqual('tipsycow');

    expect(response2.status).toBe(403);
    expect(response2.text).toEqual('Access denied');

    expect(response3.status).toBe(200);
    expect(response3.body).toEqual([]);

    expect(response4.status).toBe(403);
    expect(response4.text).toEqual('Access denied');
  });
});