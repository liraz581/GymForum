import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app';

afterAll(async () => {
    await mongoose.disconnect();
});

describe('POST /auth/register', () => {
    it('should register a new user', async () => {
        const response = await request(app)
            .post('/auth/register')
            .send({
                username: 'testuser',
                email: `test${Date.now()}@mail.com`,
                password: 'password123',
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('token');
        expect(response.body).toHaveProperty('user');
        expect(response.body.user).toHaveProperty('email');
    });

    it('should fail with missing fields', async () => {
        const response = await request(app)
            .post('/auth/register')
            .send({ email: 'invalid@mail.com' });

        expect(response.status).toBe(400);
    });
});

describe('GET /auth/me', () => {
    let token: string;

    beforeAll(async () => {
        const email = `meuser${Date.now()}@mail.com`;
        const password = 'password456';

        // Register and get token
        const res = await request(app).post('/auth/register').send({
            username: 'meUser',
            email,
            password,
        });

        token = res.body.token;
    });

    it('should return current user with valid token', async () => {
        const response = await request(app)
            .get('/auth/me')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('username', 'meUser');
    });

    it('should return 401 if token is missing', async () => {
        const response = await request(app).get('/auth/me');
        expect(response.status).toBe(401);
    });
});

