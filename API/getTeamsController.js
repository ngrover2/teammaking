var express = require("express");
var mysql = require('mysql');
var [ getDbConnection, executeOnDBWithPromise ] = require('./getDBConnection');
var router = express.Router({mergeParams: true});

const getTeamsController = async function(req, res, next){
    const surveyId = req.params.sid;
    if (surveyId == null){
        return res.status(400).json({
            status:"error",
            error:"Invalid survey id in request url"
        })
    }

    let connection = getDbConnection();
    try{
        let getTeamsQuery = "SELECT ST.roster_row_id FROM StudentTeams ST WHERE ?? = ?"
        let getTeamsQueryIdentifiers = ['ST.survey_id']
        let getTeamsQueryValues = [ surveyId ]
        let getTeamsQueryQuerySql = mysql.format(getTeamsQuery, [getTeamsQueryIdentifiers, getTeamsQueryValues])
        let getTeamsQueryResults = await executeOnDBWithPromise(connection, getTeamsQueryQuerySql )
        if (getTeamsQueryResults){
            console.log(getTeamsQueryResults)
            return res.status(200).json({
                status:"ok",
                "result":getTeamsQueryResults,
                "count":getTeamsQueryResults.length
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

router.get("/", getTeamsController);

module.exports = router;