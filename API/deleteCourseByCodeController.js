var express = require("express");
var mysql = require('mysql');
var [ getDbConnection, executeOnDBWithPromise ] = require('./getDBConnection');
var router = express.Router({mergeParams: true});

const deleteCourseByCode = async function(req, res, next){
    const courseCode = req.body.course_code;
    if (courseCode == null){
        res.status(400).json({
            status:"error",
            "error":"course_code not present in the body"
        })
        return res
    }
    let connection = getDbConnection();
    try{
        const deleted = await executeOnDBWithPromise(connection, mysql.format("DELETE FROM Course WHERE ?? = ?",['course_code', courseCode]));
        console.log(`DELETING COURSE(name:${courseCode})`) // DEBUG
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
                "action":"error"
            })
        }
    }catch(error){
        return res.status(500).json({
            status:"error",
            "error":error.message
        })
    }finally{
        if (connection && connection.end) connection.end();
    }
}

router.delete("/", deleteCourseByCode);

module.exports = router;