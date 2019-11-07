var express = require("express");
var mysql = require('mysql');
var app = express();
var cors = require('cors');
var { resolve, reject } =  Promise;
var moment = require("moment");


app.use(cors({
    origin: 'http://localhost:8080'
  }));
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.listen(3000, () => {
 console.log("Server running on port 3000");
});


const executeOnDBWithPromise = (connection, query) => {
    try{
        queryPromise = new Promise((resolve, reject) => {
                            connection.query(
                                query,
                                function (err, rows, fields) {
                                        if (err) {
                                            reject(err.message)
                                        }else if (rows){
                                            resolve(rows)
                                        }
                                }
                            )
        })
        return queryPromise;
    }catch(error){
        throw error
    }
}

const getDbConnection = () => {
    var getConnection = mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'password',
        database: 'teammaking'}
    )
    return getConnection
}

const saveCourseForProfessor = async function (req, res, next){
    const courseName = req.body.course_name;
    const courseDesc = req.body.course_description;
    const courseCode = req.body.course_code;
    const professorId = req.params.pid;
    var taName = req.body.ta_name;
    var taEmail = req.body.ta_email;
    var startDate = req.body.start_date;
    var endDate = req.body.end_date;
    // const startDateMomentObj = startDate ? moment(startDate) : null; // Not required but may be useful in the future
    // const endDateMomentObj = endDate ? moment(endDate) : null; // Not required but may be useful in the future
    const classStartTime = req.body.class_start_time;
    const classEndTime = req.body.class_end_time;

    // console.log("start_date", moment(startDate)); // Not required but may be useful in the future

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
        return res.json({
            status:"error",
            error:"course_name should not be empty and should be a valid text(string) value",
            "error_code":"SCFP1CN"
        })
    }
    if(!validateString(courseDesc)){
        courseDesc = "No description provided"
    }
    if(!validateString(courseCode)){
        return res.json({
            status:"error",
            error:"course_code should not be empty and should be a valid text(string) value",
            "error_code":"SCFP1CC"
        })
    }
    if(!validatePositiveNumber(professorId)){
        return res.json({
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
    checkProfessorQuery = "SELECT professor_id FROM Professor P WHERE ?? = ?"
    checkProfessorQueryIdentifiers = ['P.professor_id']
    checkProfessorQueryValues = [ professorId ]
    checkProfessorQuerySql = mysql.format(checkProfessorQuery, [checkProfessorQueryIdentifiers, checkProfessorQueryValues])
    let checkProfessorResults = await executeOnDBWithPromise(connection, checkProfessorQuerySql )
    if (checkProfessorResults){
        if (checkProfessorResults[0]){
            if (!checkProfessorResults[0].professor_id){
                res.json({
                    status:"error",
                    error:`professor with professor_id ${professorId} does not exist in the database`,
                    "error_code":"SCFP1PNE"
                })      
            }
        }
    }

    // Check if a course already exists with the same course code
    checkCourseQuery = "SELECT course_id FROM Course C WHERE ?? = ? AND ?? = ?"
    checkCourseQueryArgs = ['C.professor_id', professorId, 'C.course_code', courseCode]
    checkCourseQuerySql = mysql.format(checkCourseQuery, checkCourseQueryArgs)
    let checkCourseResults = await executeOnDBWithPromise(connection, checkCourseQuerySql);
    if (checkCourseResults && checkCourseResults.length > 0){
        if (checkCourseResults[0].course_id){
            res.json({
                status:"error",
                error:`A course with the course code:${courseCode} already exists in the database`,
                "error_code":"SCFP1CAE"
            })      
            return res
        }
    }

    try{
        createCourseQuery = "INSERT INTO Course (??) VALUES (?)"
        createCourseQueryIdentifiers = [
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
        createCourseQueryValues = [ 
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
        createCourseQuerySql = mysql.format(createCourseQuery, [createCourseQueryIdentifiers, createCourseQueryValues]);
        console.log("createCourseQuerySql", createCourseQuerySql)
        let courseCreateResults = await executeOnDBWithPromise(connection, createCourseQuerySql);
        if (courseCreateResults && courseCreateResults.affectedRows > 0){
            res.json({
                status:"ok",
                "result":[],
                "count": -1
            })
        }
    }catch(error){
        res.json({
            status:"error",
            error:error.message,
            "errorFull": JSON.stringify(error),
            "error_code":"SCFP1CCE"
        })
    }
}

const saveCSV = async function(req, res, next){
    // console.log(JSON.stringify(req.body)); //DEBUG
    const professor_id = req.params.pid;
    const course_id = req.params.cid;
    const header = req.body.header_row;
    const data_rows = req.body.data_rows;

    function validatePositiveNumber(n){
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
    // console.log(header); // DEBUG
    // console.log(data_rows) // DEBUG
    let connection = null;
    try{
        connection = getDbConnection();
    }catch(error){
        return res.json({
            status:"error",
            error: `There seems to be problem with our database at this time. Please try again later.`,
            errorCode:"SRFC1DBCON"
        });
    }
    

    try{
        if(!validatePositiveNumber(professor_id)){
            return res.json({
                status:"error",
                error:"Invalid professor_id received from request.\nprofessor_id should not be empty and should be a valid positive number(integer)",
                "error_code":"SRFC1IVPID"
            })
        }
        if(!validatePositiveNumber(course_id)){
            return res.json({
                status:"error",
                error:"Invalid course_id received from request.\ncourse_id should not be empty and should be a valid positive number(integer)",
                "error_code":"SRFC1IVCID"
            })
        }

        if (!Array.isArray(header) || !Array.isArray(data_rows)){
            return res.json({
                status: "error",
                error: "header_row and data_rows should to be non-empty arrays"
            })
        }else{
            // check header length
            if (header.length < 1){
                return res.json({
                    status: "error",
                    error: "header_row cannot be empty"
                })    
            }
            // check data length
            if (data_rows.length < 1){
                return res.json({
                    status: "error",
                    error: "data_rows cannot be empty"
                })    
            }
            // check header and column count validity
            if (header.length != data_rows[0].length){
                return res.json({
                    status: "error",
                    error: "header_row column count and data_rows column count does not match"
                })
            }

            
            var roster_id = null;

            // Get RosterId for the professor
            // getRosterQueryString = "SELECT R.roster_id, C.course_id, P.professor_id FROM Professor P LEFT JOIN Roster R USING (professor_id) LEFT JOIN Course C USING (professor_id) WHERE ?? = ? AND ?? = ?"
            getRosterQueryString = "SELECT R.roster_id FROM Roster R WHERE ?? = ? AND ?? = ?"
            getRosterQueryArgs = ['R.professor_id' , professor_id , 'R.course_id', course_id];
            getRosterSqlQuery = mysql.format(getRosterQueryString, getRosterQueryArgs);
            // console.log("getRosterSqlQuery", getRosterSqlQuery);

            try{
                queryResult = await executeOnDBWithPromise(connection, getRosterSqlQuery);
                if (queryResult){
                    // console.log(queryResult[0]) // DEBUG
                    if (queryResult.length > 0){
                        let resultObj = queryResult[0];
                        roster_id = resultObj.roster_id
                        if (roster_id){
                            console.log("ROSTER EXISTS, DELETING")
                            await executeOnDBWithPromise(connection, mysql.format("DELETE FROM Roster WHERE ?? = ?",['roster_id', roster_id]));
                            await executeOnDBWithPromise(connection, mysql.format("DELETE FROM RosterHeaderRow WHERE ?? = ?",['roster_id', roster_id]));
                        }
                    }else{
                        console.log("NO EXISTING ROSTER DETECTED, WILL CREATE NEW")
                    }
                    // create roster id
                    console.log("CREATING NEW ROSTER") // DEBUG
                    let createNewRosterQuery = "INSERT INTO Roster (??) VALUES (?)"
                    let rosterFieldIdentifiers = [ 'professor_id', 'course_id' ]
                    let rosterFieldValues = [ professor_id, course_id ]
                    console.log("CraeteRosterSqlQuery", mysql.format(createNewRosterQuery,[rosterFieldIdentifiers, rosterFieldValues])); // DEBUG
                    let createRosterResults = await executeOnDBWithPromise(connection, mysql.format(createNewRosterQuery,[rosterFieldIdentifiers, rosterFieldValues]));
                    if (!createRosterResults){
                        throw new Error("Roster could not be created due to a database error. We have logged your request and will investigate the error. If you want to provide any details that could help us, please write an email to teammakingsupport@email.com")
                    }else{
                        // console.log(`Created roster with id: ${createRosterResults.insertId}`)
                        if (!createRosterResults.insertId){
                            throw new Error("Roster could not be created due to a database error. We have logged your request and will investigate the error. If you want to provide any details that could help us, please write an email to teammakingsupport@email.com")
                        }
                        roster_id = createRosterResults.insertId
                        
                        // insert the header in db
                        
                        // create query to insert header
                        headerQuery = `INSERT INTO RosterHeaderRow (??) VALUES(?)`
                        colNames = ['roster_id' , 'course_id']
                        colValues = [roster_id, course_id]
                        for (let i = 1; i <= 10; i++){
                            if (header[i-1] && header[i-1].name){
                                colNames.push(`col${i}_name`)
                                colValues.push(header[i-1].name);
                            }else{
                                continue
                            }
                        }
                        insertHeaderSqlQuery = mysql.format(headerQuery, [colNames, colValues]);
                        console.log("insertHeaderSqlQuery", insertHeaderSqlQuery);

                        // create query to insert rows in RosterRow, this will generate row ids
                        rowsQuery = `INSERT INTO RosterRow (??) VALUES ?`
                        colNames = ['roster_id' , 'course_id', 'professor_id']
                        colValues = [roster_id, course_id, professor_id]
                        allValues = []
                        for (let i=0; i<data_rows.length;i++){
                            allValues.push(colValues)
                        }
                        // console.log(allValues);
                        
                        insertRowsSqlQuery = mysql.format(rowsQuery, [colNames, allValues]);
                        console.log("insertRowsSqlQuery", insertRowsSqlQuery); //DEBUG
                        
                        headerResults = await executeOnDBWithPromise(connection, insertHeaderSqlQuery)
                        // console.log("headerResults", headerResults);
                        if (headerResults.affectedRows == 1){ // header has been created
                            rowResults = await executeOnDBWithPromise(connection, insertRowsSqlQuery)
                            if (rowResults){ // rows have been inserted
                                // get ids of inserted rows
                                console.log("getRowIds",mysql.format("SELECT roster_row_id FROM RosterRow where roster_id = ? AND course_id = ?", [roster_id, course_id])); // DEBUG
                                rosterRowIds = await executeOnDBWithPromise(connection, mysql.format("SELECT roster_row_id FROM RosterRow where roster_id = ? AND course_id = ?", [roster_id, course_id]))

                                if (rosterRowIds){
                                    var rosterRowIdArray = []
                                    rosterRowIds.map((v) => {
                                        rosterRowIdArray.push(v.roster_row_id)
                                        return v
                                    })

                                    // for each rosterRowId, insert the correpsonding data
                                    for (let i=0; i < data_rows.length;i++){
                                        if (!data_rows[i]) continue
                                        insertedRosterRowId = rosterRowIdArray[i]
                                        colNames = ['value','roster_row_id']
                                        let col1Vals = []
                                        let col2Vals = []
                                        let col3Vals = []
                                        let col4Vals = []
                                        let col5Vals = []
                                        if(header[0].multi){
                                            console.log(`row${i} 0: `, data_rows[i][0].split(",")) // DEBUG
                                            data_rows[i][0].split(",").forEach(element => {
                                                col1Vals.push([element.replace(/^\s+|\s+$/g, '') , insertedRosterRowId])
                                            });
                                        }else{
                                            let col1Data = data_rows[i][0]
                                            col1Vals.push([col1Data , insertedRosterRowId])
                                        }
                                        if(header[1].multi){
                                            // console.log(`row${i} 1: `, data_rows[i][0]) // DEBUG
                                            data_rows[i][1].split(",").forEach(element => {
                                                col2Vals.push([element.replace(/^\s+|\s+$/g, '') , insertedRosterRowId])
                                            });
                                        }else{
                                            let col2Data = data_rows[i][1]
                                            col2Vals.push([col2Data , insertedRosterRowId])
                                        }
                                        if(header[2].multi){
                                            data_rows[i][2].split(",").forEach(element => {
                                                col3Vals.push([element.replace(/^\s+|\s+$/g, '') , insertedRosterRowId])
                                            });
                                        }else{
                                            let col3Data = data_rows[i][2]
                                            col3Vals.push([col3Data , insertedRosterRowId])
                                        }
                                        if(header[3].multi){
                                            // console.log(`row${i} split: ` , data_rows[i][3].split(",")) // DEBUG
                                            data_rows[i][3].split(",").forEach(element => {
                                                col4Vals.push([element.replace(/^\s+|\s+$/g, '') , insertedRosterRowId])
                                            });
                                        }else{
                                            let col4Data = data_rows[i][3]
                                            col4Vals.push([col4Data , insertedRosterRowId])
                                        }
                                        if(header[4].multi){
                                            data_rows[i][4].split(",").forEach(element => {
                                                col5Vals.push([element.replace(/^\s+|\s+$/g, '') , insertedRosterRowId])
                                            });
                                        }else{
                                            let col5Data = data_rows[i][4]
                                            col5Vals.push([col5Data , insertedRosterRowId])
                                        }


                                        insertRowDataCol1Query = "INSERT INTO RowColumnOne (??) VALUES ?"
                                        insertRowDataCol2Query = "INSERT INTO RowColumnTwo (??) VALUES ?"
                                        insertRowDataCol3Query = "INSERT INTO RowColumnThree (??) VALUES ?"
                                        insertRowDataCol4Query = "INSERT INTO RowColumnFour (??) VALUES ?"
                                        insertRowDataCol5Query = "INSERT INTO RowColumnfive (??) VALUES ?"

                                        col1Query = mysql.format(insertRowDataCol1Query, [colNames, col1Vals]);
                                        col2Query = mysql.format(insertRowDataCol2Query, [colNames, col2Vals]);
                                        col3Query = mysql.format(insertRowDataCol3Query, [colNames, col3Vals]);
                                        col4Query = mysql.format(insertRowDataCol4Query, [colNames, col4Vals]);
                                        col5Query = mysql.format(insertRowDataCol5Query, [colNames, col5Vals]);
                                        console.log("put values for column one - Query: " ,col1Query); // DEBUG
                                        col1Results = await executeOnDBWithPromise(connection, col1Query);
                                        if (col1Results){
                                            console.log("put values for column two - Query: " ,col2Query); // DEBUG
                                            col2Results = await executeOnDBWithPromise(connection, col2Query);
                                            if (col1Results){
                                                console.log("put values for column three - Query: " ,col3Query); // DEBUG
                                                col3Results = await executeOnDBWithPromise(connection, col3Query);
                                                if (col3Results){
                                                    console.log("put values for column four - Query: " ,col4Query); // DEBUG
                                                    col4Results = await executeOnDBWithPromise(connection, col4Query);
                                                    if (col4Results){
                                                        console.log("put values for column five - Query: " ,col5Query); // DEBUG
                                                        col5Results = await executeOnDBWithPromise(connection, col5Query);
                                                        // We are done here
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    return res.json({
                                        status: "ok",
                                        result: `Inserted ${data_rows.length} rows`,
                                        roster_id: roster_id,
                                        course_id: course_id,
                                        professor_id: professor_id
                                    });
                                }
                            }else{
                                return res.json({
                                    status: "error",
                                    error: "Rows could not be inserted",
                                });
                            }
                        }
                    }
                }
                return res.json({
                    status: "error",
                    error: "Data could not be created, please try again.",
                });
            }catch(error){
                console.log(error)
                return res.json({
                    status:"error",
                    error:error.message,
                    errorFull:JSON.stringify(error)
                });
            }
        }
    }catch(error){
        console.log(error)
        return res.json({
            status:"error",
            error:error.message,
            errorFull:JSON.stringify(error)
        })
    }finally{
        if (connection && connection.end) connection.end();
    }
}

const getRosterById = async function(req, res, next){
    const roster_id = req.params.rid;
    const course_id = req.params.cid;
    if (!roster_id){
        res.json({
            status:"error",
            error:"roster_id not present in request"
        })
        return res
    }

    let connection = null;
    try{
        connection = getDbConnection();
        getRosterResultsQuery = " \
            SELECT \
                RH.col1_name, \
                RH.col2_name, \
                RH.col3_name, \
                RH.col4_name, \
                RH.col5_name, \
                RH.col6_name, \
                RH.col7_name, \
                RH.col8_name, \
                RH.col9_name, \
                RH.col10_name \
            FROM  \
                RosterHeaderRow RH \
            WHERE \
                RH.roster_id = ? \
            UNION \
            SELECT \
                GROUP_CONCAT(DISTINCT RC1.value ORDER BY RC1.value desc SEPARATOR ',') AS col1_value, \
                GROUP_CONCAT(DISTINCT RC2.value ORDER BY RC2.value desc SEPARATOR ',') AS col2_value, \
                GROUP_CONCAT(DISTINCT RC3.value ORDER BY RC3.value desc SEPARATOR ',') AS col3_value, \
                GROUP_CONCAT(DISTINCT RC4.value ORDER BY RC4.value desc SEPARATOR ',') AS col4_value, \
                GROUP_CONCAT(DISTINCT RC5.value ORDER BY RC5.value desc SEPARATOR ',') AS col5_value, \
                GROUP_CONCAT(DISTINCT RC6.value ORDER BY RC6.value desc SEPARATOR ',') AS col6_value, \
                GROUP_CONCAT(DISTINCT RC7.value ORDER BY RC7.value desc SEPARATOR ',') AS col7_value, \
                GROUP_CONCAT(DISTINCT RC8.value ORDER BY RC8.value desc SEPARATOR ',') AS col8_value, \
                GROUP_CONCAT(DISTINCT RC9.value ORDER BY RC9.value desc SEPARATOR ',') AS col9_value, \
                GROUP_CONCAT(DISTINCT RC10.value ORDER BY RC10.value desc SEPARATOR ',') AS col10_value \
            FROM \
                Roster R \
                INNER JOIN RosterRow RR USING (roster_id) \
                LEFT JOIN RowColumnOne RC1 ON RR.roster_row_id = RC1.roster_row_id \
                LEFT JOIN RowColumnTwo RC2 ON RR.roster_row_id = RC2.roster_row_id \
                LEFT JOIN RowColumnThree RC3 ON RR.roster_row_id = RC3.roster_row_id \
                LEFT JOIN RowColumnFour RC4 ON RR.roster_row_id = RC4.roster_row_id \
                LEFT JOIN RowColumnFive RC5 ON RR.roster_row_id = RC5.roster_row_id \
                LEFT JOIN RowColumnSix RC6 ON RR.roster_row_id = RC6.roster_row_id \
                LEFT JOIN RowColumnSeven RC7 ON RR.roster_row_id = RC7.roster_row_id \
                LEFT JOIN RowColumnEight RC8 ON RR.roster_row_id = RC8.roster_row_id \
                LEFT JOIN RowColumnNine RC9 ON RR.roster_row_id = RC9.roster_row_id \
                LEFT JOIN RowColumnTen RC10 ON RR.roster_row_id = RC10.roster_row_id \
            WHERE \
                R.roster_id = ? \
            GROUP BY \
                RR.roster_row_id \
            "

        let rosterResults = await executeOnDBWithPromise(connection, mysql.format(getRosterResultsQuery, [roster_id, roster_id]))
        console.log("query", mysql.format(getRosterResultsQuery, [roster_id, roster_id]));
        // console.log(rosterResults);
        rosterData = []
        header = [];
        hasHeader = false;
        if (rosterResults){
            console.log(rosterResults instanceof Array);
            rosterResults.forEach((result, idx) => {
                // console.log("result", Object.assign({}, result));
                if (idx == 0){
                    let idx = 0
                    for(var property in result){
                        if (result[property] != null){
                            header[idx] = result[property]
                        }
                        idx++;
                    }
                    // header.push(result);
                    // console.log(header)
                    hasHeader = true;
                    return res
                }else{
                    if (hasHeader){
                        let tmp = {}
                        let sidx = 0
                        for(var property in result){
                            if (header[sidx] != null){
                                tmp[header[sidx]] = result[property]
                            }
                            sidx++;
                        }
                        rosterData.push(tmp)
                    }
                }
            })
            res.json({
                status:"ok",
                results:{
                    data: rosterData,
                    header: hasHeader ? header : []
                },
                count:rosterData.length
            })
        }
        // throw Error("No roster found with this id")
    }catch(error){
        res.json({
            status:"error",
            error:error.message,
            errorFull:JSON.stringify(error),
            results:{
                data: [],
                header: []
            },
            count:-1
        })
    }finally{
        if (connection && connection.end) connection.end();
    }
}

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

app.post("/professor/:pid/course/save", saveCourseForProfessor);

app.post("/professor/:pid/course", getCoursesByProfessorId);

app.post("/professor/:pid/course/:cid/roster/save", saveCSV);

app.post("/professor/:pid/course/:cid/roster/:rid", getRosterById);

app.post("/professor/:pid/course/:cid/update", updateCourseById)

app.delete("/professor/:pid/course/:cid/delete", deleteCourseById)

