var express = require("express");
var mysql = require('mysql');
var app = express();
var cors = require('cors');
app.use(cors({
    origin: 'http://localhost:8080'
  }));
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.listen(3000, () => {
 console.log("Server running on port 3000");
});

const helloTeam = (req, res, next) => {
    try{
        var connection = mysql.createConnection({
            host: 'localhost',
            port: 3306,
            user: 'root',
            database: 'teammaking'
        });
        
        connection.connect();
        try{
            connection.query('SELECT * from songs', function (err, rows, fields) {
                if (err) throw err
                res.json({
                    "status":"ok",
                    "result": [...rows],
                    "count":rows.length
                });
            })
        }catch{

        }finally{
            connection.end();
        }
        
        
    }
    catch{
        res.json({
            "status":"error",
            "reason": "Could not connect to Mysql"
        })
    }    
    return res;
    // try{
    //     var getConnection = await new Promise(mysql.createConnection({
    //             host: 'localhost',
    //             port: 3306,
    //             user: 'root',
    //             database: 'teammaking'}
    //         ),(
    //             (conn) => {
    //                 console.log(conn)
    //                 resolve(conn)
    //             }, 
    //             (error)=> {
    //                 reject("Sorry! Could not connect to Mysql.")
    //             }
    //         ))

    //     var getConnectionResult = getConnection.then((resolvedConn)=>{
    //             return {success:true,"result":resolvedConn};
    //         }, (rejectedError)=>{
    //             return {success:false,"result":rejectedError};
    //         }).catch((error)=>{
    //             console.log(error)
    //         });
        
    //     var { success, result } = getConnectionResult;
    //     var connection = result 
    //     if (success){
    //         console.log(connection)
    //         connection.connect();
    //         connection.query('SELECT * from songs', function (err, rows, fields) {
    //             if (err) throw err
    //             res.json({
    //                 "status":"ok",
    //                 "result": [...rows],
    //                 "count":rows.length
    //             });
    //         })
    //         connection.close();
    //     }
    // }
    // catch(e){
    //     console.log(e);
    //     return res.json({
    //         "status":"error",
    //         "reason": e.message
    //     })
    // }
    // return res;
}

const fakeDatabase = {
    fakeCourse:{
        fakeRoster:[

        ]
    }
}

const courses = [
            {id:"1234",name:"tom",email:"tom@example.com", preferences: "Blah"},
            {id:"4585",name:"jack",email:"jack@example.com", preferences: "Blah"},
            {id:"4564",name:"jaso",email:"jaso@example.com", preferences: "Blah"},
            {id:"7654",name:"patrick",email:"patrick@example.com", preferences: "Blah"}
]

const roster = [
    {name:"Navit", email:"navit@email.com", skill:"React", age:"52"},
    {name:"Rahul", email:"rahul@email.com", skill:"Python", age:"25"},
    {name:"Rachel", email:"rachel@email.com", skill:"UI", age:"25"},
    {name:"Devika", email:"devika@email.com", skill:"C++", age:"25"}
]

app.get("/helloTeam", helloTeam);
app.get("/api/helloTeam", helloTeam);
app.get("/", (req,res,next)=> { return res.json({"status":"ok"})});
app.get("/course/roster/:id", (req, res, next)=> { return res.json({
    "status":"ok",
    result:roster
})});

app.get("/course", (req,res,next)=> { return res.json({"status":"ok"})});

app.get("/course/roster/new", (req,res,next)=> { 
    req.params
    return res.json({"status":"ok"})
});

app.get("/inc", (req,res,next)=> { fakeDatabase.fakeCounter+=1; return res.json({"status":"ok"})});
app.get("/getinc", (req,res,next)=> { return res.json({"status":"ok","counter":fakeDatabase.fakeCounter})});

