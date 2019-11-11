var express = require("express");
var mysql = require('mysql');
var [ getDbConnection, executeOnDBWithPromise ] = require('./getDBConnection');
var router = express.Router({mergeParams: true});

const saveCourseForProfessor = async function (req, res, next){
    console.log(`Save course endpoint (${req.url}) called with the following body`)
    console.log(req.body)
    const courseName = req.body.course_name;
    const courseDesc = req.body.course_description;
    const courseCode = req.body.course_code;
    const professorId = req.params.pid;
    var taName = req.body.ta_name;
    var taEmail = req.body.ta_email;
    var startDate = req.body.start_date;
    var endDate = req.body.end_date;
    const classStartTime = req.body.class_start_time;
	const classEndTime = req.body.class_end_time;
    // const startDateMomentObj = startDate ? moment(startDate) : null; // Not required but may be useful in the future
    // const endDateMomentObj = endDate ? moment(endDate) : null; // Not required but may be useful in the future
    // console.log("start_date", moment(startDate)); // Not required but may be useful in the future
	// console.log("Request params", JSON.stringify(req.params)); // DEBUG

    

    // res.json({
    //     status:"ok",
    //     professor_id: professorId, // Hardcoded now, will change later when it is received dynamically
    //     course_code: courseCode,
    //     course_name: courseName,
    //     course_description: courseDesc,
    //     ta_name: taName,
    //     ta_email: taEmail,
    //     start_date: startDate,
    //     end_date: endDate,
    //     class_start_time: classStartTime,
    //     class_end_time: classEndTime
    // }) // DEBUG

    function validateString(s){
        return (typeof(s) == 'string' && s.length > 0)
    }
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
    
    if (!validateString(courseName)){
        return res.status(400).json({
            status:"error",
            error:"course_name should not be empty and should be a valid text(string) value",
            "error_code":"SCFP1CN"
        })
    }
    if(!validateString(courseDesc)){
        courseDesc = "No description provided"
    }
    if(!validateString(courseCode)){
        return res.status(400).json({
            status:"error",
            error:"course_code should not be empty and should be a valid text(string) value",
            "error_code":"SCFP1CC"
        })
    }
    if(!validatePositiveNumber(professorId)){
        return res.status(400).json({
            status:"error",
            error:"professor_id should be a valid positive number(integer)",
            "error_code":"SCFP1PI"
        })
    }

    if(!validateString(taEmail)){
        taEmail = null;
    }
    if(!validateString(taName)){
        taName = null;
    }

    let connection = getDbConnection();
    // check professor exists
    let checkProfessorQuery = "SELECT professor_id FROM Professor P WHERE ?? = ?"
    let checkProfessorQueryIdentifiers = ['P.professor_id']
    let checkProfessorQueryValues = [ professorId ]
    let checkProfessorQuerySql = mysql.format(checkProfessorQuery, [checkProfessorQueryIdentifiers, checkProfessorQueryValues])
    let checkProfessorResults = await executeOnDBWithPromise(connection, checkProfessorQuerySql )
    if (checkProfessorResults){
        if (checkProfessorResults[0]){
            if (!checkProfessorResults[0].professor_id){
                return res.status(400).json({
                    status:"error",
                    error:`professor with professor_id ${professorId} does not exist in the database`,
                    "error_code":"SCFP1PNE"
                })      
            }
        }
    }

    // Check if a course already exists with the same course code
    let checkCourseQuery = "SELECT course_id FROM Course C WHERE ?? = ? AND ?? = ?"
    let checkCourseQueryArgs = ['C.professor_id', professorId, 'C.course_code', courseCode]
    let checkCourseQuerySql = mysql.format(checkCourseQuery, checkCourseQueryArgs)
    let checkCourseResults = await executeOnDBWithPromise(connection, checkCourseQuerySql);
    if (checkCourseResults && checkCourseResults.length > 0){
        if (checkCourseResults[0].course_id){
            return res.status(403).json({
                status:"error",
                error:`A course with the course code:${courseCode} already exists in the database`,
                "error_code":"SCFP1CAE"
            })      
        }
    }

    try{
        let createCourseQuery = "INSERT INTO Course (??) VALUES (?)"
        let createCourseQueryIdentifiers = [
            'professor_id', 
            'course_code', 
            'course_name', 
            'course_desc', 
            'start_date', 
            'end_date', 
            'timings_start', 
            'timings_end',
            'ta_name',
            'ta_email'
        ]
        let createCourseQueryValues = [ 
            professorId, 
            courseCode, 
            courseName, 
            courseDesc, 
            startDate, 
            endDate, 
            classStartTime, 
            classEndTime,
            taName,
            taEmail
        ]
        let createCourseQuerySql = mysql.format(createCourseQuery, [createCourseQueryIdentifiers, createCourseQueryValues]);
        console.log("createCourseQuerySql", createCourseQuerySql)
        let courseCreateResults = await executeOnDBWithPromise(connection, createCourseQuerySql);
        if (courseCreateResults && courseCreateResults.affectedRows > 0){
            return res.status(201).json({
                status:"ok",
                "result":[],
                "count": -1
            })
        }
    }catch(error){
        return res.status(500).json({
            status:"error",
            error:error.message,
            "errorFull": JSON.stringify(error),
            "error_code":"SCFP1CCE"
        })
    }
}

router.post("/", saveCourseForProfessor);

module.exports = router;
