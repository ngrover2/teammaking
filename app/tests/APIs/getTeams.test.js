const app = require('../../../app');
const supertest = require('supertest');
const request = supertest(app);

/**
 * Testing get teams for a survey with survey_id: 1 in the URL path
 */

describe('GET /professor/1/course/12/survey/2/teams', function () {
    it('respond with teams available for the survey or an empty array otherwise', async (done) => {
        const response = await request.post('/professor/1/course/12/survey/2/teams').set('Accept', 'application/json');
        // console.log(response);
        expect(response.status).toBe(200)
        expect(response.headers['content-type']).toMatch(/json/);
        done();
    });
});