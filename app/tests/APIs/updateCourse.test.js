const app = require('../../../app.js');
const supertest = require('supertest');
const request = supertest(app);
var { mockRoster, mockCourse, mockUpdateCourse, mockSurvey, mockUpdateSurvey } = require('./mockObjects');
var mysql = require('mysql');
var [ getDbConnection, executeOnDBWithPromise ] = require('../../../API/getDBConnection');

// jest.setTimeout(30000);

console.log("mockRoster", mockRoster);
console.log("mockCourse", mockCourse);
console.log("mockUpdateCourse", mockUpdateCourse);
// expect(mockRoster).toBeDefined();
// expect(mockCourse).toBeDefined();
// expect(mockUpdateCourse).toBeDefined();

/**
 * Testing a create course (with a valid mockUpdateCourse body) for a professor with professor_id: 1 in the URL path
 */

describe('POST /professor/1/course/:courseId/update', function () {
    it('should update the mockCourse from database with mockUpdateCourse succesfully', async (done) => {
		// need to first get the course id for a mock course
		// as we have no way of knowing if there is a course in the database (pre-requisite for course update) with a specific course id
		// which is why we cannot use a hard coded course id

		// delete if the mockCourse already exists
		console.log(`Called API (for responseDelete): /professor/1/course/deletebycode`)
		console.log(`with body ${JSON.stringify({course_code:mockCourse.course_code})}`);
		const responseDelete = await request
									.delete('/professor/1/course/deletebycode')
									.set('Accept', 'application/json')
									.send({course_code:mockCourse.course_code});
		console.log("responseDelete body",responseDelete.body);
		expect(responseDelete.status).toBe(200); // course deleted
		expect(responseDelete.headers['content-type']).toMatch(/json/);
		expect(responseDelete.body.action).toBe("deleted");
		
		// create the mockCourse afresh
		console.log(`Called API (for responseCreate): /professor/1/course/save`)
		console.log(`with body ${JSON.stringify(mockCourse)}`);
		const responseCreate = await request
									.post('/professor/1/course/save')
									.set('Accept', 'application/json')
									.send(mockCourse);

		console.log("responseCreate body",responseCreate.body);
        expect(responseCreate.status).toBe(201) // course created
		expect(responseCreate.headers['content-type']).toMatch(/json/);

		// get Course.course_id for the mockCourse
		let connection = getDbConnection();
		let checkCourseQuery = "SELECT course_id FROM Course C WHERE ?? = ? AND ?? = ?"
		let checkCourseQueryArgs = ['C.professor_id', 1, 'C.course_code', mockCourse.course_code]
		let checkCourseQuerySql = mysql.format(checkCourseQuery, checkCourseQueryArgs)
		let checkCourseResults = await executeOnDBWithPromise(connection, checkCourseQuerySql);
		expect(checkCourseResults).toBeDefined();
		let courseId = checkCourseResults[0].course_id;
		expect(typeof courseId).toBe('number')

		// update the mockCourse
		console.log(`Called API (for responseUpdateCourse): /professor/1/course/${courseId}/update`)
		console.log(`with body ${JSON.stringify(mockUpdateCourse)}`);
		const responseUpdateCourse = await request
									.post(`/professor/1/course/${courseId}/update`)
									.set('Accept', 'application/json')
									.send(mockUpdateCourse);
		console.log("responseUpdateCourse body",responseUpdateCourse.body);
        expect(responseUpdateCourse.status).toBe(200) // course created
		expect(responseUpdateCourse.headers['content-type']).toMatch(/json/);
		expect(responseUpdateCourse.body.action).toBe("updated");
        done();
    });
});