var mysql = require('mysql');
require('dotenv').config();

const getDbConnection = () => {
    // console.log("process.env.DB_USE_PASS IS:",process.env.DB_USE_PASS);
    // console.log("process.env IS:",process.env);
    if (process.env.DB_USE_PASS == null) {
        var getConnection = mysql.createConnection({
            host: 'localhost',
            port: 3306,
            user: 'root',
            database: 'teammaking',
            password: 'password'
        })
        return getConnection;
    }
    else if (process.env.DB_USE_PASS == "no"){
        var getConnection = mysql.createConnection({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            database: process.env.DB_DBNAME
        })
        return getConnection;
    }else if (process.env.DB_USE_PASS == "yes"){
        var getConnection = mysql.createConnection({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_DBNAME
        })
        return getConnection;
    }
}

const executeOnDBWithPromise = (connection, query) => {
    var queryPromise = null;
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

module.exports = [getDbConnection, executeOnDBWithPromise];