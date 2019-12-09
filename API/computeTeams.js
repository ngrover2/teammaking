var express = require("express");
var mysql = require('mysql');
var [ getDbConnection, executeOnDBWithPromise ] = require('./getDBConnection');
var router = express.Router({mergeParams: true});
var { mockSurveyAllAnswers, mockSurvey } = require("../app/tests/APIs/mockObjects");
var mathjs = require("mathjs");
var linalg = require("linear-algebra")();
var Vector = linalg.Vector;
var Matrix = linalg.Matrix;

var groupBy = function(elements, key) {
	let qgroups = {};
	elements.forEach((v, i) => {
		if (qgroups.hasOwnProperty(v[key])){
			qgroups[v[key]].push(i);
		}else{
			qgroups[v[key]] = [];
			qgroups[v[key]].push(i);
		}
	});
	return qgroups;
};


const computeTeams = async (req, res, next) => {
	let surveyQuestions = mockSurvey.surveyObject.questions;
	let questionGroups = groupBy(surveyQuestions, 'qtype');
	let allStudentsOtherStudentsStats = {};

	let allAnswerObjectsArray = Object.keys(mockSurveyAllAnswers).map((studentKey) => mockSurveyAllAnswers[studentKey]);
	
	let getQWeightMultiplier = (qtype) => {
		switch(qtype){
			case "Extremely Important" : return 3;
			case "Very Important" : return 2;
			case "Somewhat Important" : return 1;
			case "Little Important" : return 0.5;
			case "Not Important" : return 0;
			default : return 1;
		}
	}

	let getQWeightMultiplierSign = (qRoleInRank) => {
		switch(qRoleInRank){
			case "increaserank" : return 1;
			case "decreaserank" : return -1;
			default : return 1;
		}
	}

	let getQuestionMultiplierFromQuestionIndex = (qidx) => {
		if (surveyQuestions[qidx]){
			let qtype = surveyQuestions[qidx].qtype
			let qrole = surveyQuestions[qidx].qRoleInRank
			return getQWeightMultiplier(qtype) * getQWeightMultiplierSign(qrole)
		}else{
			return 1
		}
	}
	// getAnswersForQuestionIndices returns [array of all students' answers of a certain question type] for array of all schedule type questions. It is an array of array of answers
	let getAnswersForQuestionIndices = (indices) => 
		indices.map((index) => 
			allAnswerObjectsArray.map(
				(answerObj, i) =>
							{
								let answerObjIntKeys = Object.keys(answerObj).map((v) => parseInt(v));
								let getAtKey = answerObjIntKeys.filter((v) => {
									// console.log(`Comparing v:${v} with index:${index + 1}`); 
									return v == index + 1
								});
								return answerObj[getAtKey]
							}
			)
		);

	// ---------------------------------------------------------------------------------------------------------------------------------------------------
	// ********* Process Schedule Type Questions ******************
	let scheduleTypeQuestionsIndices = questionGroups.schedule;

	let scheduleAnswers = getAnswersForQuestionIndices(scheduleTypeQuestionsIndices);
	const binaryEncodeBusyHours = (arrayOfArray) => {
		let flattenned = [];
		let allHours = [0,1,2,3,4,5,6,7,8,9,10,11];
		arrayOfArray.forEach((nthDaySchedule,i) => {
			allHours.forEach((hour,index) => {
				if (nthDaySchedule.includes(hour)){
					flattenned.push(1)
				}else{
					flattenned.push(0)
				}
			})
		});
		return flattenned;
	}

	let scheduleBusynessVectors = scheduleAnswers.map((nthScheduleQuestionsAllAnswers) => {
		return nthScheduleQuestionsAllAnswers.map((scheduleObject) => binaryEncodeBusyHours(Object.values(scheduleObject)))
	})

	// construct a matrix for all students storing schedule scores
	let studentsScheduleMatrix = new Matrix(scheduleBusynessVectors[0]); // 24 by 84

	let studentsScheduleMatrixScores = studentsScheduleMatrix.dot(studentsScheduleMatrix.trans()); // 24 by 24

	studentsScheduleMatrixScores = studentsScheduleMatrixScores.trans(); // 24 by 24 

	
	const maxEl = (acc, cv) => {
		return (cv > acc) ? cv : acc
	}
	scoresNormalised = []
	studentsScheduleMatrixScores.data.forEach((scoresVector, i) => { // scoreVector should be scores for a student with respect to all other students
		let sum = scoresVector.reduce((x,y) => x + y, 0);
		// let max = scoresVector.reduce(maxEl, 0);
		sum = sum && sum > 0 ? sum : 1 ;
		// console.log(`Sum for ${i} row`, sum);
		scoresVector = scoresVector.map((v) => v / sum);
		scoresNormalised.push(scoresVector);

		// collect stats for the student
		let studentIdx = i
		if (allStudentsOtherStudentsStats[studentIdx]){
			allStudentsOtherStudentsStats[studentIdx][scheduleTypeQuestionsIndices[0]] = scoresVector.map((v) => Math.round(v * 100));
		}else{
			allStudentsOtherStudentsStats[studentIdx] = {}
			allStudentsOtherStudentsStats[studentIdx][scheduleTypeQuestionsIndices[0]] = scoresVector.map((v) => Math.round(v * 100));
		}
	})

	let studentsScheduleMatrixScoresNormalised = new Matrix(scoresNormalised).trans();
	studentsScheduleMatrixScoresNormalised = studentsScheduleMatrixScoresNormalised.mulEach(getQuestionMultiplierFromQuestionIndex(scheduleTypeQuestionsIndices[0]));
	
	// console.log("Matrix AFTER SCHEDULE COMPUTATIONS")
	// console.log(studentsScheduleMatrixScoresNormalised.rows)
	// console.log(studentsScheduleMatrixScoresNormalised.cols)
	// console.log(studentsScheduleMatrixScoresNormalised.data)
	
	// ********* END Process Schedule Type Questions ******************
	
	// ---------------------------------------------------------------------------------------------------------------------------------------------------
	// ********* START MCQ Type Questions ******************
	
	let multipleChoiceTypeQuestionIndices = questionGroups.multiplechoice;
	let multipleChoiceAnswers = getAnswersForQuestionIndices(multipleChoiceTypeQuestionIndices);
	let mcqAllQuestionChoices = multipleChoiceTypeQuestionIndices.map((index) => mockSurvey.surveyObject.questions[index].choices);

	const nthQuestionchoices = (n) => {
		let nthQChoices = mcqAllQuestionChoices.filter((v,i) => i == n)
		if (nthQChoices && nthQChoices.length == 1) return nthQChoices[0]
	}

	let mcqVectors = multipleChoiceAnswers.map((nthQuestionAllAnswers, nthQIndex) => {
		let choiceIndices = nthQuestionchoices(nthQIndex).map((v,i)=> i);
		return nthQuestionAllAnswers.map(
			(answerObj) => {
				let binaryChoiceEncoding = []
				choiceIndices.forEach((choiceIdx) => {
					if (answerObj.includes(choiceIdx)){
						binaryChoiceEncoding.push(1)
					}else{
						binaryChoiceEncoding.push(0)
					}
				});
				return binaryChoiceEncoding
			}
		)
	})
	// add mcq scores to the scores matrix
	mcqVectors.forEach((mcqvectorsPerQuestion, index) => {
		let allStudentsAnswersMatrix = new Matrix(mcqvectorsPerQuestion);
		let allStudentsScoresOtherStudents = allStudentsAnswersMatrix.dot(allStudentsAnswersMatrix.trans());
		
		allStudentsScoresOtherStudents = allStudentsScoresOtherStudents.trans();

		scoresNormalised = []
		console.log(`MCQ Index # ${index}`);
		allStudentsScoresOtherStudents.data.forEach((scoresVector, i) => {
			let sum = scoresVector.reduce((x,y) => x + y, 0);
			sum = sum && sum > 0 ? sum : 1 ;
			scoresVector = scoresVector.map((v) => v / sum);
			scoresNormalised.push(scoresVector);

			// collect stats for the student
			let studentIdx = i
			if (allStudentsOtherStudentsStats[studentIdx]){
				// console.log(`allStudentsOtherStudentsStats[studentIdx] for multipleChoiceTypeQuestionIndices #${multipleChoiceTypeQuestionIndices[index]} is true`)
				allStudentsOtherStudentsStats[studentIdx][multipleChoiceTypeQuestionIndices[index]] = scoresVector.map((v) => Math.round(v * 100));
			}else{
				// console.log(`allStudentsOtherStudentsStats[studentIdx] for multipleChoiceTypeQuestionIndices #${multipleChoiceTypeQuestionIndices[index]} is true`)
				allStudentsOtherStudentsStats[studentIdx] = {}
				allStudentsOtherStudentsStats[studentIdx][multipleChoiceTypeQuestionIndices[index]] = scoresVector.map((v) => Math.round(v * 100));
			}
			
		})
		let ScoresMatrix = new Matrix(scoresNormalised).trans(); // 24 by 24
		ScoresMatrix = ScoresMatrix.mulEach(getQuestionMultiplierFromQuestionIndex(multipleChoiceTypeQuestionIndices[index]));
		studentsScheduleMatrixScoresNormalised = studentsScheduleMatrixScoresNormalised.plus(ScoresMatrix);

	})

	
	// console.log("Matrix AFTER MCQs COMPUTATIONS")
	// console.log(studentsScheduleMatrixScoresNormalised.rows)
	// console.log(studentsScheduleMatrixScoresNormalised.cols)
	// ********* END MCQ Type Questions ******************
	
	// ---------------------------------------------------------------------------------------------------------------------------------------------------
	// ********* START Multiple values Type Questions ******************
	let multipleValueTypeQuestionIndices = questionGroups.multiplevalues;
	let multipleValuesAnswers = getAnswersForQuestionIndices(multipleValueTypeQuestionIndices);
	
	
	let mvAllUniqueAnswerValues = multipleValuesAnswers.map((answers, index) => {
		let uniqueValues = []
		answers.forEach((answer, answidx) => {
			answer.forEach((answVal, valIdx) => {
				if (!uniqueValues.includes(answVal.toLowerCase())){
					uniqueValues.push(answVal.toLowerCase())
				}
			})	
		})
		return uniqueValues
	});

	let mvVectors = multipleValuesAnswers.map((nthQuestionAllAnswers,questionIdx) => {
		return nthQuestionAllAnswers.map((nthAnswer, answidx) => {
			let nthAnswerBinaryEncoding = [];
			let uniqueAnswersForThisQuestion = mvAllUniqueAnswerValues[questionIdx];
			uniqueAnswersForThisQuestion.forEach((uniqueAnswerVal,uniqueAnswerIdx)=>{
				if (nthAnswer.includes(uniqueAnswerVal.toLowerCase())){
					nthAnswerBinaryEncoding.push(1);
				}else{
					nthAnswerBinaryEncoding.push(0);
				}
			})
			return nthAnswerBinaryEncoding;
		})
	})

	// add multiple values answers' scores to the scores matrix
	mvVectors.forEach((mvVectorsPerQuestion, index) => {
		let allStudentsAnswersMatrix = new Matrix(mvVectorsPerQuestion);
		let allStudentsOtherStudentsScores = allStudentsAnswersMatrix.dot(allStudentsAnswersMatrix.trans());
		allStudentsOtherStudentsScores = allStudentsOtherStudentsScores.trans();
		
		scoresNormalised = []
		console.log(`MV Index # ${index}`);
		allStudentsOtherStudentsScores.data.forEach((scoresVector, i) => {
			let sum = scoresVector.reduce((x,y) => x + y, 0);
			sum = sum && sum > 0 ? sum : 1 ;
			scoresVector = scoresVector.map((v) => v / sum);
			scoresNormalised.push(scoresVector);

			// collect stats for the student
			let studentIdx = i
			if (allStudentsOtherStudentsStats[studentIdx]){
				// console.log(`allStudentsOtherStudentsStats[studentIdx] for multipleValueTypeQuestionIndices #${multipleValueTypeQuestionIndices[index]} is true`)
				allStudentsOtherStudentsStats[studentIdx][multipleValueTypeQuestionIndices[index]] = scoresVector.map((v) => Math.round(v * 100));
			}else{
				// console.log(`allStudentsOtherStudentsStats[studentIdx] for multipleValueTypeQuestionIndices #${multipleValueTypeQuestionIndices[index]} is false`)
				allStudentsOtherStudentsStats[studentIdx] = {}
				allStudentsOtherStudentsStats[studentIdx][multipleValueTypeQuestionIndices[index]] = scoresVector.map((v) => Math.round(v * 100));
			}
			
		})

		let ScoresMatrix = new Matrix(scoresNormalised).trans();
		ScoresMatrix = ScoresMatrix.mulEach(getQuestionMultiplierFromQuestionIndex(multipleValueTypeQuestionIndices[index]));
		studentsScheduleMatrixScoresNormalised = studentsScheduleMatrixScoresNormalised.plus(ScoresMatrix);
	})
	
	// console.log("Matrix AFTER MVs COMPUTATIONS")
	// console.log(studentsScheduleMatrixScoresNormalised.rows)
	// console.log(studentsScheduleMatrixScoresNormalised.cols)
	// console.log(studentsScheduleMatrixScoresNormalised.data)

	// ********* END Multiple values Type Questions ******************

	// ---------------------------------------------------------------------------------------------------------------------------------------------------
	// ********* START Single Choice Type Questions ******************
	let singleChoiceTypeQuestionIndices = questionGroups.singlechoice;
	let singleChoiceAnswers = getAnswersForQuestionIndices(singleChoiceTypeQuestionIndices);
	let scAllQuestionChoices = singleChoiceTypeQuestionIndices.map((index) => mockSurvey.surveyObject.questions[index].choices);
	const nthSCQuestionchoices = (n) => {
		let nthQChoices = scAllQuestionChoices.filter((v,i) => i == n)
		if (nthQChoices && nthQChoices.length == 1) return nthQChoices[0]
	}

	let scVectors = singleChoiceAnswers.map((nthQuestionAllAnswers, nthQIndex) => {
		let choiceIndices = nthSCQuestionchoices(nthQIndex).map((v,i) => i);
		return nthQuestionAllAnswers.map(
			(answerObj) => {
				let binaryChoiceEncoding = []
				choiceIndices.forEach((choiceIdx) => {
					if (answerObj == choiceIdx){
						binaryChoiceEncoding.push(1)
					}else{
						binaryChoiceEncoding.push(0)
					}
				});
				return binaryChoiceEncoding
			}
		)
	})

	// add single choice answer scores to the scores matrix
	scVectors.forEach((scVectorsPerQuestion, index) => {
		let allStudentsAnswersMatrix = new Matrix(scVectorsPerQuestion);
		let allStudentsScoresOtherStudents = allStudentsAnswersMatrix.dot(allStudentsAnswersMatrix.trans());
		
		allStudentsScoresOtherStudents = allStudentsScoresOtherStudents.trans();

		scoresNormalised = []
		console.log(`SC Index # ${index}`);
		allStudentsScoresOtherStudents.data.forEach((scoresVector, i) => {
			let sum = scoresVector.reduce((x,y) => x + y, 0);
			sum = sum && sum > 0 ? sum : 1 ;
			scoresVector = scoresVector.map((v) => v / sum);
			scoresNormalised.push(scoresVector);

			// collect stats for the student
			let studentIdx = i
			if (allStudentsOtherStudentsStats[studentIdx]){
				// console.log(`allStudentsOtherStudentsStats[studentIdx] for singleChoiceTypeQuestionIndices #${singleChoiceTypeQuestionIndices[index]} is true`)
				allStudentsOtherStudentsStats[studentIdx][singleChoiceTypeQuestionIndices[index]] = scoresVector.map((v) => Math.round(v * 100));
			}else{
				// console.log(`allStudentsOtherStudentsStats[studentIdx] for singleChoiceTypeQuestionIndices #${singleChoiceTypeQuestionIndices[index]} is false`)
				allStudentsOtherStudentsStats[studentIdx] = {}
				allStudentsOtherStudentsStats[studentIdx][singleChoiceTypeQuestionIndices[index]] = scoresVector.map((v) => Math.round(v * 100));
			}
		});

		let ScoresMatrix = new Matrix(scoresNormalised).trans(); // 24 by 24
		ScoresMatrix = ScoresMatrix.mulEach(getQuestionMultiplierFromQuestionIndex(singleChoiceTypeQuestionIndices[index]));
		studentsScheduleMatrixScoresNormalised = studentsScheduleMatrixScoresNormalised.plus(ScoresMatrix);
	})
	// ********* END Single Choice Type Questions ******************

	return res.json({
		status: "ok",
		result: {
			studentsScheduleMatrixScoresNormalised: studentsScheduleMatrixScoresNormalised.data.map((vector) => vector.sort((x,y) => x > y ? -1 : 1)).map((vector) => vector.map((v) => Math.round(v * 100))),
			allStudentsOtherStudentsStats: allStudentsOtherStudentsStats,
			studentAnswers:allAnswerObjectsArray,
			numStudents:studentsScheduleMatrixScoresNormalised.rows
		}
	});
}

router.post("/", computeTeams);

module.exports = router;


let a = [[1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0],
[1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0],
[1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1],
[0,0,0,0,1,1,1,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0],
[0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[1,1,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0],
[1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
[0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[0,0,0,0,0,0,1,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1]];