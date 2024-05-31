const request = require('supertest');
const express = require('express');
const authRoutes = require('../routes/authRoutes');
const app = express();

app.use(express.json());
app.use('/', authRoutes);

describe('POST /register', () => {
    it('should create a new user', async () => {
        const res = await request(app)
            .post('/register')
            .send({
                username: 'testuser',
                email: 'testuser@example.com',
                password: 'Testpassword1!'
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message', 'User created');
    });

    it('should not create a user with the same email', async () => {
        const res = await request(app)
            .post('/register')
            .send({
                username: 'testuser2',
                email: 'testuser@example.com',
                password: 'Testpassword1!'
            });
        expect(res.statusCode).toEqual(400);
    });
});

describe('POST /login', () => {
    it('should login an existing user', async () => {
        const res = await request(app)
            .post('/login')
            .send({
                username: 'testuser',
                password: 'Testpassword1!'
            });
        expect(res.statusCode).toEqual(200);
    });

    it('should not login non-existent user', async () => {
        const res = await request(app)
            .post('/login')
            .send({
                username: 'nonexistentuser',
                password: 'Testpassword1!'
            });
        expect(res.statusCode).toEqual(401);
    });
});