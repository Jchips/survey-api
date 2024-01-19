'use strict';

const { app } = require('../src/server');
const supertest = require('supertest');
const request = supertest(app);

describe('Error handling', () => {
  test('handles bad routes', async () => {
    let response = await request.post('/foo');

    expect(response.status).toBe(404);
  });

  test('handles bad method', async () => {
    let response = await request.put('/responses');

    expect(response.status).toBe(404);
  });
});
