var express = require("express");
var mysql = require('mysql');
var [ getDbConnection, executeOnDBWithPromise ] = require('./getDBConnection');
var router = express.Router({mergeParams: true});

const saveSurveyController = async function (req, res, next){
    console.log(req.body)
	const courseId = req.params.cid;
	const professorId = req.params.pid;
	const surveyObject = req.body.surveyObject;

    function validatePositiveNumber(n){
		console.log(n);
		console.log(parseInt(n));
        if (typeof(n) == 'number' && n > 0) return true
        else if (typeof(n) == 'string'){
            try{
                return parseInt(n) && parseInt(n) > 0
            }catch{
                return false
            }
        }
        return false
    }
    
    if (!validatePositiveNumber(courseId)){
        return res.status(400).json({
            status:"error",
            error:"Invalid course_id in the url",
            "error_code":"SS1IVCID"
        })
	}
	if (!validatePositiveNumber(professorId)){
        return res.status(400).json({
            status:"error",
            error:"Invalid professor_id in the url",
            "error_code":"SS1IVPID"
        })
	}
	
    if(!(typeof(surveyObject) === 'object' && Array.isArray(surveyObject.questions) && surveyObject.questions.length > 0)){
        return res.status(400).json({
            status:"error",
            error:"Invalid surveyObject in the request body. surveyObject should be a valid object with three properties - questions(array holding at least one question object), deadline(date) and a survey title",
			error_code:"SS1IVPID",
			"received": JSON.stringify(req.body)
        })
	}

	if(!surveyObject.hasOwnProperty('deadline')){
        return res.status(400).json({
            status: "error",
            error: "No deadline property in the `surveyObject` object in request body. Please provide a valid date for the survey deadline.",
            error_code: "SS1IVPID"
        })
	}

    let connection = getDbConnection();

	try{
		// Check if a survey already exists with the same course
		let checkSurveyQuery = "SELECT S.course_id FROM Survey S WHERE ?? = ? AND ?? = ?"
		let checkSurveyQueryArgs = ['S.professor_id', professorId, 'S.course_id', courseId]
		let checkSurveyQuerySql = mysql.format(checkSurveyQuery, checkSurveyQueryArgs)
		let checkSurveyResults = await executeOnDBWithPromise(connection, checkSurveyQuerySql);
		if (checkSurveyResults && checkSurveyResults.length > 0){
			if (checkSurveyResults[0].course_id){
				// survey already exists, delete it
				const deleted = await executeOnDBWithPromise(connection, mysql.format("DELETE FROM Survey WHERE ?? = ?",['course_id', courseId]));
				console.log(`DELETING Survey(for courseId:${courseId})`) // DEBUG
				if (deleted && deleted.affectedRows && deleted.affectedRows == 0){
					return res.status(500).json({
						status: "error",
						error: "Could not delete existing survey",
						error_code: "SS1SQLE"
					});
				}
			}
		}
		// try to create new survey
		try{
			let createSurveyQuery = "INSERT INTO Survey (??) VALUES (?)"
			let createSurveyQueryIdentifiers = [
				'professor_id', 
				'course_id',
				'deadline'
			]
			let createSurveyQueryValues = [ 
				professorId, 
				courseId,
				surveyObject.deadline
			]
			let createSurveyQuerySql = mysql.format(createSurveyQuery, [createSurveyQueryIdentifiers, createSurveyQueryValues]);
			console.log("createSurveyQuerySql", createSurveyQuerySql)
			let surveyCreateResults = await executeOnDBWithPromise(connection, createSurveyQuerySql);
			if (surveyCreateResults && surveyCreateResults.affectedRows > 0){
				// survey created, move on to creating Survey questions using the newly created survey id
				let insertedsurveyId = surveyCreateResults.insertId
				let questionsAsObject = {}
				surveyObject.questions.forEach((v,i) => questionsAsObject[i] = v);
				let createSurveyQuestionsQuery = "INSERT INTO SurveyQuestions (??) VALUES (?)"
				let queryIdentifiers = [
					'survey_id', 
					'question_object'
				]
				let queryValues = [
					insertedsurveyId, 
					// surveyObject.questions
					JSON.stringify(questionsAsObject)
				]
				let querySql = mysql.format(createSurveyQuestionsQuery, [queryIdentifiers, queryValues]);
				console.log("createSurveyQuestionsResults", querySql);
				let createSurveyQuestionsResults = await executeOnDBWithPromise(connection, querySql);
				if (createSurveyQuestionsResults && createSurveyQuestionsResults.affectedRows > 0){
					return res.status(201).json({
						status:"ok",
						survey_id: insertedsurveyId,
						action: "created",
						"result":[],
						"count": -1
					})
				}
				throw Error("Could not create survey");
			}		
			throw Error("No response from server");
		}catch(error){
			return res.status(500).json({
				status:"error",
				error:error.message,
				"errorFull": JSON.stringify(error),
				"error_code":"SS1SQLE"
			})
		}
	}catch(error){
		return res.status(500).json({
			status: "error",
			error: error.message,
			error_code: "SS1UNKE"
		})
	}
}

router.post("/", saveSurveyController);

module.exports = router;
