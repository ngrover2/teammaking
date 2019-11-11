var express = require("express");
var mysql = require('mysql');
var [ getDbConnection, executeOnDBWithPromise ] = require('./getDBConnection');
var router = express.Router({mergeParams: true});

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

router.post("/", saveCSV);

module.exports = router;