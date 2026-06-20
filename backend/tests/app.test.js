const request = require('supertest');
const { app, server } = require('../server');

describe('Basic Application Setup', () => {
    afterAll((done) => {
        // Close the server and any pending connections to cleanly exit tests
        if (server && server.listening) {
            server.close(done);
        } else {
            done();
        }
    });

    it('should return 200 on GET /', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
        expect(response.text).toContain('Exam Portal Backend Running');
    });

    it('should return 404 for an unknown route', async () => {
        const response = await request(app).get('/api/this-route-does-not-exist');
        expect(response.status).toBe(404);
    });
});
