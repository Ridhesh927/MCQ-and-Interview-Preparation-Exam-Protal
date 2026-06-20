const request = require('supertest');
const { app, server } = require('../server');
const { pool } = require('../src/config/db');
const { getTestTeacherToken, getTestStudentToken } = require('./helpers/authHelpers');

describe('Auth Routes (/api/auth)', () => {
    afterAll(async () => {
        if (server && server.listening) {
            await new Promise(resolve => server.close(resolve));
        }
        await pool.end();
    });

    describe('POST /api/auth/teacher/login', () => {
        it('should login a teacher with valid credentials', async () => {
            const { email, password } = await getTestTeacherToken();
            const response = await request(app)
                .post('/api/auth/teacher/login')
                .send({ email, password });
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
            expect(response.body.user).toHaveProperty('role', 'teacher');
        });

        it('should reject invalid credentials', async () => {
            const response = await request(app)
                .post('/api/auth/teacher/login')
                .send({ email: 'wrong@test.com', password: 'wrong' });
            expect(response.status).toBe(401);
        });
    });

    describe('POST /api/auth/student/login', () => {
        it('should login a student with valid PRN', async () => {
            const { prn, password } = await getTestStudentToken();
            const response = await request(app)
                .post('/api/auth/student/login')
                .send({ prn_number: prn, password });
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
        });
    });

    describe('Admin Teacher Management', () => {
        it('main admin can create a new teacher', async () => {
            const { token } = await getTestTeacherToken(true); // isMainAdmin = true
            const response = await request(app)
                .post('/api/auth/admin/create-teacher')
                .set('Cookie', [`auth_token=${token}`])
                .send({
                    username: 'New Teacher',
                    email: `new_teacher_${Date.now()}@test.com`,
                    password: 'password123'
                });
            expect(response.status).toBe(201);
            expect(response.body.teacher).toBeDefined();
        });

        it('normal teacher cannot create a new teacher', async () => {
            const { token } = await getTestTeacherToken(false);
            const response = await request(app)
                .post('/api/auth/admin/create-teacher')
                .set('Cookie', [`auth_token=${token}`])
                .send({
                    username: 'New Teacher',
                    email: `new_teacher_${Date.now()}@test.com`,
                    password: 'password123'
                });
            expect(response.status).toBe(403);
        });
    });

    describe('Admin Student Management', () => {
        it('teacher can create a new student', async () => {
            const { token } = await getTestTeacherToken(false);
            const response = await request(app)
                .post('/api/auth/admin/create-student')
                .set('Cookie', [`auth_token=${token}`])
                .send({
                    username: 'New Student',
                    email: `new_student_${Date.now()}@test.com`,
                    password: 'password123',
                    prn_number: `PRN_NEW_${Date.now()}`
                });
            expect(response.status).toBe(201);
        });
    });
});
