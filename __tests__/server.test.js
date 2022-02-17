import jest from 'jest';
import request from 'supertest';
import { app } from '../server';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get(
    'https://api.hatchways.io/assessment/blog/posts*',
    (req, res, ctx) => {
      return res(
        ctx.json({
          posts: [
            {
              author: 'Rylee Paul',
              authorId: 9,
              id: 1,
              likes: 960,
              popularity: 0.13,
              reads: 50361,
              tags: ['tech', 'health'],
            },
            {
              author: 'Zackery Turner',
              authorId: 12,
              id: 2,
              likes: 469,
              popularity: 0.68,
              reads: 90406,
              tags: ['startups', 'tech', 'history'],
            },
            {
              author: 'Elisha Friedman',
              authorId: 8,
              id: 4,
              likes: 728,
              popularity: 0.88,
              reads: 19645,
              tags: ['science', 'design', 'tech'],
            },
            {
              author: 'Trevon Rodriguez',
              authorId: 5,
              id: 8,
              likes: 735,
              popularity: 0.76,
              reads: 8504,
              tags: ['culture', 'history'],
            },
            {
              author: 'Elisha Friedman',
              authorId: 8,
              id: 10,
              likes: 853,
              popularity: 0.6,
              reads: 35913,
              tags: ['science', 'health', 'history'],
            },
            {
              author: 'Adalyn Blevins',
              authorId: 11,
              id: 12,
              likes: 590,
              popularity: 0.32,
              reads: 80351,
              tags: ['tech', 'history'],
            },
          ],
        })
      );
    }
  )
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('GET /api/ping', () => {
  it('should respond with a 200 status code', async () => {
    const response = await request(app).get('/api/ping');
    expect(response.statusCode).toBe(200);
  });
  it('should have a property success with the value of true', async () => {
    const response = await request(app).get('/api/ping');
    expect(response.body.success).toBe(true);
  });
});
describe('GET /api/posts', () => {
  it('should respond with a 400 status code if tags are not passed in params', async () => {
    const response = await request(app).get('/api/posts');
    expect(response.statusCode).toBe(400);
  });
  it('should respond with error about the tags parameter being required', async () => {
    const response = await request(app).get('/api/posts');
    expect(response.body.error).toBe('The tags parameter is required');
  });
  it('should respond with a 400 status code if sortBy param is invalid', async () => {
    const response = await request(app).get(
      '/api/posts?tags=history&sortby=incorrectparam'
    );
    expect(response.statusCode).toBe(400);
  });
  it('should respond with an error that the sortBy param is invalid', async () => {
    const response = await request(app).get(
      '/api/posts?tags=history&sortby=incorrectparam'
    );
    console.log('RESPONSE', response.body);
    expect(response.body.error).toBe('The sortBy parameter is invalid');
  });
  it('should respond with a 400 status code if direction param is invalid', async () => {
    const response = await request(app).get(
      '/api/posts?tags=history&direction=incorrectparam'
    );
    expect(response.statusCode).toBe(400);
  });
  it('should respond with an error that the sortBy param is invalid', async () => {
    const response = await request(app).get(
      '/api/posts?tags=history&direction=incorrectparam'
    );

    expect(response.body.error).toBe('The direction parameter is invalid');
  });
  it('should respond with a 200 status code for a valid request', async () => {
    const response = await request(app).get(
      '/api/posts?tags=history,tech&sortby=id&direction=asc'
    );
    expect(response.statusCode).toBe(200);
  });
  it('should respond without duplicate post if more than one tags queried', async () => {
    const response = await request(app).get(
      '/api/posts?tags=history,tech&sortby=id&direction=asc'
    );

    //test data would be 8 if duplicates not removed
    expect(response.body.length).toBe(6);
  });
  it('should default to sortby=id and direction=asc if only tags param passed', async () => {
    const response = await request(app).get('/api/posts?tags=history,tech');
    expect(response.body[0].id).toBeLessThan(response.body[1].id);
    expect(response.body[1].id).toBeGreaterThan(response.body[0].id);
    expect(response.body[2].id).toBeGreaterThan(response.body[1].id);
    expect(response.body[3].id).toBeGreaterThan(response.body[2].id);
    expect(response.body[4].id).toBeGreaterThan(response.body[3].id);
    expect(response.body[5].id).toBeGreaterThan(response.body[4].id);
  });
  it('should respond in with id in asc order when sortby=id and direction=asc', async () => {
    const response = await request(app).get(
      '/api/posts?tags=history,tech&sortby=id&direction=asc'
    );
    expect(response.body[0].id).toBeLessThan(response.body[1].id);
    expect(response.body[1].id).toBeGreaterThan(response.body[0].id);
    expect(response.body[2].id).toBeGreaterThan(response.body[1].id);
    expect(response.body[3].id).toBeGreaterThan(response.body[2].id);
    expect(response.body[4].id).toBeGreaterThan(response.body[3].id);
    expect(response.body[5].id).toBeGreaterThan(response.body[4].id);
  });
  it('should respond in with id in desc order when sortby=id and direction=desc', async () => {
    const response = await request(app).get(
      '/api/posts?tags=history,tech&sortby=id&direction=desc'
    );
    expect(response.body[0].id).toBeGreaterThan(response.body[1].id);
    expect(response.body[1].id).toBeLessThan(response.body[0].id);
    expect(response.body[2].id).toBeLessThan(response.body[1].id);
    expect(response.body[3].id).toBeLessThan(response.body[2].id);
    expect(response.body[4].id).toBeLessThan(response.body[3].id);
    expect(response.body[5].id).toBeLessThan(response.body[4].id);
  });
  it('should respond in with reads in asc order when sortby=reads and direction=asc', async () => {
    const response = await request(app).get(
      '/api/posts?tags=history,tech&sortby=reads&direction=asc'
    );
    expect(response.body[0].reads).toBeLessThan(response.body[1].reads);
    expect(response.body[1].reads).toBeGreaterThan(response.body[0].reads);
    expect(response.body[2].reads).toBeGreaterThan(response.body[1].reads);
    expect(response.body[3].reads).toBeGreaterThan(response.body[2].reads);
    expect(response.body[4].reads).toBeGreaterThan(response.body[3].reads);
    expect(response.body[5].reads).toBeGreaterThan(response.body[4].reads);
  });
  it('should respond in with reads in desc order when sortby=reads and direction=desc', async () => {
    const response = await request(app).get(
      '/api/posts?tags=history,tech&sortby=reads&direction=desc'
    );
    expect(response.body[0].reads).toBeGreaterThan(response.body[1].reads);
    expect(response.body[1].reads).toBeLessThan(response.body[0].reads);
    expect(response.body[2].reads).toBeLessThan(response.body[1].reads);
    expect(response.body[3].reads).toBeLessThan(response.body[2].reads);
    expect(response.body[4].reads).toBeLessThan(response.body[3].reads);
    expect(response.body[5].reads).toBeLessThan(response.body[4].reads);
  });
  it('should respond in with likes in asc order when sortby=likes and direction=asc', async () => {
    const response = await request(app).get(
      '/api/posts?tags=history,tech&sortby=likes&direction=asc'
    );
    expect(response.body[0].likes).toBeLessThan(response.body[1].likes);
    expect(response.body[1].likes).toBeGreaterThan(response.body[0].likes);
    expect(response.body[2].likes).toBeGreaterThan(response.body[1].likes);
    expect(response.body[3].likes).toBeGreaterThan(response.body[2].likes);
    expect(response.body[4].likes).toBeGreaterThan(response.body[3].likes);
    expect(response.body[5].likes).toBeGreaterThan(response.body[4].likes);
  });
  it('should respond in with likes in desc order when sortby=likes and direction=desc', async () => {
    const response = await request(app).get(
      '/api/posts?tags=history,tech&sortby=likes&direction=desc'
    );
    expect(response.body[0].likes).toBeGreaterThan(response.body[1].likes);
    expect(response.body[1].likes).toBeLessThan(response.body[0].likes);
    expect(response.body[2].likes).toBeLessThan(response.body[1].likes);
    expect(response.body[3].likes).toBeLessThan(response.body[2].likes);
    expect(response.body[4].likes).toBeLessThan(response.body[3].likes);
    expect(response.body[5].likes).toBeLessThan(response.body[4].likes);
  });
  it('should respond in with popularity in asc order when sortby=popularity and direction=asc', async () => {
    const response = await request(app).get(
      '/api/posts?tags=history,tech&sortby=popularity&direction=asc'
    );
    expect(response.body[0].popularity).toBeLessThan(
      response.body[1].popularity
    );
    expect(response.body[1].popularity).toBeGreaterThan(
      response.body[0].popularity
    );
    expect(response.body[2].popularity).toBeGreaterThan(
      response.body[1].popularity
    );
    expect(response.body[3].popularity).toBeGreaterThan(
      response.body[2].popularity
    );
    expect(response.body[4].popularity).toBeGreaterThan(
      response.body[3].popularity
    );
    expect(response.body[5].popularity).toBeGreaterThan(
      response.body[4].popularity
    );
  });
  it('should respond in with popularity in desc order when sortby=popularity and direction=desc', async () => {
    const response = await request(app).get(
      '/api/posts?tags=history,tech&sortby=popularity&direction=desc'
    );
    expect(response.body[0].popularity).toBeGreaterThan(
      response.body[1].popularity
    );
    expect(response.body[1].popularity).toBeLessThan(
      response.body[0].popularity
    );
    expect(response.body[2].popularity).toBeLessThan(
      response.body[1].popularity
    );
    expect(response.body[3].popularity).toBeLessThan(
      response.body[2].popularity
    );
    expect(response.body[4].popularity).toBeLessThan(
      response.body[3].popularity
    );
    expect(response.body[5].popularity).toBeLessThan(
      response.body[4].popularity
    );
  });
});
