
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
	course_code: 'CC1234',
	professor_name: 'Harini Ramaprasad',
	course_id: '13'
}

const mockCourse = {
	course_code: 'ITCS TEST',
	course_name: 'test',
	course_description: 'This is a test course',
	ta_name: 'test ta',
	ta_email: 'testta@email.com',
	professor_id: '1',
	start_date: '2019-11-09 18:30:00',
	end_date: '2019-11-29 18:30:00',
	class_start_time: '04:02:00',
	class_end_time: '04:02:00'
}

module.exports = [ mockRoster, mockCourse ]