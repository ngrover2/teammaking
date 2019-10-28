var express = require("express");
var mysql = require('mysql');
var app = express();
var cors = require('cors');
var { resolve, reject } =  Promise;


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
        database: 'teammaking'}
    )
    return getConnection
}

const saveCSV = async function(req, res, next){
    const header = req.body.header_row;
    const data_rows = req.body.data_rows;
    const course_code = 'CC1234';
    const professor_name = 'Harini Ramaprasad';
    // console.log(header); // DEBUG
    // console.log(data_rows) // DEBUG
    try{
        if (!Array.isArray(header) || !Array.isArray(data_rows)){
            return res.json({
                status: "error",
                "reason": "header_row and data_rows should to be non-empty arrays"
            })
        }else{
            // check header length
            if (header.length < 1){
                return res.json({
                    status: "error",
                    "reason": "header_row cannot be empty"
                })    
            }
            // check data length
            if (data_rows.length < 1){
                return res.json({
                    status: "error",
                    "reason": "data_rows cannot be empty"
                })    
            }
            // check header and column count validity
            if (header.length != data_rows[0].length){
                return res.json({
                    status: "error",
                    "reason": "header_row column count and data_rows column count does not match"
                })
            }

            let connection = getDbConnection();
            var course_id = null;
            var profesor_id = null;
            var roster_id = null;

            // Get RosterId for the professor
            getRosterQueryString = "SELECT R.roster_id, C.course_id, P.professor_id FROM Professor P LEFT JOIN Roster R USING (professor_id) LEFT JOIN Course C USING (professor_id) WHERE ?? = ? AND ?? = ?"
            getRosterQueryArgs = ['P.name' , professor_name , 'C.course_code', course_code];
            getRosterSqlQuery = mysql.format(getRosterQueryString, getRosterQueryArgs);
            // console.log("getRosterSqlQuery", getRosterSqlQuery);

            try{
                queryResult = await executeOnDBWithPromise(connection, getRosterSqlQuery);
                if (queryResult){
                    // console.log(queryResult[0]) // DEBUG
                    let resultObj = queryResult[0];
                    course_id = resultObj.course_id
                    professor_id = resultObj.professor_id
                    roster_id = resultObj.roster_id
                    if (!course_id){
                        throw Error(`Coursecode:${course_code} does not exist in the database.`)
                    }
                    if (!professor_id){
                        throw Error(`Professor:${professor_name} does not exist in the database.`)
                    }
                    if (roster_id){
                        console.log("ROSTER EXISTS, DELETING")
                        await executeOnDBWithPromise(connection, mysql.format("DELETE FROM Roster WHERE ?? = ?",['roster_id', roster_id]));
                        await executeOnDBWithPromise(connection, mysql.format("DELETE FROM RosterHeaderRow WHERE ?? = ?",['roster_id', roster_id]));
                    }
                    // create roster id
                    console.log("CREATING NEW ROSTER") // DEBUG
                    let createNewRosterQuery = "INSERT INTO Roster (??) VALUES (?)"
                    let rosterFieldIdentifiers = [ 'professor_id', 'course_id' ]
                    let rosterFieldValues = [ professor_id, course_id ]
                    let createRosterResults = await executeOnDBWithPromise(connection, mysql.format(createNewRosterQuery,[rosterFieldIdentifiers, rosterFieldValues]));
                    if (!createRosterResults){
                        throw Error("Roster could not be created in database..")
                    }else{
                        // console.log(`Created roster with id: ${createRosterResults.insertId}`)
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
                        // console.log("insertRowsSqlQuery", insertRowsSqlQuery);

                        headerResults = await executeOnDBWithPromise(connection, insertHeaderSqlQuery)
                        // console.log("headerResults", headerResults);
                        if (headerResults.affectedRows == 1){ // header has been created
                            rowResults = await executeOnDBWithPromise(connection, insertRowsSqlQuery)
                            if (rowResults){ // rows have been inserted
                                // get ids of inserted rows
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
                                            // console.log(`row${i} 0: `, data_rows[i][0]) // DEBUG
                                            data_rows[i][0].split(",").foreach(element => {
                                                col1Vals.push([element.replace(/^\s+|\s+$/g, '') , insertedRosterRowId])
                                            });
                                        }else{
                                            let col1Data = data_rows[i][0]
                                            col1Vals.push([col1Data , insertedRosterRowId])
                                        }
                                        if(header[1].multi){
                                            // console.log(`row${i} 1: `, data_rows[i][0]) // DEBUG
                                            data_rows[i][1].split(",").foreach(element => {
                                                col2Vals.push([element.replace(/^\s+|\s+$/g, '') , insertedRosterRowId])
                                            });
                                        }else{
                                            let col2Data = data_rows[i][1]
                                            col2Vals.push([col2Data , insertedRosterRowId])
                                        }
                                        if(header[2].multi){
                                            data_rows[i][2].split(",").foreach(element => {
                                                col3Vals.push([element.replace(/^\s+|\s+$/g, '') , insertedRosterRowId])
                                            });
                                        }else{
                                            let col3Data = data_rows[i][2]
                                            col3Vals.push([col3Data , insertedRosterRowId])
                                        }
                                        if(header[3].multi){
                                            // console.log(`row${i} 3: `, data_rows[i][3]);
                                            // console.log(`row${i} 3: `, data_rows[i]);
                                            // console.log(`row${i} split: ` , data_rows[i][3].split(",")) // DEBUG
                                            data_rows[i][3].split(",").forEach(element => {
                                                col4Vals.push([element.replace(/^\s+|\s+$/g, '') , insertedRosterRowId])
                                            });
                                        }else{
                                            let col4Data = data_rows[i][3]
                                            col4Vals.push([col4Data , insertedRosterRowId])
                                        }
                                        if(header[4].multi){
                                            data_rows[i][4].split(",").foreach(element => {
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
                                        
                                        col1Results = await executeOnDBWithPromise(connection, col1Query);
                                        if (col1Results){
                                            col2Results = await executeOnDBWithPromise(connection, col2Query);
                                            if (col1Results){
                                                col3Results = await executeOnDBWithPromise(connection, col3Query);
                                                if (col3Results){
                                                    col4Results = await executeOnDBWithPromise(connection, col4Query);
                                                    if (col4Results){
                                                        col5Results = await executeOnDBWithPromise(connection, col5Query);
                                                        // We are done here
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    res.json({
                                        status: "ok",
                                        result: `Inserted ${data_rows.length} rows`,
                                        roster_id: roster_id,
                                        course_id: course_id,
                                        professor_id: professor_id
                                    });
                                }
                            }else{
                                res.json({
                                    status: "error",
                                    reason: "Rows could not be inserted",
                                });
                            }
                        }
                    }
                }
                if (connection && connection.end) connection.end();
                res.json({
                    status: "error",
                    reason: "Data could not be created, please try again.",
                });
            }catch(error){
                if (connection && connection.end) connection.end();
                console.log(error)
                res.json({
                    status:"error",
                    error:error.message,
                    errorFull:JSON.stringify(error)
                });
            }
        }
    }catch(error){
        if (connection && connection.end) connection.end();
        console.log(error)
        return res.json({
            status:"error",
            error:error.message,
            errorFull:JSON.stringify(error)
        })
    }
}

const getRosterById = async function(req, res, next){
    const roster_id = req.body.roster_id;
    if (!roster_id){
        res.json({
            status:"error",
            reason:"roster_id not present in request"
        })
    }
    let connection = getDbConnection();
    try{
        getRosterResultsQuery = " \
            SELECT \
                RH.roster_id, \
                0 row_id, \
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
                R.roster_id, \
                RR.roster_row_id row_id, \
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
            GROUP BY row_id; \
            "

        let rosterResults = await executeOnDBWithPromise(connection, mysql.format(getRosterResultsQuery, [roster_id, roster_id]))
        console.log("query", mysql.format(getRosterResultsQuery, [roster_id, roster_id]));
        // console.log(rosterResults);
        rosterData = []
        header = [];
        hasHeader = false;
        if (rosterResults){
            console.log(rosterResults instanceof Array);
            rosterResults.forEach((result) => {
                console.log("result", Object.assign({}, result));
                if (result.row_id == 0){
                    hasHeader = true;       
                    header.push(result);
                    return
                }
                rosterData.push(result)
            })
            if (connection && connection.end) connection.end();
            res.json({
                status:"ok",
                results:{
                    data: rosterData,
                    header: header
                },
                count:rosterData.length
            })
        }
        // throw Error("No roster found with this id")
    }catch(error){
        if (connection && connection.end) connection.end();
        res.json({
            status:"error",
            reason:error.message,
            errorFull:JSON.stringify(error),
            results:{
                data: [],
                header: []
            },
            count:-1
        })
    }
}

app.post("/professor/:id/course/:id/roster/save", saveCSV);

app.get("professor/:id/course/:id/roster/:id", getRosterById);

app.get("/professor/:id/course", (req, res, next)=> { return res.json({"status":"ok"})});

