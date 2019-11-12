
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
				qtype: "text",
				qtext: "Mock text type question, am I ?",
				qweight: "Little Important"
			},
			{
				qtype: "multiplechoice",
				qtext: "Mock MCQ type question, am I ?",
				qweight: "Little Important",
				choices: ["Am I", "Am I not", "Not sure", "Semms legit", "Other"]
			},
			{
				qtype: "multiplevalues",
				qtext: "Mock multiple values type question, am I ?",
				qweight: "Little Important",
				qMaxVals: 4
			},
			{
				qtype: "singlechoice",
				qtext: "Mock single choice type question, am I ?",
				qweight: "Little Important",
				choices: ["this one", "that one", "None", "All"],
				defaultChoice: "this one",
				defaultSelected: true
			}
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

module.exports = { mockRoster, mockCourse, mockUpdateCourse, mockSurvey, mockUpdateSurvey }