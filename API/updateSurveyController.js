var express = require("express");
var mysql = require('mysql');
var [ getDbConnection, executeOnDBWithPromise ] = require('./getDBConnection');
var router = express.Router({mergeParams: true});

const updateSurveyController = async function (req, res, next){
    console.log(req.body)
	const courseId = req.params.cid;
	const surveyId = req.params.sid;
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
	
    if(!(typeof(surveyObject) === 'object' && Array.isArray(surveyObject.questions) && surveyObject.questions.length > 0)){
        return res.status(400).json({
            status:"error",
            error:"Invalid surveyObject in the request body. surveyObject should be a valid object with three properties - questions(array holding at least one question object), deadline(date) and a survey title",
            "error_code":"SS1IVPID"
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
		// Check if a survey exists with the surveyId received
		let checkSurveyQuery = "SELECT S.course_id FROM Survey S WHERE ?? = ? AND ?? = ?"
		let checkSurveyQueryArgs = ['S.survey_id', surveyId, 'S.course_id', courseId]
		let checkSurveyQuerySql = mysql.format(checkSurveyQuery, checkSurveyQueryArgs)
		let checkSurveyResults = await executeOnDBWithPromise(connection, checkSurveyQuerySql);
		if (checkSurveyResults && checkSurveyResults.length > 0){
			if (checkSurveyResults[0].course_id){
                // survey exists, update it
                let questionsAsObject = {}
				surveyObject.questions.forEach((v,i) => questionsAsObject[i] = v);
				let updateSurveyQuery = "Update SurveyQuestions SET ?? = ? where ?? = ?"
                let updateSurveyQueryArguments = [
                    'question_object',
                    JSON.stringify(questionsAsObject),
                    'survey_id',
                    surveyId
                ]
                let updateSurveyDeadlineQuery = "Update Survey SET ?? = ? where ?? = ?"
                let updateSurveyDeadlineArguments = [
                    'deadline',
                    surveyObject.deadline,
                    'survey_id',
                    surveyId
                ]
                let updateSurveyQuerySql = mysql.format(updateSurveyQuery, updateSurveyQueryArguments);
                console.log("updateSurveyQuerySql", updateSurveyQuerySql);
                let updateSurveyDeadlineSql = mysql.format(updateSurveyDeadlineQuery, updateSurveyDeadlineArguments);
                console.log("updateSurveyDeadlineSql", updateSurveyDeadlineSql);
                let surveyUpdateResults = await executeOnDBWithPromise(connection, updateSurveyQuerySql);
                let updateDeadlineResults = await executeOnDBWithPromise(connection, updateSurveyDeadlineSql);
                if (surveyUpdateResults && updateDeadlineResults && surveyUpdateResults.affectedRows > 0 && updateDeadlineResults.affectedRows > 0){
                    return res.status(200).json({
                        status: "ok",
                        action: "updated",
                        result: []
                    });
                }
                throw Error("Survey could not be updated")
			}
        }
        throw Error(`Survey does not exist with survey id : ${surveyId}`)
	}catch(error){
		return res.status(500).json({
			status: "error",
            error: error.message,
            errorFull: JSON.stringify(error),
			error_code: "SS1UNKE"
		})
	}
}

router.post("/", updateSurveyController);

module.exports = router;
