var mysql = require('mysql');

const getDbConnection = () => {
    var getConnection = mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'root',
        database: 'teammaking'}
    )
    return getConnection;
}

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

module.exports = [getDbConnection, executeOnDBWithPromise];