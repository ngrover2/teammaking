var express = require("express");
var mysql = require('mysql');
var [ getDbConnection, executeOnDBWithPromise ] = require('./getDBConnection');
var router = express.Router({mergeParams: true});

const updateCourseById = async function(req, res, next){
    const courseId = req.params.cid;
    const courseName = req.body.course_name;
    const courseDesc = req.body.course_description;
    const courseCode = req.body.course_code;
    const professorId = req.params.pid;
    const taName = req.body.ta_name;
    const taEmail = req.body.ta_email;
    const startDate = req.body.start_date;
    const endDate = req.body.end_date;
    const classStartTime = req.body.class_start_time;
    const classEndTime = req.body.class_end_time;

    if (courseId == null){
        res.json({
            status:"error",
            "error":"course_id not present in the url"
        })
        return res
    }

    function validateString(s){
        return (typeof(s) == 'string' && s.length > 0)
    }
    function validatePositiveNumber(n){
        if (typeof(n) == 'number' && n > 0) return true
        else if (typeof(n) == 'string'){
            try{
                return parseInt(n) && parseInt(n) > 0
            }catch{
                return false
            }
        }
    }
    
    if (!validateString(courseName)){
        res.json({
            status:"error",
            error:"course_name should be a valid text(string) value",
            "error_code":"SCFP1CN"
        })
        return res
    }
    if(!validateString(courseDesc)){
        res.json({
            status:"error",
            error:"course_description should not be empty and be a valid text(string) value",
            "error_code":"SCFP1CD"
        })
        return res
    }
    if(!validateString(courseCode)){
        res.json({
            status:"error",
            error:"course_code should not be empty and be a valid text(string) value",
            "error_code":"SCFP1CC"
        })
        return res
    }
    if(!validatePositiveNumber(professorId)){
        res.json({
            status:"error",
            error:`professor_id should be a valid positive number(integer), received:${professorId}`,
            "error_code":"SCFP1PI"
        })
        return res
    }
    if(!validateString(taEmail)){
        res.json({
            status:"error",
            error:"ta_email should not be empty and be a valid email value",
            "error_code":"SCFP1TE"
        })
        return res
    }
    if(!validateString(taName)){
        res.json({
            status:"error",
            error:"ta_name should not be empty and be a valid text(string) value",
            "error_code":"SCFP1TN"
        })
        return res
    }

    let connection = getDbConnection();

    // Check if a course already exists with the same course code
    checkCourseQuery = "SELECT course_id FROM Course C WHERE ?? = ? AND ?? = ?"
    checkCourseQueryArgs = ['C.professor_id', professorId, 'C.course_code', courseCode]
    checkCourseQuerySql = mysql.format(checkCourseQuery, checkCourseQueryArgs)
    let checkCourseResults = await executeOnDBWithPromise(connection, checkCourseQuerySql);
    if (checkCourseResults && checkCourseResults.length > 0){
        if (checkCourseResults[0].course_id){
            try{
                createCourseQuery = "UPDATE Course SET ?? = ? , ?? = ? , ?? = ? , ?? = ? , ?? = ? , ?? = ? , ?? = ? , ?? = ? , ?? = ? , ?? = ? WHERE ?? = ?"
                createCourseQueryArgs = [
                    'professor_id', 
                    professorId, 
                    'course_code', 
                    courseCode, 
                    'course_name', 
                    courseName, 
                    'course_desc', 
                    courseDesc, 
                    'start_date', 
                    startDate, 
                    'end_date', 
                    endDate, 
                    'timings_start', 
                    classStartTime, 
                    'timings_end',
                    classEndTime,
                    'ta_name',
                    taName,
                    'ta_email',
                    taEmail,
                    'course_id',
                    courseId,
                ]
                createCourseQuerySql = mysql.format(createCourseQuery, createCourseQueryArgs);
                console.log("createCourseQuerySql", createCourseQuerySql);
                let courseCreateResults = await executeOnDBWithPromise(connection, createCourseQuerySql);
                if (courseCreateResults && courseCreateResults.affectedRows > 0){
                    res.json({
                        status:"ok",
                        "result":[],
                        "count": -1,
                        "action":"updated"
                    })
                    return res
                }
            }catch(error){
                res.json({
                    status:"error",
                    error:error.message,
                    "errorFull": JSON.stringify(error),
                    "error_code":"SCFP1CCE"
                })
                return res
            }
        
            
        }else{
            res.json({
                status:"error",
                error:`The course with the course code:${courseCode} does not exist in the database`,
                "error_code":"SCFP1CNE"
            })  
            return res    
        }
    }
}

router.post("/", updateCourseById);

module.exports = router;