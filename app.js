var express = require("express");
var mysql = require('mysql');
var app = express();
var cors = require('cors');

const saveCourseController = require('./API/saveCourseController');
const saveCSVController = require('./API/saveCSVController');
const deleteRosterController = require('./API/deleteRosterByCourseCodeController');
const getRosterController = require('./API/getRosterController');
const updateCourseByIdController = require('./API/updateCourseController');
const getCoursesByProfessorIdController = require('./API/getCoursesController');
const deleteCourseByIdController = require('./API/deleteCourseController');
const deleteCourseByCodeController = require('./API/deleteCourseByCodeController');
const saveSurveyController = require('./API/saveSurveyController');
const getSurveyController = require('./API/getSurveyController');
const updateSurveyController = require('./API/updateSurveyController');
const computeTeamsController = require('./API/computeTeams');


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
app.use("/professor/:pid/course/:cid/survey/save", saveSurveyController);
app.use("/professor/:pid/course/:cid/survey/:sid", getSurveyController);
app.use("/professor/:pid/course/:cid/survey/:sid/update", updateSurveyController);
app.use("/professor/:pid/course/:cid/survey/:sid/teams", computeTeamsController);

// routes primarily created for testing
app.use("/professor/:pid/course/deletebycode", deleteCourseByCodeController);
app.use("/professor/:pid/course/roster/deletebycode", deleteRosterController);


module.exports = app;


