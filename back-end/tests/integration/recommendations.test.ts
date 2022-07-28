import supertest from 'supertest';
import app from '../../src/app.js';
import { prisma } from '../../src/database.js';
import recommendationsBody from '../factories/recommendationBody.js';
import { faker } from '@faker-js/faker';

const truncate = async () => {
  await prisma.$executeRaw`TRUNCATE TABLE recommendations;`;
};

const disconnect = async () => {
  await prisma.$disconnect();
};

describe('POST /recommendations', () => {
  beforeEach(truncate);
  afterAll(disconnect);

  it('should create a new recommendation', async () => {
    const recommendation = recommendationsBody();
    const response = await supertest(app)
      .post('/recommendations')
      .send(recommendation[0]);
    expect(response.status).toBe(201);
  });
  it('should return a 422 if the recommendation is not an valid youtube link', async () => {
    const recommendation = recommendationsBody();
    const response = await supertest(app)
      .post('/recommendations')
      .send(recommendation[1]);
    expect(response.status).toBe(422);
  });
  it('should return a 422 if the body is empty', async () => {
    const recommendation = recommendationsBody();
    const response = await supertest(app).post('/recommendations').send({});
    expect(response.status).toBe(422);
  });
  it('should return a 422 if there is no name on body', async () => {
    const recommendation = recommendationsBody();
    const response = await supertest(app).post('/recommendations').send({
      youtubeLink: recommendation[0].youtubeLink,
    });
    expect(response.status).toBe(422);
  });
  it('should return a 422 if there is no youtubeLink on body', async () => {
    const recommendation = recommendationsBody();
    const response = await supertest(app).post('/recommendations').send({
      name: recommendation[0].name,
    });
    expect(response.status).toBe(422);
  });
});

describe('POST /recommendations/:id/upvote', () => {
  beforeEach(truncate);
  afterAll(disconnect);

  it('should upvote a recommendation', async () => {
    const recommendation = recommendationsBody();
    const createRecommendation = await prisma.recommendation.create({
      data: {
        ...recommendation[0],
      },
    });
    const response = await supertest(app).post(
      `/recommendations/${createRecommendation.id}/upvote`
    );
    expect(response.status).toBe(200);
  });

  it('should return a 404 if the recommendation does not exist', async () => {
    const response = await supertest(app).post('/recommendations/1/upvote');
    expect(response.status).toBe(404);
  });
});

describe('POST /recommendations/:id/downvote', () => {
  beforeEach(truncate);
  afterAll(disconnect);

  it('should downvote a recommendation', async () => {
    const recommendation = recommendationsBody();
    const createRecommendation = await prisma.recommendation.create({
      data: {
        ...recommendation[0],
      },
    });
    const response = await supertest(app).post(
      `/recommendations/${createRecommendation.id}/downvote`
    );
    expect(response.status).toBe(200);
  });

  it('should return a 404 if the recommendation does not exist', async () => {
    const response = await supertest(app).post('/recommendations/1/downvote');
    expect(response.status).toBe(404);
  });
});

describe('GET /recommendations', () => {
  beforeEach(truncate);
  afterAll(disconnect);

  it('should return 200 and a recommendation array', async () => {
    const recommendation = recommendationsBody();
    await prisma.recommendation.create({
      data: {
        ...recommendation[0],
      },
    });
    const response = await supertest(app).get('/recommendations');
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
  });

  it('given more tan ten recommendations, it should return the top ten', async () => {
    const recommendation = recommendationsBody();
    for (let i = 0; i < 11; i++) {
      await prisma.recommendation.create({
        data: {
          name: faker.name.firstName(),
          youtubeLink: recommendation[0].youtubeLink,
        },
      });
    }
    const response = await supertest(app).get('/recommendations');
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(10);
  });

  it("should return an empty array if there are no recommendations", async () => {
    const response = await supertest(app).get('/recommendations');
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(0);
  });
});

describe('GET /recommendations/:id', () => {
  beforeEach(truncate);
  afterAll(disconnect);

  it('should return 200 and a recommendation', async () => {
    const recommendation = recommendationsBody();
    const createRecommendation = await prisma.recommendation.create({
      data: {
        ...recommendation[0],
      },
    });
    const response = await supertest(app).get(`/recommendations/${createRecommendation.id}`);
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(recommendation[0]);
  });

  it('should return a 404 if the recommendation does not exist', async () => {
    const response = await supertest(app).get('/recommendations/1');
    expect(response.status).toBe(404);
  });

});

describe('GET /recommendations/random', () => {
  beforeEach(truncate);
  afterAll(disconnect);

  it('should return 200 and a recommendation', async () => {
    const recommendation = recommendationsBody();
    await prisma.recommendation.create({
      data: {
        ...recommendation[0],
      },
    });
    const response = await supertest(app).get('/recommendations/random');
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(recommendation[0]);
  });
});

describe('GET /recommendations/top/:amount', () => {
  beforeEach(truncate);
  afterAll(disconnect);

  it('should return 200 and a recommendation', async () => {
    const recommendation = recommendationsBody();
    await prisma.recommendation.create({
      data: {
        ...recommendation[3],
      },
    });
    const response = await supertest(app).get('/recommendations/top/1');
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject([recommendation[3]]);
  });
});
