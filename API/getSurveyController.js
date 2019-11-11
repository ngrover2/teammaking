var express = require("express");
var mysql = require('mysql');
var [ getDbConnection, executeOnDBWithPromise ] = require('./getDBConnection');
var router = express.Router({mergeParams: true});

const getSurveyController = async function(req, res, next){
    const surveyId = req.params.sid;
    if (surveyId == null){
        return res.status(400).json({
            status:"error",
            error:"Invalid survey id in request url"
        })
    }

    let connection = getDbConnection();
    try{
        let getSurveyQuery = "SELECT SQ.question_object FROM SurveyQuestions SQ WHERE ?? = ?"
        let getSurveyQueryIdentifiers = ['SQ.survey_id']
        let getSurveyQueryValues = [ surveyId ]
        let getSurveyQueryQuerySql = mysql.format(getSurveyQuery, [getSurveyQueryIdentifiers, getSurveyQueryValues])
        let getSurveyQueryResults = await executeOnDBWithPromise(connection, getSurveyQueryQuerySql )
        if (getSurveyQueryResults){
            return res.status(200).json({
                status:"ok",
                "result":getSurveyQueryResults,
                "count":getSurveyQueryResults.length
            })
        }else{
            return res.status(200).json({
                status:"ok",
                "result":[],
                "count":0
            })
        }
    }catch(error){
        return res.status(500).json({
            status: "error",
            error: error.message,
            "errorFull": JSON.stringify(error),
            "errorCode": "GS1SQE"
        })
    }finally{
        if (connection && connection.end) connection.end()
    }
}

router.get("/", getSurveyController);

module.exports = router;