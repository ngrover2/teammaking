var express = require("express");
var mysql = require('mysql');
var [ getDbConnection, executeOnDBWithPromise ] = require('./getDBConnection');
var router = express.Router({mergeParams: true});

const deleteRoster = async function(req, res, next){
    console.log(req.body); //DEBUG
	const courseCode = req.body.course_code
	const professorId = req.body.professor_id
	
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
    
    let connection = null;

	try{
		try {
			connection = getDbConnection();
		}catch(error){
			return res.status(500).json({
				status:"error",
				error: `There seems to be problem with our database at this time. Please try again later.`,
				errorCode:"SRFC1DBCON"
			});
		}

		if(!validateString(courseCode)){
            return res.status(400).json({
                status:"error",
                error:"Invalid couse_code should not be empty",
                "error_code":"DR1IVCC"
            })
		}

		if(!validatePositiveNumber(professorId)){
			return res.status(400).json({
				status:"error",
				error:`professor_id should be a valid positive number(integer), received:${professorId}`,
				"error_code":"DR1IVPI"
			})
		}

		let checkCourseQuery = "SELECT course_id FROM Course C WHERE ?? = ? AND ?? = ?"
		let checkCourseQueryArgs = ['C.professor_id', professorId, 'C.course_code', courseCode]
		let checkCourseQuerySql = mysql.format(checkCourseQuery, checkCourseQueryArgs)
		let checkCourseResults = await executeOnDBWithPromise(connection, checkCourseQuerySql);
		if (checkCourseResults && checkCourseResults.length > 0){
			let courseId = checkCourseResults[0].course_id;
			if (courseId && courseId > 0){
				const deleted = await executeOnDBWithPromise(connection, mysql.format("DELETE FROM Roster WHERE ?? = ?",['course_id', courseId]));
				console.log(`DELETING Roster for Course Code:${courseCode}`) // DEBUG
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
			}
		}else{
			return res.status(200).json({
				status:"ok",
				"action":"roster does not exist already"
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

	
		
		if (roster_id){
			console.log("ROSTER EXISTS, DELETING")
			await executeOnDBWithPromise(connection, mysql.format("DELETE FROM Roster WHERE ?? = ?",['roster_id', roster_id]));
			await executeOnDBWithPromise(connection, mysql.format("DELETE FROM RosterHeaderRow WHERE ?? = ?",['roster_id', roster_id]));
		}
}

router.delete("/", deleteRoster);

module.exports = router;