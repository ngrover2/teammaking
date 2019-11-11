var express = require("express");
var mysql = require('mysql');
var [ getDbConnection, executeOnDBWithPromise ] = require('./getDBConnection');
var router = express.Router({mergeParams: true});

const getRosterById = async function(req, res, next){
    const roster_id = req.params.rid;
    const course_id = req.params.cid;
    if (!roster_id){
        return res.status(400).json({
            status:"error",
            error:"roster_id not present in request"
        })
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
        let rosterData = []
        let header = [];
        let hasHeader = false;
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
            return res.status(200).json({
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
        return res.status(500).json({
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

router.post("/", getRosterById);

module.exports = router;
