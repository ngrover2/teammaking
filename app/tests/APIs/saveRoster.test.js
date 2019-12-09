const app = require('../../../app');
const supertest = require('supertest');
const request = supertest(app);
var mysql = require('mysql');
var [ getDbConnection, executeOnDBWithPromise ] = require('../../../API/getDBConnection');
var { mockRoster, mockCourse, mockUpdateCourse, mockSurvey, mockUpdateSurvey } = require('./mockObjects');

/**
 * Testing a save roster (with a valid mockRoster body) for a professor with professor_id: 1 in the URL path
 */

describe('POST /professor/1/course/:courseId/roster/save', function () {
    it('should delete existing roster for the course from database and save the new roster succesfully', async (done) => {
		// need to first get the course id for a mock course
		// as we have no way of knowing if there is a course in the database (pre-requisite) with a specific course id
		// which is why we cannot use a hard coded course id

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

		// get Course.course_id for the mockCourse

		let connection = getDbConnection();
		let checkCourseQuery = "SELECT course_id FROM Course C WHERE ?? = ? AND ?? = ?"
		let checkCourseQueryArgs = ['C.professor_id', 1, 'C.course_code', mockCourse.course_code]
		let checkCourseQuerySql = mysql.format(checkCourseQuery, checkCourseQueryArgs)
		let checkCourseResults = await executeOnDBWithPromise(connection, checkCourseQuerySql);
		expect(checkCourseResults).toBeDefined()
		
		let courseId = checkCourseResults[0].course_id;
		expect(typeof courseId).toBe('number')

		const rosterCreateResponse = await request
									.post(`/professor/1/course/${courseId}/roster/save`)
									.set('Accept', 'application/json')
									.send(mockRoster);
		// console.log(rosterCreateResponse);
		expect(rosterCreateResponse.status).toBe(201); // roster created
		expect(rosterCreateResponse.headers['content-type']).toMatch(/json/);
		expect(rosterCreateResponse.body.status).toBe("ok");
        done();
    });
});


