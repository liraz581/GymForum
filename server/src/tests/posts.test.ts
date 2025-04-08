import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app';

describe('Posts API', () => {
    let token: string;

    beforeAll(async () => {
        const res = await request(app).post('/auth/register').send({
            username: 'postUser',
            email: `postuser${Date.now()}@mail.com`,
            password: 'postpass123',
        });

        token = res.body.token;
    });

    it('should require authentication for GET /posts', async () => {
        const res = await request(app).get('/posts');
        expect(res.status).toBe(401);
    });

    it('with token', async () => {
        const res = await request(app).get('/posts').set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
    });

    it('should create a post with title and description', async () => {
        const res = await request(app)
            .post('/posts')
            .set('Authorization', `Bearer ${token}`)
            .field('title', 'Test Post')
            .field('description', 'This is a test post.');

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('title', 'Test Post');
        expect(res.body).toHaveProperty('description', 'This is a test post.');
    });

    it('should fail to create post without title', async () => {
        const res = await request(app)
            .post('/posts')
            .set('Authorization', `Bearer ${token}`)
            .field('description', 'Missing title');

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('message', 'Title and description are required');
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });
});
