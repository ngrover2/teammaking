
const mockRoster = {
	header_row: [
	  { name: 'name', multi: true },
	  { name: 'email', multi: true },
	  { name: 'skill', multi: true },
	  { name: 'age', multi: true },
	  { name: 'studentId', multi: true }
	],
	data_rows: [
	  [ 'Navit', 'navit@email.com', 'react', '28', '80100010' ],
	  [ 'Rachel', 'rachel@email.com', 'UI', '25', '80100011' ],
	  [ 'Rahul', 'rahul@email.com', 'python', '23', '80100012' ],
	  [ 'Devika', 'devika@email.com', 'express', '23', '80100010' ]
	],
	course_code: 'ITCS TEST'
}

const mockCourse = {
	course_code: 'ITCS TEST',
	course_name: 'Test Course',
	course_description: 'This Course teaches you avout the facts about life (and people and illnesses and death!, but not by Loopus)',
	ta_name: 'Gregory House',
	ta_email: 'SeekerOfVicodine@EverybodyLies.com',
	professor_id: '1',
	start_date: '2019-7-09 18:30:00',
	end_date: '2019-12-12 18:30:00',
	class_start_time: '02:30:00',
	class_end_time: '05:15:00'
}

const mockUpdateCourse = {
	course_code: 'ITCS TEST',
	course_name: 'Test Course',
	course_description: 'This course teaches you patience. At the end of this course, you will either be in absolute control of how you deal with impatience OR you will quit your job.',
	ta_name: 'Lisa Cuddy',
	ta_email: 'ControllerOfHouse@ImmenselyPatient.com',
	professor_id: '1',
	start_date: '2019-7-09 18:30:00',
	end_date: '2019-12-12 18:30:00',
	class_start_time: '02:30:00',
	class_end_time: '05:15:00'
}

const mockSurvey = {
	surveyObject:{
		deadline: '2019-12-31 11:59:59',
		questions: [
			{
				qtype: "schedule",
				qtext: "Choose days in the week when you are NOT available to meet ?",
				qweight: "Very Important",
				qRoleInRank: "increaserank"
			},
			{
				qtype: "multiplechoice",
				qtext: "Which programming languages that you are MOST familiar/comfortable working with.",
				qweight: "Somewhat Important",
				choices: [ "Python", "Java", "Javascript", "C/C++", "PHP", "Other" ],
				qRoleInRank: "increaserank"
			},
			{
				qtype: "multiplevalues",
				qtext: "Which software frameworks that you are MOST familiar/comfortable working with.",
				qweight: "Somewhat Important",
				qMaxVals: 5,
				qRoleInRank: "increaserank"
			},
			{
				qtype: "singlechoice",
				qtext: "Have you ever worked on a building a web application in a professional, personal or academic capacity ?",
				qweight: "Very Important",
				choices: ["Yes", "No", "I am not sure"],
				defaultChoice: "",
				defaultSelected: false,
				qRoleInRank: "decreaserank"
			},
			{
				qtype: "singlechoice",
				qtext: "Are you comfortable working in a team ?",
				qweight: "Little Important",
				choices: ["Yes", "No", "I can not say"],
				defaultChoice: "",
				defaultSelected: false,
				qRoleInRank: "decreaserank"
			},
			{
				qtype: "singlechoice",
				qtext: "Which part of the web application stack would you like to work with ?",
				qweight: "Little Important",
				choices: ["Front End", "Back End", "Database", "No Preference" ],
				defaultChoice: "",
				defaultSelected: false,
				qRoleInRank: "decreaserank"
			},
			
		],
		title: "This will help me make the best teams out of you"
	}
}
	
const mockUpdateSurvey = {
	surveyObject:{
		deadline: '2019-12-31 11:59:59',
		questions: [
			{
				qtype: "text",
				qtext: "What else could it be ?",
				qweight: "Somewhat Important"
			},
			{
				qtype: "multiplechoice",
				qtext: "May be her bravery isn't bravery, it is a synmptom",
				qweight: "Somewhat Important",
				choices: ["Am I", "Am I not", "Not sure", "Semms legit", "Other"]
			},
			{
				qtype: "multiplevalues",
				qtext: "May be her bravery isn't bravery, it is a synmptom ?",
				qweight: "Little Important",
				qMaxVals: 4
			},
			{
				qtype: "singlechoice",
				qtext: "May be her bravery isn't bravery, it is a synmptom ?",
				qweight: "Little Important",
				choices: ["Go to hell, House", "I agrre with you", "How would you test it", "You are miserable"],
				defaultChoice: "Go to hell, House",
				defaultSelected: true
			}
		],
		title: "This will help me make the best teams out of you"
	}
}

const invalidMockCourseCode = 'ANINVALIDMOCKCOURSECODETHATSHOULDNOTEXIST';

const mockSurveyAllAnswers = {
	student1: { // each day consists of hours 8 am - 8 pm represented by an array of values [0 11] with 0 representing 8 am and 11 representing 8 pm
		1: {
			"1": [0,1,2,3,4,5,6,7,8],
			"2": [],
			"3": [],
			"4": [0,1,2,3,4,5,6,7,8,9,10,11],
			"5": [0,1,2,3,4,5,6],
			"6": [],
			"7": [0,1,2,3,4,5,6,7,8,9,10,11]
		}, // Question about: Busy(ness) in Schedule : answer object contains list of busy hours for each day represented as the key in the answer object
		2: [ 5 ], // answer is the index in the choices array | Question about: Programming Language : Multiple Choice (choices: [ "Python", "Java", "Javascript", "C/C++", "PHP", "Other" ])
		3: [], // Question about: Programming Frameworks: Multiple values (Max five values)
		4: 1, // answer is the index in the choices array | Question about: whether worked on a building a web application (["Yes", "No", "I am not sure"])
		5: 0, // answer is the index in the choices array | Question about: whether comfortable working in a team (choices ["Yes", "No", "I can not say"])
		6: 3 // answer is the index in the choices array | Question about : Which part of web application stack is preferred by the student (choices: ["Front End", "Back End", "Database", "No Preference" ])
	},
	student2: {
		1: {
			"1": [],
			"2": [6,7,8,9,10],
			"3": [6,7,8,9,10],
			"4": [],
			"5": [0,1,2,3,4,5,6],
			"6": [5,6,7],
			"7": [5,6,7]
		}, // Question about: Busy(ness) in Schedule : answer object contains list of busy hours for each day represented as the key in the answer object
		2: [ 2 ], // answer is the index in the choices array | Question about: Programming Language : Multiple Choice (choices: [ "Python", "Java", "Javascript", "C/C++", "PHP", "Other" ])
		3: ["Express" , "Jest" , "React"], // Question about: Programming Frameworks: Multiple values (Max five values)
		4: 0, // answer is the index in the choices array | Question about: whether worked on a building a web application (["Yes", "No", "I am not sure"])
		5: 0, // answer is the index in the choices array | Question about: whether comfortable working in a team (choices ["Yes", "No", "I can not say"])
		6: 2 // answer is the index in the choices array | Question about : Which part of web application stack is preferred by the student (choices: ["Front End", "Back End", "Database", "No Preference" ])
	},
	student3: {
		1: {
			"1": [0,1,2,3,4,5,6,7,8,9],
			"2": [5,6,7,8,9],
			"3": [5,6,7,8,9],
			"4": [5,6,7],
			"5": [],
			"6": [6,7,8,9,10,11],
			"7": [0,1,2,3,4,5],
		}, // Question about: Busy(ness) in Schedule : answer object contains list of busy hours for each day represented as the key in the answer object
		2: [ 1 ], // answer is the index in the choices array | Question about: Programming Language : Multiple Choice (choices: [ "Python", "Java", "Javascript", "C/C++", "PHP", "Other" ])
		3: ["Spring" , "J2EE" , "Junit"], // Question about: Programming Frameworks: Multiple values (Max five values)
		4: 0, // answer is the index in the choices array | Question about: whether worked on a building a web application (["Yes", "No", "I am not sure"])
		5: 1, // answer is the index in the choices array | Question about: whether comfortable working in a team (choices ["Yes", "No", "I can not say"])
		6: 3 // answer is the index in the choices array | Question about : Which part of web application stack is preferred by the student (choices: ["Front End", "Back End", "Database", "No Preference" ])
	},
	student4: {
		1: {
			"1": [0,1,2,3,4,5,6,7,8,9,],
			"2": [7,8,9,10,11],
			"3": [3,4,5,6,7],
			"4": [3,4,5,6,7,8],
			"5": [],
			"6": [],
			"7": [0,1,2,3,4,5,6,7,8,9,10,11],
		}, // Question about: Busy(ness) in Schedule : answer object contains list of busy hours for each day represented as the key in the answer object
		2: [ 0 ], // answer is the index in the choices array | Question about: Programming Language : Multiple Choice (choices: [ "Python", "Java", "Javascript", "C/C++", "PHP", "Other" ])
		3: ["flask" , "pytest"], // Question about: Programming Frameworks: Multiple values (Max five values)
		4: 0, // answer is the index in the choices array | Question about: whether worked on a building a web application (["Yes", "No", "I am not sure"])
		5: 1, // answer is the index in the choices array | Question about: whether comfortable working in a team (choices ["Yes", "No", "I can not say"])
		6: 1 // answer is the index in the choices array | Question about : Which part of web application stack is preferred by the student (choices: ["Front End", "Back End", "Database", "No Preference" ])
	},
	student5: {
		1: {
			"1": [0,1,2,3,4,5,6],
			"2": [0,1,2,3,4,5,6],
			"3": [0,1,2,3,4,5,6],
			"4": [0,1,2,3,4,5,6],
			"5": [],
			"6": [],
			"7": [0,1,2,3,4,5,6,7,8,9,10,11],
		}, // Question about: Busy(ness) in Schedule : answer object contains list of busy hours for each day represented as the key in the answer object
		2: [ 5 ], // answer is the index in the choices array | Question about: Programming Language : Multiple Choice (choices: [ "Python", "Java", "Javascript", "C/C++", "PHP", "Other" ])
		3: ["Some Non Web Software"], // Question about: Programming Frameworks: Multiple values (Max five values)
		4: 1, // answer is the index in the choices array | Question about: whether worked on a building a web application (["Yes", "No", "I am not sure"])
		5: 1, // answer is the index in the choices array | Question about: whether comfortable working in a team (choices ["Yes", "No", "I can not say"])
		6: 3 // answer is the index in the choices array | Question about : Which part of web application stack is preferred by the student (choices: ["Front End", "Back End", "Database", "No Preference" ])
	},
	student6: {
		1: {
			"1": [],
			"2": [],
			"3": [0,1,2,3,4,5,6,7,8,9,10,11],
			"4": [],
			"5": [0,1,2,3,4,5,6,7,8,9,10,11],
			"6": [],
			"7": [],
		}, // Question about: Busy(ness) in Schedule : answer object contains list of busy hours for each day represented as the key in the answer object
		2: [ 2 ], // answer is the index in the choices array | Question about: Programming Language : Multiple Choice (choices: [ "Python", "Java", "Javascript", "C/C++", "PHP", "Other" ])
		3: ["Express" , "Angular"], // Question about: Programming Frameworks: Multiple values (Max five values)
		4: 1, // answer is the index in the choices array | Question about: whether worked on a building a web application (["Yes", "No", "I am not sure"])
		5: 1, // answer is the index in the choices array | Question about: whether comfortable working in a team (choices ["Yes", "No", "I can not say"])
		6: 0 // answer is the index in the choices array | Question about : Which part of web application stack is preferred by the student (choices: ["Front End", "Back End", "Database", "No Preference" ])
	},
	student7: {
		1: {
			"1": [],
			"2": [],
			"3": [0,1,2,3,4,5,6,7,8,9,10,11],
			"4": [0,1,2,3,4,5,6,7,8,9,10,11],
			"5": [],
			"6": [0,1,2,3,4,5,6,7,8,9,10,11],
			"7": []
		}, // Question about: Busy(ness) in Schedule : answer object contains list of busy hours for each day represented as the key in the answer object
		2: [ 1 ], // answer is the index in the choices array | Question about: Programming Language : Multiple Choice (choices: [ "Python", "Java", "Javascript", "C/C++", "PHP", "Other" ])
		3: ["Struts" , "J2EE" , "Junit"], // Question about: Programming Frameworks: Multiple values (Max five values)
		4: 0, // answer is the index in the choices array | Question about: whether worked on a building a web application (["Yes", "No", "I am not sure"])
		5: 1, // answer is the index in the choices array | Question about: whether comfortable working in a team (choices ["Yes", "No", "I can not say"])
		6: 1 // answer is the index in the choices array | Question about : Which part of web application stack is preferred by the student (choices: ["Front End", "Back End", "Database", "No Preference" ])
	},
	student8: {
		1: {
			"1": [],
			"2": [0,1,2,3,4,5,6,7,8,9,10,11],
			"3": [0,1,2,3,4,5,6,7,8,9,10,11],
			"4": [],
			"5": [0,1,2,3,4,5,6,7,8,9,10,11],
			"6": [],
			"7": [0,1,2,3,4,5,6,7,8,9,10,11],
		}, // Question about: Busy(ness) in Schedule : answer object contains list of busy hours for each day represented as the key in the answer object
		2: [ 1 ], // answer is the index in the choices array | Question about: Programming Language : Multiple Choice (choices: [ "Python", "Java", "Javascript", "C/C++", "PHP", "Other" ])
		3: ["Spring" , "Struts"], // Question about: Programming Frameworks: Multiple values (Max five values)
		4: 1, // answer is the index in the choices array | Question about: whether worked on a building a web application (["Yes", "No", "I am not sure"])
		5: 0, // answer is the index in the choices array | Question about: whether comfortable working in a team (choices ["Yes", "No", "I can not say"])
		6: 1 // answer is the index in the choices array | Question about : Which part of web application stack is preferred by the student (choices: ["Front End", "Back End", "Database", "No Preference" ])
	},
	student9: {
		1: {
			"1": [0,1,2,3,4,5,6,7,8,9,10,11],
			"2": [0,1,2,3,4,5,6,7,8,9,10,11],
			"3": [],
			"4": [0,1,2,3,4,5,6,7,8,9,10,11],
			"5": [0,1,2,3,4,5,6,7,8,9,10,11],
			"6": [],
			"7": [7,8,9,10,11],
		}, // Question about: Busy(ness) in Schedule : answer object contains list of busy hours for each day represented as the key in the answer object
		2: [ 0 , 2 ], // answer is the index in the choices array | Question about: Programming Language : Multiple Choice (choices: [ "Python", "Java", "Javascript", "C/C++", "PHP", "Other" ])
		3: ["Spring" , "Django" , "Jest"], // Question about: Programming Frameworks: Multiple values (Max five values)
		4: 0, // answer is the index in the choices array | Question about: whether worked on a building a web application (["Yes", "No", "I am not sure"])
		5: 0, // answer is the index in the choices array | Question about: whether comfortable working in a team (choices ["Yes", "No", "I can not say"])
		6: 3 // answer is the index in the choices array | Question about : Which part of web application stack is preferred by the student (choices: ["Front End", "Back End", "Database", "No Preference" ])
	},
	student10: {
		1: {
			"1": [0,1,2,3,4,5,6,7,8,9,10,11],
			"2": [0,1,2,3,4,5,6,7,8,9,10,11],
			"3": [0,1,2,3,4,5,6,7,8,9,10,11],
			"4": [],
			"5": [],
			"6": [],
			"7": [0,1,2,3,4,5,6,7,8,9,10,11],
		}, // Question about: Busy(ness) in Schedule : answer object contains list of busy hours for each day represented as the key in the answer object
		2: [ 1 ], // answer is the index in the choices array | Question about: Programming Language : Multiple Choice (choices: [ "Python", "Java", "Javascript", "C/C++", "PHP", "Other" ])
		3: ["J2EE" ], // Question about: Programming Frameworks: Multiple values (Max five values)
		4: 0, // answer is the index in the choices array | Question about: whether worked on a building a web application (["Yes", "No", "I am not sure"])
		5: 0, // answer is the index in the choices array | Question about: whether comfortable working in a team (choices ["Yes", "No", "I can not say"])
		6: 2 // answer is the index in the choices array | Question about : Which part of web application stack is preferred by the student (choices: ["Front End", "Back End", "Database", "No Preference" ])
	},
	student11: {
		1: {
			"1": [0,1,2,3,4,5,6,7,8,9,10,11],
			"2": [0,1,2,3,4,5,6,7,8,9,10,11],
			"3": [],
			"4": [0,1,2,3,4,5,6,7,8,9,10,11],
			"5": [0,1,2,3,4,5,6,7,8,9,10,11],
			"6": [],
			"7": [9,10,11],
		}, // Question about: Busy(ness) in Schedule : answer object contains list of busy hours for each day represented as the key in the answer object
		2: [ 5 ], // answer is the index in the choices array | Question about: Programming Language : Multiple Choice (choices: [ "Python", "Java", "Javascript", "C/C++", "PHP", "Other" ])
		3: [], // Question about: Programming Frameworks: Multiple values (Max five values)
		4: 0, // answer is the index in the choices array | Question about: whether worked on a building a web application (["Yes", "No", "I am not sure"])
		5: 0, // answer is the index in the choices array | Question about: whether comfortable working in a team (choices ["Yes", "No", "I can not say"])
		6: 2 // answer is the index in the choices array | Question about : Which part of web application stack is preferred by the student (choices: ["Front End", "Back End", "Database", "No Preference" ])
	},
	student12: {
		1: {
			"1": [4,5,6],
			"2": [0,1,2,3,4,5],
			"3": [0,1,2,3,4,5],
			"4": [0,1,2,3,4,5,],
			"5": [0,1,2,3,4,5,],
			"6": [0,1,2,3,4,5,6,7,8,9,10,11],
			"7": [0,1,2,3,4,5,6],
		}, // Question about: Busy(ness) in Schedule : answer object contains list of busy hours for each day represented as the key in the answer object
		2: [ 0, 2 ], // answer is the index in the choices array | Question about: Programming Language : Multiple Choice (choices: [ "Python", "Java", "Javascript", "C/C++", "PHP", "Other" ])
		3: ["Angular" , "Django"], // Question about: Programming Frameworks: Multiple values (Max five values)
		4: 0, // answer is the index in the choices array | Question about: whether worked on a building a web application (["Yes", "No", "I am not sure"])
		5: 0, // answer is the index in the choices array | Question about: whether comfortable working in a team (choices ["Yes", "No", "I can not say"])
		6: 0 // answer is the index in the choices array | Question about : Which part of web application stack is preferred by the student (choices: ["Front End", "Back End", "Database", "No Preference" ])
	},
	student13: {
		1: {
			"1": [8,9,10,11],
			"2": [0,1,2,3,4],
			"3": [0,1,2,3,4],
			"4": [0,1,2,3,4],
			"5": [6,7,8,9,10,11],
			"6": [0,1,2,3,4,5,6,7,8],
			"7": [],
		}, // Question about: Busy(ness) in Schedule : answer object contains list of busy hours for each day represented as the key in the answer object
		2: [ 1 ], // answer is the index in the choices array | Question about: Programming Language : Multiple Choice (choices: [ "Python", "Java", "Javascript", "C/C++", "PHP", "Other" ])
		3: ["Spring"], // Question about: Programming Frameworks: Multiple values (Max five values)
		4: 2, // answer is the index in the choices array | Question about: whether worked on a building a web application (["Yes", "No", "I am not sure"])
		5: 2, // answer is the index in the choices array | Question about: whether comfortable working in a team (choices ["Yes", "No", "I can not say"])
		6: 3 // answer is the index in the choices array | Question about : Which part of web application stack is preferred by the student (choices: ["Front End", "Back End", "Database", "No Preference" ])
	},
	student14: {
		1: {
			"1": [0,1,2,3,4,5,6],
			"2": [0,1,2,3,4,5,6,7,8,9,10,11],
			"3": [],
			"4": [],
			"5": [0,1,2,3,4,5,6,7,8,9,10,11],
			"6": [0,1,2,3,4,5,6,7,8,9,10,11],
			"7": [],
		}, // Question about: Busy(ness) in Schedule : answer object contains list of busy hours for each day represented as the key in the answer object
		2: [ 3 ], // answer is the index in the choices array | Question about: Programming Language : Multiple Choice (choices: [ "Python", "Java", "Javascript", "C/C++", "PHP", "Other" ])
		3: [], // Question about: Programming Frameworks: Multiple values (Max five values)
		4: 1, // answer is the index in the choices array | Question about: whether worked on a building a web application (["Yes", "No", "I am not sure"])
		5: 0, // answer is the index in the choices array | Question about: whether comfortable working in a team (choices ["Yes", "No", "I can not say"])
		6: 3 // answer is the index in the choices array | Question about : Which part of web application stack is preferred by the student (choices: ["Front End", "Back End", "Database", "No Preference" ])
	},
	student15: {
		1: {
			"1": [],
			"2": [],
			"3": [0,1,2,3,4,5,6,7,8,9,10,11],
			"4": [],
			"5": [0,1,2,3,4,5,6,7,8,9,10,11],
			"6": [0,1,2,3,4,5,6,7,8,9,10,11],
			"7": [],
		}, // Question about: Busy(ness) in Schedule : answer object contains list of busy hours for each day represented as the key in the answer object
		2: [ 1, 2 ], // answer is the index in the choices array | Question about: Programming Language : Multiple Choice (choices: [ "Python", "Java", "Javascript", "C/C++", "PHP", "Other" ])
		3: ["Struts" , "Hapi"], // Question about: Programming Frameworks: Multiple values (Max five values)
		4: 0, // answer is the index in the choices array | Question about: whether worked on a building a web application (["Yes", "No", "I am not sure"])
		5: 1, // answer is the index in the choices array | Question about: whether comfortable working in a team (choices ["Yes", "No", "I can not say"])
		6: 1 // answer is the index in the choices array | Question about : Which part of web application stack is preferred by the student (choices: ["Front End", "Back End", "Database", "No Preference" ])
	},
	student16: {
		1: {
			"1": [],
			"2": [4,5,6,7],
			"3": [7,8,9,10,11],
			"4": [],
			"5": [],
			"6": [0,1,2,3,4],
			"7": [],
		}, // Question about: Busy(ness) in Schedule : answer object contains list of busy hours for each day represented as the key in the answer object
		2: [ 0 ], // answer is the index in the choices array | Question about: Programming Language : Multiple Choice (choices: [ "Python", "Java", "Javascript", "C/C++", "PHP", "Other" ])
		3: ["Flask"], // Question about: Programming Frameworks: Multiple values (Max five values)
		4: 1, // answer is the index in the choices array | Question about: whether worked on a building a web application (["Yes", "No", "I am not sure"])
		5: 0, // answer is the index in the choices array | Question about: whether comfortable working in a team (choices ["Yes", "No", "I can not say"])
		6: 1 // answer is the index in the choices array | Question about : Which part of web application stack is preferred by the student (choices: ["Front End", "Back End", "Database", "No Preference" ])
	},
	student17: {
		1: {
			"1": [0,1,2,3,4],
			"2": [0,1,2,3,4],
			"3": [0,1,2,3,4],
			"4": [6,7,8,9,10,11],
			"5": [6,7,8,9,10,11],
			"6": [0,1,2,3,4,5],
			"7": [],
		}, // Question about: Busy(ness) in Schedule : answer object contains list of busy hours for each day represented as the key in the answer object
		2: [ 0 ], // answer is the index in the choices array | Question about: Programming Language : Multiple Choice (choices: [ "Python", "Java", "Javascript", "C/C++", "PHP", "Other" ])
		3: ["Django"], // Question about: Programming Frameworks: Multiple values (Max five values)
		4: 2, // answer is the index in the choices array | Question about: whether worked on a building a web application (["Yes", "No", "I am not sure"])
		5: 0, // answer is the index in the choices array | Question about: whether comfortable working in a team (choices ["Yes", "No", "I can not say"])
		6: 3 // answer is the index in the choices array | Question about : Which part of web application stack is preferred by the student (choices: ["Front End", "Back End", "Database", "No Preference" ])
	},
	student18: {
		1: {
			"1": [],
			"2": [0,1,2,3,4,5,6,7,8],
			"3": [],
			"4": [0,1,2,3],
			"5": [0,1,2,3,4,5,6,7,8,9,10,11],
			"6": [],
			"7": [],
		}, // Question about: Busy(ness) in Schedule : answer object contains list of busy hours for each day represented as the key in the answer object
		2: [ 1 ], // answer is the index in the choices array | Question about: Programming Language : Multiple Choice (choices: [ "Python", "Java", "Javascript", "C/C++", "PHP", "Other" ])
		3: ["Spring" , "J2EE"], // Question about: Programming Frameworks: Multiple values (Max five values)
		4: 0, // answer is the index in the choices array | Question about: whether worked on a building a web application (["Yes", "No", "I am not sure"])
		5: 0, // answer is the index in the choices array | Question about: whether comfortable working in a team (choices ["Yes", "No", "I can not say"])
		6: 2 // answer is the index in the choices array | Question about : Which part of web application stack is preferred by the student (choices: ["Front End", "Back End", "Database", "No Preference" ])
	},
	student19: {
		1: {
			"1": [0,1,2,3,4,5,6,7,8,9,10,11],
			"2": [0,1,2,3,4,5,6,7,8],
			"3": [],
			"4": [0,1,2,3],
			"5": [0,1,2,3],
			"6": [0,1,2,3,4,5,6,7,8,9,10,11],
			"7": [],
		}, // Question about: Busy(ness) in Schedule : answer object contains list of busy hours for each day represented as the key in the answer object
		2: [ 0 ], // answer is the index in the choices array | Question about: Programming Language : Multiple Choice (choices: [ "Python", "Java", "Javascript", "C/C++", "PHP", "Other" ])
		3: ["Flask" , "J2EE" ], // Question about: Programming Frameworks: Multiple values (Max five values)
		4: 0, // answer is the index in the choices array | Question about: whether worked on a building a web application (["Yes", "No", "I am not sure"])
		5: 0, // answer is the index in the choices array | Question about: whether comfortable working in a team (choices ["Yes", "No", "I can not say"])
		6: 1 // answer is the index in the choices array | Question about : Which part of web application stack is preferred by the student (choices: ["Front End", "Back End", "Database", "No Preference" ])
	},
	student20: {
		1: {
			"1": [0,1,2,3,4,5,6,7,8,9,10,11],
			"2": [],
			"3": [6,7,8,9,10,11],
			"4": [],
			"5": [0,1,2,3,4,5,6,7,8,9,10,11],
			"6": [],
			"7": [0,1,2,3,4,5,6,7,8,9,10,11],
		}, // Question about: Busy(ness) in Schedule : answer object contains list of busy hours for each day represented as the key in the answer object
		2: [ 3 ], // answer is the index in the choices array | Question about: Programming Language : Multiple Choice (choices: [ "Python", "Java", "Javascript", "C/C++", "PHP", "Other" ])
		3: [], // Question about: Programming Frameworks: Multiple values (Max five values)
		4: 1, // answer is the index in the choices array | Question about: whether worked on a building a web application (["Yes", "No", "I am not sure"])
		5: 0, // answer is the index in the choices array | Question about: whether comfortable working in a team (choices ["Yes", "No", "I can not say"])
		6: 3 // answer is the index in the choices array | Question about : Which part of web application stack is preferred by the student (choices: ["Front End", "Back End", "Database", "No Preference" ])
	},
	student21: {
		1: {
			"1": [],
			"2": [0,1,2,6,7,8,9,10,11],
			"3": [],
			"4": [5,6,7,8,9,10,11],
			"5": [],
			"6": [0,1,2,3,4,5,6,7,8,9,10,11],
			"7": [0,1,2,3,4,5,6,7,8,9,10,11],
		}, // Question about: Busy(ness) in Schedule : answer object contains list of busy hours for each day represented as the key in the answer object
		2: [ 3 ], // answer is the index in the choices array | Question about: Programming Language : Multiple Choice (choices: [ "Python", "Java", "Javascript", "C/C++", "PHP", "Other" ])
		3: [], // Question about: Programming Frameworks: Multiple values (Max five values)
		4: 2, // answer is the index in the choices array | Question about: whether worked on a building a web application (["Yes", "No", "I am not sure"])
		5: 0, // answer is the index in the choices array | Question about: whether comfortable working in a team (choices ["Yes", "No", "I can not say"])
		6: 1 // answer is the index in the choices array | Question about : Which part of web application stack is preferred by the student (choices: ["Front End", "Back End", "Database", "No Preference" ])
	},
	student22: {
		1: {
			"1": [0,1,2,3,4,5,6,7,8,9,10,11],
			"2": [],
			"3": [6,7,8,9,10,11],
			"4": [],
			"5": [],
			"6": [0,1,2,3,4,5,6,7,8,9,10,11],
			"7": [0,1,2,3,4,5,6,7,8,9,10,11],
		}, // Question about: Busy(ness) in Schedule : answer object contains list of busy hours for each day represented as the key in the answer object
		2: [ 2, 4 ], // answer is the index in the choices array | Question about: Programming Language : Multiple Choice (choices: [ "Python", "Java", "Javascript", "C/C++", "PHP", "Other" ])
		3: ["Hapi" , "Laravel"], // Question about: Programming Frameworks: Multiple values (Max five values)
		4: 0, // answer is the index in the choices array | Question about: whether worked on a building a web application (["Yes", "No", "I am not sure"])
		5: 0, // answer is the index in the choices array | Question about: whether comfortable working in a team (choices ["Yes", "No", "I can not say"])
		6: 1 // answer is the index in the choices array | Question about : Which part of web application stack is preferred by the student (choices: ["Front End", "Back End", "Database", "No Preference" ])
	},
	student23: {
		1: {
			"1": [6,8,9,10,11],
			"2": [0,1,2,3,4,5,6],
			"3": [0,1,2,3,4,5,6,7],
			"4": [],
			"5": [],
			"6": [0,1,2,3,4,5,6,7,8,9,10,11],
			"7": [],
		}, // Question about: Busy(ness) in Schedule : answer object contains list of busy hours for each day represented as the key in the answer object
		2: [ 0, 3 ], // answer is the index in the choices array | Question about: Programming Language : Multiple Choice (choices: [ "Python", "Java", "Javascript", "C/C++", "PHP", "Other" ])
		3: ["Django", "pytest", "some other"], // Question about: Programming Frameworks: Multiple values (Max five values)
		4: 0, // answer is the index in the choices array | Question about: whether worked on a building a web application (["Yes", "No", "I am not sure"])
		5: 2, // answer is the index in the choices array | Question about: whether comfortable working in a team (choices ["Yes", "No", "I can not say"])
		6: 3 // answer is the index in the choices array | Question about : Which part of web application stack is preferred by the student (choices: ["Front End", "Back End", "Database", "No Preference" ])
	},
	student24: {
		1: {
			"1": [],
			"2": [5,6,7,8,9,10,11],
			"3": [0,1,2,3,4,5],
			"4": [0,1,2,3,4,5,6,7,8,9,10,11],
			"5": [0,1,2,3,4],
			"6": [7,8,9,10,11],
			"7": [7,8,9,10,11],
		}, // Question about: Busy(ness) in Schedule : answer object contains list of busy hours for each day represented as the key in the answer object
		2: [ 1 ], // answer is the index in the choices array | Question about: Programming Language : Multiple Choice (choices: [ "Python", "Java", "Javascript", "C/C++", "PHP", "Other" ])
		3: ["Struts"], // Question about: Programming Frameworks: Multiple values (Max five values)
		4: 0, // answer is the index in the choices array | Question about: whether worked on a building a web application (["Yes", "No", "I am not sure"])
		5: 2, // answer is the index in the choices array | Question about: whether comfortable working in a team (choices ["Yes", "No", "I can not say"])
		6: 3 // answer is the index in the choices array | Question about : Which part of web application stack is preferred by the student (choices: ["Front End", "Back End", "Database", "No Preference" ])
	}
}

module.exports = { mockRoster, mockCourse, mockUpdateCourse, mockSurvey, mockUpdateSurvey, mockSurveyAllAnswers }