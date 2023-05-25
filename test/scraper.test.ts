import 'jest';
import request from 'supertest';
import app from '../src/app';

describe('test scraper', () => {
  let response: any;
  test('respont with the right oblect if a valid input is provided', async () => {
    response = await request(app).get('/api?url=http://www.google.com');

    expect(Object.keys(response.body)).toMatchObject([
      'title',
      'description',
      'url',
      'image',
    ]);
  });
  test('respond with 200 status code, if a valid input is provided', async () => {
    expect(response.statusCode).toBe(200);
  });
  test('respont with an error message if invalid input is provided', async () => {
    response = await request(app).get('/api?url=htt://www.google.com');
    expect(response.body.message).toBe('missing or invalid url');
  });
  test('respont with an error message if no req.query is provided', async () => {
    response = await request(app).get('/api?url');
    expect(response.body.message).toBe('missing or invalid url');
  });
});
