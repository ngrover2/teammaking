
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

const invalidMockCourseCode = 'ANINVALIDMOCKCOURSECODETHATSHOULDNOTEXIST';

module.exports = [ mockRoster, mockCourse, mockUpdateCourse ]