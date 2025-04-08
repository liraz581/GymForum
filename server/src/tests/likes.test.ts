import request from 'supertest';
import app from '../app';
import mongoose from 'mongoose';

describe('Likes API', () => {
    let token: string;
    let postId: string;

    beforeAll(async () => {
        const registerRes = await request(app).post('/auth/register').send({
            username: 'likeUser',
            email: `likeuser${Date.now()}@mail.com`,
            password: 'password123',
        });
        token = registerRes.body.token;

        const postRes = await request(app)
            .post('/posts')
            .set('Authorization', `Bearer ${token}`)
            .field('title', 'Like Test Post')
            .field('description', 'Testing likes');
        postId = postRes.body._id;
    });

    it('should like a post', async () => {
        const res = await request(app)
            .post('/likes')
            .set('Authorization', `Bearer ${token}`)
            .send({ postId });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('message', 'Post liked successfully');
    });

    it('should unlike a post', async () => {
        const res = await request(app)
            .delete('/likes')
            .set('Authorization', `Bearer ${token}`)
            .send({ postId });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('message', 'Like removed successfully');
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });
});
