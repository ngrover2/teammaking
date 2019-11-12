const app = require('../../../app.js');
const supertest = require('supertest');
const request = supertest(app);
var { mockRoster, mockCourse, mockUpdateCourse, mockSurvey, mockUpdateSurvey } = require('./mockObjects');

var mysql = require('mysql');
var [ getDbConnection, executeOnDBWithPromise ] = require('../../../API/getDBConnection');

/**
 * Testing a create course (with a valid mockCourse body) for a professor with professor_id: 1 in the URL path
 */

describe('POST /professor/1/course/:courseId/survey/save AND /professor/1/course/:courseId/survey/:createdSurveyId/update', function () {
    it('should create survey for mockCourse using mockeSurvey and update it using mockUpdateSurvey', async (done) => {
		// delete if the mockCourse already exists
		const responseDelete = await request
									.delete('/professor/1/course/deletebycode')
									.set('Accept', 'application/json')
									.send({course_code:mockCourse.course_code});
		// console.log(responseDelete);
		expect(responseDelete.status).toBe(200); // course deleted
		expect(responseDelete.headers['content-type']).toMatch(/json/);
		expect(responseDelete.body.action).toBe("deleted");
		
		//create the mockCourse and get the course_id
		const responseCreate = await request
									.post('/professor/1/course/save')
									.set('Accept', 'application/json')
									.send(mockCourse);
        // console.log(responseCreate);
        expect(responseCreate.status).toBe(201) // course created
		expect(responseCreate.headers['content-type']).toMatch(/json/);

		// use the course_id from the newly created mockCourse
		let connection = getDbConnection();
		let checkCourseQuery = "SELECT course_id FROM Course C WHERE ?? = ? AND ?? = ?"
		let checkCourseQueryArgs = ['C.professor_id', 1, 'C.course_code', mockCourse.course_code]
		let checkCourseQuerySql = mysql.format(checkCourseQuery, checkCourseQueryArgs)
		let checkCourseResults = await executeOnDBWithPromise(connection, checkCourseQuerySql);
		expect(checkCourseResults).toBeDefined();
		let courseId = checkCourseResults[0].course_id;
		expect(typeof courseId).toBe('number');

		// delete the survey if it exists using the course_id
		let checkSurveyQuery = "SELECT S.course_id FROM Survey S WHERE ?? = ? AND ?? = ?"
		let checkSurveyQueryArgs = ['S.professor_id', 1 , 'S.course_id', courseId];
		let checkSurveyQuerySql = mysql.format(checkSurveyQuery, checkSurveyQueryArgs)
		let checkSurveyResults = await executeOnDBWithPromise(connection, checkSurveyQuerySql);
		expect(checkSurveyResults).toBeDefined();
		if (checkSurveyResults && checkSurveyResults.length > 0){
			if (checkSurveyResults[0].course_id){
				// survey already exists, delete it
				const deleted = await executeOnDBWithPromise(connection, mysql.format("DELETE FROM Survey WHERE ?? = ?",['course_id', courseId]));
				expect(deleted).toBeDefined();
				expect(deleted.affectedRows).toBeGreaterThan(0);
			}
		}

		// create the survey and get the survey_id
		const responseCreateSurvey = await request
									.post(`/professor/1/course/${courseId}/survey/save`)
									.set('Accept', 'application/json')
									.send(mockSurvey);
		console.log("responseCreateSurvey", responseCreateSurvey); // DEBUG
		expect(responseCreateSurvey).toBeDefined();
		expect(responseCreateSurvey.headers['content-type']).toMatch(/json/);
		expect(responseCreateSurvey.status).toBe(201) // survey created
		let createdSurveyId = responseCreateSurvey.body.survey_id;
		expect(createdSurveyId).toBeDefined();
		expect(createdSurveyId).toBeGreaterThan(0);

		// update the survey using the survey_id
		const responseUpdateSurvey = await request
									.post(`/professor/1/course/${courseId}/survey/${createdSurveyId}/update`)
									.set('Accept', 'application/json')
									.send(mockUpdateSurvey);
		console.log("responseUpdateSurvey", responseUpdateSurvey); // DEBUG
		expect(responseUpdateSurvey).toBeDefined();
		expect(responseUpdateSurvey.headers['content-type']).toMatch(/json/);
		expect(responseUpdateSurvey.status).toBe(200) // survey updated
		
        done();
    });
});

