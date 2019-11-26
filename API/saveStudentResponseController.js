var express = require("express");
var mysql = require('mysql');
var [ getDbConnection, executeOnDBWithPromise ] = require('./getDBConnection');
var router = express.Router({mergeParams: true});

const saveStudentResponse = async function (req, res, next){
   
    const surveyID = req.body.surveyID;
    const studentID = req.body.studentID;
    const studentResponse = req.body;
    console.log(surveyID);
    console.log(studentID);
    console.log(studentResponse);
    return res.status(201).json({
        status:"created",
    });
}

router.post("/", saveStudentResponse);

module.exports = router;