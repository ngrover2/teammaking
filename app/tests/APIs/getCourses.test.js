const app = require('../../../app');
const supertest = require('supertest');
const request = supertest(app);

/**
 * Testing get courses for a professor with professor_id: 1 in the URL path
 */

describe('POST /professor/1/course', function () {
    it('respond with courses available for the professor or an empty array otherwise', async (done) => {
        const response = await request.post('/professor/1/course').set('Accept', 'application/json');
        // console.log(response);
        expect(response.status).toBe(200)
        expect(response.headers['content-type']).toMatch(/json/);
        done();
    });
});

/**
 * Testing get courses for a professor with no professor_id in the URL path
 */
describe('POST /professor/course', function () {
    it('should respond with a 404 Not Found error and response content type should be text/html', async (done) => {
        const response = await request.post('/professor/course').set('Accept', 'application/json');
        expect(response.status).toBe(404);
        expect(response.headers['content-type']).toMatch(/html/);
        done();
    });
});

/**
 * Testing get courses for a professor with an undefined professor_id in the URL path
 */
describe('POST /professor/undefined/course', function () {
    it('should respond with an empty list of courses in the results property of the returned json', async (done) => {
        const response = await request.post('/professor/undefined/course').set('Accept', 'application/json');
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toMatch(/json/);
        expect(response.body.result).toStrictEqual([]);
        expect(response.body.count).toBe(0);
        done();
    });
});