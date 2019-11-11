var express = require("express");
var mysql = require('mysql');
var [ getDbConnection, executeOnDBWithPromise ] = require('./getDBConnection');
var router = express.Router({mergeParams: true});

const getCoursesByProfessorId = async function(req, res, next){
    const professorId = req.params.pid;
    if (professorId == null){
        res.json({
            status:"error",
            error:"professor_id not present in request"
        })
        return res
    }

    let connection = getDbConnection();
    // check courses created by this professor's id
    try{
        getCoursesQuery = "SELECT C.*,R.roster_id FROM Course C LEFT JOIN Roster R USING(course_id) WHERE ?? = ?"
        getCoursesQueryIdentifiers = ['C.professor_id']
        getCoursesQueryValues = [ professorId ]
        getCoursesQuerySql = mysql.format(getCoursesQuery, [getCoursesQueryIdentifiers, getCoursesQueryValues])
        let getCoursesResults = await executeOnDBWithPromise(connection, getCoursesQuerySql )
        if (getCoursesResults){
            res.json({
                status:"ok",
                "result":getCoursesResults,
                "count":getCoursesResults.length
            })
        }else{
            res.json({
                status:"ok",
                "result":[],
                "count":0
            })
        }
    }catch(error){
        res.json({
            status: "error",
            error: error.message,
            "errorFull": JSON.stringify(error),
            "errorCode": "GCP1SQE"
        })
    }finally{
        if (connection && connection.end) connection.end()
    }
}

router.post("/", getCoursesByProfessorId);

module.exports = router;