import request from 'supertest';
import app from '../app';
import mongoose from 'mongoose';

describe('Comments API', () => {
    let token: string;
    let postId: string;

    beforeAll(async () => {
        const reg = await request(app).post('/auth/register').send({
            username: 'commentUser',
            email: `commentuser${Date.now()}@mail.com`,
            password: 'pass1234',
        });

        token = reg.body.token;

        const post = await request(app)
            .post('/posts')
            .set('Authorization', `Bearer ${token}`)
            .field('title', 'Comment Test')
            .field('description', 'For commenting');

        postId = post.body._id;
    });

    it('should add a comment to a post', async () => {
        const res = await request(app)
            .post(`/api/posts/${postId}/comments`)
            .set('Authorization', `Bearer ${token}`)
            .send({ text: 'Nice post!' });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('comment.text', 'Nice post!');
    });

    it('should get comments for a post', async () => {
        const res = await request(app).get(`/api/posts/${postId}/comments`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });
});
