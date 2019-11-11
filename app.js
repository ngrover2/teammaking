var express = require("express");
var mysql = require('mysql');
var app = express();
var cors = require('cors');

const saveCourseController = require('./API/saveCourseController');
const saveCSVController = require('./API/saveCSVController');
const getRosterController = require('./API/getRosterController');
const updateCourseByIdController = require('./API/updateCourseController');
const getCoursesByProfessorIdController = require('./API/getCoursesController');
const deleteCourseByIdController = require('./API/deleteCourseController');
const deleteCourseByCodeController = require('./API/deleteCourseByCodeController');

app.use(cors({
    origin: ['http://localhost:8080', 'http://127.0.0.1:80']
}));

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.use("/professor/:pid/course", getCoursesByProfessorIdController);
app.use("/professor/:pid/course/save", saveCourseController);
app.use("/professor/:pid/course/:cid/roster/save", saveCSVController);
app.use("/professor/:pid/course/:cid/roster/:rid", getRosterController);
app.use("/professor/:pid/course/:cid/update", updateCourseByIdController);
app.use("/professor/:pid/course/:cid/delete", deleteCourseByIdController);
app.use("/professor/:pid/course/deletebycode", deleteCourseByCodeController);


module.exports = app;