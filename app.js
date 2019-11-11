var express = require("express");
var mysql = require('mysql');
var app = express();
var cors = require('cors');
// const [ getDbConnection, executeOnDBWithPromise ] = require('./API/getDBConnection');

const saveCourseController = require('./API/saveCourseForProfessor');
const saveCSVController = require('./API/saveCSVController');
const getRosterController = require('./API/getRosterController');
const updateCourseByIdController = require('./API/updateCourseController');
const getCoursesByProfessorIdController = require('./API/getCoursesController');
const deleteCourseByIdController = require('./API/deleteCourseController');

app.use(cors({
    origin: 'http://localhost:8080'
}));

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.use("/professor/:pid/course/save", saveCourseController);
app.use("/professor/:pid/course/:cid/roster/save", saveCSVController);
app.use("/professor/:pid/course/:cid/roster/:rid", getRosterController);
app.use("/professor/:pid/course/:cid/update", updateCourseByIdController);
app.use("/professor/:pid/course", getCoursesByProfessorIdController);
app.use("/professor/:pid/course/:cid/delete", deleteCourseByIdController);

app.listen(3000, () => {
 console.log("Server running on port 3000");
});


// app.post("/professor/:pid/course/save", saveCourseForProfessor);

// app.post("/professor/:pid/course", getCoursesByProfessorId);

// app.post("/professor/:pid/course/:cid/roster/save", saveCSV);

// app.post("/professor/:pid/course/:cid/roster/:rid", getRosterById);

// app.post("/professor/:pid/course/:cid/update", updateCourseById)

// app.delete("/professor/:pid/course/:cid/delete", deleteCourseById)

