const app = require('../../../app.js');
const supertest = require('supertest');
const request = supertest(app);
var { mockRoster, mockCourse, mockUpdateCourse, mockSurvey, mockUpdateSurvey } = require('./mockObjects');

/**
 * Testing a create course (with a valid mockCourse body) for a professor with professor_id: 1 in the URL path
 */

describe('POST /professor/1/course/save', function () {
    it('should delete the mockCourse from database and recreate it succesfully', async (done) => {
		// delete if the mockCourse already exists
		const responseDelete = await request
									.delete('/professor/1/course/deletebycode')
									.set('Accept', 'application/json')
									.send({course_code:mockCourse.course_code});
		// console.log(responseDelete);
		expect(responseDelete.status).toBe(200); // course deleted
		expect(responseDelete.headers['content-type']).toMatch(/json/);
		expect(responseDelete.body.action).toBe("deleted");
									
		const responseCreate = await request
									.post('/professor/1/course/save')
									.set('Accept', 'application/json')
									.send(mockCourse);
        // console.log(responseCreate);
        expect(responseCreate.status).toBe(201) // course created
		expect(responseCreate.headers['content-type']).toMatch(/json/);
		
        done();
    });
});


/**
 * Testing a create course (with a invalid mockCourse body [here: one with a missing mandatory parameter]) for a professor with professor_id: 1 in the URL path
 */

describe('POST /professor/1/course/save (with empty course_name in body)', function () {
    it('should return a bad request response', async (done) => {
		const responseCreate = await request
									.post('/professor/1/course/save')
									.set('Accept', 'application/json')
									.send(Object.assign({}, mockCourse, {course_name: ""}));
        // console.log(responseCreate);
        expect(responseCreate.status).toBe(400) // bad request
		expect(responseCreate.headers['content-type']).toMatch(/json/);
        done();
    });
});

/**
 * Testing a create course (with a valid mockCourse body but a course_code that already exists and therefore is not allowed) for a professor with professor_id: 1 in the URL path
 */

describe('POST /professor/1/course/save (with a duplicate course_name in body)', function () {
    it('should return a HTTP 403 (forbidden) response', async (done) => {
		// delete if the mockCourse already exists
		const responseDuplicate = await request
									.post('/professor/1/course/save')
									.set('Accept', 'application/json')
									.send(mockCourse);
        // console.log(responseDuplicate);
        expect(responseDuplicate.status).toBe(403) // forbidden
		expect(responseDuplicate.headers['content-type']).toMatch(/json/);
        done();
    });
});