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
    expect(response.body[0].id).toBe(1);
    expect(response.body[1].id).toBe(2);
    expect(response.body[2].id).toBe(4);
    expect(response.body[3].id).toBe(8);
    expect(response.body[4].id).toBe(10);
    expect(response.body[5].id).toBe(12);
  });
  it('should respond in with id in asc order when sortby=id and direction=asc', async () => {
    const response = await request(app).get(
      '/api/posts?tags=history,tech&sortby=id&direction=asc'
    );
    expect(response.body[0].id).toBe(1);
    expect(response.body[1].id).toBe(2);
    expect(response.body[2].id).toBe(4);
    expect(response.body[3].id).toBe(8);
    expect(response.body[4].id).toBe(10);
    expect(response.body[5].id).toBe(12);
  });
  it('should respond in with id in desc order when sortby=id and direction=desc', async () => {
    const response = await request(app).get(
      '/api/posts?tags=history,tech&sortby=id&direction=desc'
    );
    expect(response.body[0].id).toBe(12);
    expect(response.body[1].id).toBe(10);
    expect(response.body[2].id).toBe(8);
    expect(response.body[3].id).toBe(4);
    expect(response.body[4].id).toBe(2);
    expect(response.body[5].id).toBe(1);
  });
  it('should respond in with reads in asc order when sortby=reads and direction=asc', async () => {
    const response = await request(app).get(
      '/api/posts?tags=history,tech&sortby=reads&direction=asc'
    );
    expect(response.body[0].reads).toBe(8504);
    expect(response.body[1].reads).toBe(19645);
    expect(response.body[2].reads).toBe(35913);
    expect(response.body[3].reads).toBe(50361);
    expect(response.body[4].reads).toBe(80351);
    expect(response.body[5].reads).toBe(90406);
  });
  it('should respond in with reads in desc order when sortby=reads and direction=desc', async () => {
    const response = await request(app).get(
      '/api/posts?tags=history,tech&sortby=reads&direction=desc'
    );
    expect(response.body[0].reads).toBe(90406);
    expect(response.body[1].reads).toBe(80351);
    expect(response.body[2].reads).toBe(50361);
    expect(response.body[3].reads).toBe(35913);
    expect(response.body[4].reads).toBe(19645);
    expect(response.body[5].reads).toBe(8504);
  });
  it('should respond in with likes in asc order when sortby=likes and direction=asc', async () => {
    const response = await request(app).get(
      '/api/posts?tags=history,tech&sortby=likes&direction=asc'
    );
    expect(response.body[0].likes).toBe(469);
    expect(response.body[1].likes).toBe(590);
    expect(response.body[2].likes).toBe(728);
    expect(response.body[3].likes).toBe(735);
    expect(response.body[4].likes).toBe(853);
    expect(response.body[5].likes).toBe(960);
  });
  it('should respond in with likes in desc order when sortby=likes and direction=desc', async () => {
    const response = await request(app).get(
      '/api/posts?tags=history,tech&sortby=likes&direction=desc'
    );
    expect(response.body[0].likes).toBe(960);
    expect(response.body[1].likes).toBe(853);
    expect(response.body[2].likes).toBe(735);
    expect(response.body[3].likes).toBe(728);
    expect(response.body[4].likes).toBe(590);
    expect(response.body[5].likes).toBe(469);
  });
  it('should respond in with popularity in asc order when sortby=popularity and direction=asc', async () => {
    const response = await request(app).get(
      '/api/posts?tags=history,tech&sortby=popularity&direction=asc'
    );
    expect(response.body[0].popularity).toBe(0.13);
    expect(response.body[1].popularity).toBe(0.32);
    expect(response.body[2].popularity).toBe(0.6);
    expect(response.body[3].popularity).toBe(0.68);
    expect(response.body[4].popularity).toBe(0.76);
    expect(response.body[5].popularity).toBe(0.88);
  });
  it('should respond in with popularity in desc order when sortby=popularity and direction=desc', async () => {
    const response = await request(app).get(
      '/api/posts?tags=history,tech&sortby=popularity&direction=desc'
    );
    expect(response.body[0].popularity).toBe(0.88);
    expect(response.body[1].popularity).toBe(0.76);
    expect(response.body[2].popularity).toBe(0.68);
    expect(response.body[3].popularity).toBe(0.6);
    expect(response.body[4].popularity).toBe(0.32);
    expect(response.body[5].popularity).toBe(0.13);
  });
});
