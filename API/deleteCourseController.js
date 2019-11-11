var express = require("express");
var mysql = require('mysql');
var [ getDbConnection, executeOnDBWithPromise ] = require('./getDBConnection');
var router = express.Router({mergeParams: true});

const deleteCourseById = async function(req, res, next){
    const courseId = req.params.cid;
    if (courseId == null){
        res.json({
            status:"error",
            "error":"course_id not present in the url"
        })
        return res
    }
    let connection = getDbConnection();
    try{
        await executeOnDBWithPromise(connection, mysql.format("DELETE FROM Course WHERE ?? = ?",['course_id', courseId]));
        console.log(`DELETING COURSE(id:${courseId})`) // DEBUG
        res.json({
                status:"ok",
                "action":"deleted"
        })
    }catch(error){
        res.json({
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