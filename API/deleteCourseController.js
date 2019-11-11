var express = require("express");
var mysql = require('mysql');
var [ getDbConnection, executeOnDBWithPromise ] = require('./getDBConnection');
var router = express.Router({mergeParams: true});

const deleteCourseById = async function(req, res, next){
    const courseId = req.params.cid;
    if (courseId == null){
        return res.status(400).json({
            status:"error",
            "error":"course_id not present in the url"
        })
    }
    let connection = getDbConnection();
    try{
        const deleted = await executeOnDBWithPromise(connection, mysql.format("DELETE FROM Course WHERE ?? = ?",['course_id', courseId]));
        console.log(`DELETING COURSE(id:${courseId})`) // DEBUG
        if (deleted){
            console.log(`mysql client response:`, deleted) // DEBUG
            return res.status(200).json({
                status:"ok",
                "action":"deleted"
            })
        }
        else{
            return res.status(500).json({
                status:"error",
                "error":"mysql request did not succed in deleting the course"
            })
        }
    }catch(error){
        return res.status(500).json({
            status:"error",
            "error":error.message
        })
    }finally{
        if (connection && connection.end) connection.end();
        return res
    }
}

router.delete("/", deleteCourseById);

module.exports = router;