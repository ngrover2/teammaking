-- Sample data to add data to database.
-- Professor

INSERT INTO 
	Professor (
		name, 
		email, 
        university, 
        university_id
	)
		VALUES(
			"Harini Ramaprasad",
            "harini@email.com",
            "University of the World",
            "UN123456"
);



-- COURSE

INSERT INTO 
	Course (
		professor_id, 
		course_code, 
        course_name, 
        course_desc,
        start_date,
		start_month_name,
		start_month_num,
		start_day_name,
		start_day_num,
		start_year_num,
		start_week_of_month_num
	)
		VALUES(
			1,
            "CC1234",
            "Software System Design and Principles",
            "This program would teach students the fundamental principles and best practices for a good software design and software architecture",
            NOW(),
            MONTHNAME(DATE(NOW())),
            MONTH(DATE(NOW())),
            DAYNAME(DATE(NOW())),
            DAY(DATE(NOW())),
            YEAR(DATE(NOW())),
            WEEK(DATE(NOW()))
);

select * from Course;
delete from Course where course_id = 2;

delete from Roster where roster_id > 0;
describe Roster;


select * from RosterHeaderRow;
delete from RosterHeaderRow where roster_id = 1;
delete from RosterRow where roster_row_id > 7;
describe RosterRow;
select * from RosterRow;
truncate RosterRow;

select * from RowColumnOne;
select * from RowColumnTwo;

INSERT INTO RosterRow (`roster_id`, `course_id`, `professor_id`) VALUES( (1, 1, 1),(2, 2, 2));
-- Roster

DESCRIBE RosterRow;

INSERT INTO 
					Roster(
							professor_id,
							course_id)
                    VALUES(
							1,
                            1
);

INSERT INTO 
	RosterHeaderRow (
					roster_id,
                    course_id,
                    col1_name,
                    col2_name,
                    col3_name,
                    col4_name,
					col5_name,
                    col1_mandatory,
                    col2_mandatory,
                    col3_mandatory
	)
		VALUES(
            1,
            1,
            "student id",
            "name",
            "email",
            "skill",
            "age",
            
            1,
            1,
            1
);


INSERT INTO 
			RosterRow(
						roster_id,
                        course_id,
                        professor_id
            )
            VALUES(
						1,
                        1,
                        1
            );


-- student id
INSERT INTO 
			RowColumnOne(
                        value,
                        roster_row_id
            )
            VALUES(
						"80008000",
                        1
);

-- student email
INSERT INTO 
			RowColumnTwo(
                        value,
                        roster_row_id
            )
            VALUES(
						"Name2 Last2",
                        1
);

-- student skills
INSERT INTO
			RowColumnThree(
                        value,
                        roster_row_id
            )
            VALUES(
						"name2@email.com",
                        1
);

INSERT INTO 
			RowColumnFour(
                        value,
                        roster_row_id
            )
            VALUES(
						"javascript",
                        1
);

INSERT INTO 
			RowColumnFour(
                        value,
                        roster_row_id
            )
            VALUES(
						"react",
                        1
);

-- student name
INSERT INTO 
			RowColumnFour(
                        value,
                        roster_row_id
            )
            VALUES(
						"python",
                        1
);

-- student age
INSERT INTO 
			RowColumnFive(
                        value,
                        roster_row_id
            )
            VALUES(
						"28",
                        1
);


-- Get roster data by roster id
SELECT 
	RH.roster_id,
    0 row_id,
	RH.col1_name,
    RH.col2_name,
    RH.col3_name,
    RH.col4_name,
    RH.col5_name,
    RH.col6_name
FROM 
	Roster R
    INNER JOIN RosterHeaderRow RH USING(roster_id)
    INNER JOIN Course C ON C.course_id = R.course_id
WHERE
	C.course_code = 'CC1234'
UNION
SELECT
	R.roster_id,
    RR.roster_row_id row_id,
	GROUP_CONCAT(DISTINCT RC1.value ORDER BY RC1.value desc SEPARATOR ',') AS col1_value,
    GROUP_CONCAT(DISTINCT RC2.value ORDER BY RC2.value desc SEPARATOR ',') AS col2_value,
    GROUP_CONCAT(DISTINCT RC3.value ORDER BY RC3.value desc SEPARATOR ',') AS col3_value,
    GROUP_CONCAT(DISTINCT RC4.value ORDER BY RC4.value desc SEPARATOR ',') AS col4_value,
    GROUP_CONCAT(DISTINCT RC5.value ORDER BY RC5.value desc SEPARATOR ',') AS col5_value,
    GROUP_CONCAT(DISTINCT RC6.value ORDER BY RC6.value desc SEPARATOR ',') AS col6_value
FROM
	Roster R
    INNER JOIN Course C USING(course_id)
    INNER JOIN RosterHeaderRow RH USING(roster_id)
    INNER JOIN RosterRow RR USING (roster_id)
    LEFT JOIN RowColumnOne RC1 USING(roster_row_id)
    LEFT JOIN RowColumnTwo RC2 USING(roster_row_id)
    LEFT JOIN RowColumnThree RC3 USING(roster_row_id)
    LEFT JOIN RowColumnFour RC4 USING(roster_row_id)
    LEFT JOIN RowColumnFive RC5 USING(roster_row_id)
    LEFT JOIN RowColumnSix RC6 USING(roster_row_id)
WHERE
	C.course_code = 'CC1234'
GROUP BY row_id;




SELECT R.roster_id, C.course_id, P.professor_id FROM Professor P LEFT JOIN Roster R USING (professor_id) LEFT JOIN Course C USING (professor_id) WHERE P.name = 'Harini Ramaprasad' AND C.course_code = 'CC1234'