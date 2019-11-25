

CREATE TABLE songs
	(song_id integer auto_increment primary key,
    artist varchar(100) not null,
    title varchar(500) not null,
		rank integer not null
    );
    
CREATE TABLE 
			Professor(
				professor_id INT auto_increment NOT NULL primary key,
				name varchar(100) NOT NULL,
                email varchar(100) NOT NULL,
                university varchar(100) default NULL,
                university_id varchar(100) not null
);

CREATE TABLE
				Course(
					course_id int auto_increment NOT NULL,
                    professor_id int DEFAULT NULL,
                    course_code varchar(100) NOT NULL,
                    course_name varchar(100),
                    course_desc varchar(500),
                    start_date timestamp NOT NULL,
                    end_date timestamp NOT NULL default '2037-12-31 23:59:59',
					start_month_name varchar(10) NOT NULL,
                    start_month_num varchar(10) NOT NULL,
                    start_day_name varchar(10) NOT NULL,
                    start_day_num tinyint NOT NULL,
                    start_year_num varchar(10) NOT NULL,
                    start_week_of_month_num tinyint NOT NULL,
                    constraint primary key(course_id),
                    constraint foreign key (professor_id) references Professor (professor_id) ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE
				Roster(
					roster_id int auto_increment NOT NULL,
                    professor_id int DEFAULT NULL,
                    course_id int UNIQUE NOT NULL,
                    constraint primary key(roster_id),
                    constraint foreign key (course_id) references Course (course_id) ON DELETE CASCADE ON UPDATE CASCADE,
                    constraint foreign key (professor_id) references Professor (professor_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE
				RosterHeaderRow(
					roster_id  int NOT NULL UNIQUE,
                    course_id int UNIQUE NOT NULL,
                    col1_name varchar(100) NOT NULL,
                    col2_name varchar(100) DEFAULT NULL,
                    col3_name varchar(100) DEFAULT NULL,
                    col4_name varchar(100) DEFAULT NULL,
					col5_name varchar(100) DEFAULT NULL,
                    col6_name varchar(100) DEFAULT NULL,
                    col7_name varchar(100) DEFAULT NULL,
                    col8_name varchar(100) DEFAULT NULL,
                    col9_name varchar(100) DEFAULT NULL,
                    col10_name varchar(100) DEFAULT NULL,
                    col1_mandatory bit DEFAULT 0,
                    col2_mandatory bit DEFAULT 0,
                    col3_mandatory bit DEFAULT 0,
                    col4_mandatory bit DEFAULT 0,
                    col5_mandatory bit DEFAULT 0,
                    col6_mandatory bit DEFAULT 0,
                    col7_mandatory bit DEFAULT 0,
                    col8_mandatory bit DEFAULT 0,
                    col9_mandatory bit DEFAULT 0,
                    col10_mandatory bit DEFAULT 0,
                    constraint primary key(roster_id),
                    constraint foreign key (roster_id) references Roster (roster_id) ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE
				RosterRow(
					roster_row_id int auto_increment not null,
					roster_id int NOT NULL,
                    course_id int default null,
                    professor_id int default null,
                    constraint primary key(roster_row_id),
                    constraint foreign key (roster_id) references Roster (roster_id) ON DELETE CASCADE ON UPDATE CASCADE,
                    constraint foreign key (course_id) references Course (course_id) ON DELETE CASCADE ON UPDATE CASCADE,
                    constraint foreign key (professor_id) references Professor (professor_id) ON DELETE CASCADE ON UPDATE CASCADE
);

SELECT *
FROM RosterRow;

INSERT INTO RosterRow 
VALUES (3,1,1,1);

INSERT INTO RosterRow 
VALUES (4,1,1,1);

INSERT INTO RosterRow 
VALUES (5,1,1,1);

INSERT INTO RosterRow 
VALUES (6,1,1,1);


CREATE TABLE
				RowColumnOne(
					id int auto_increment NOT NULL,
					value varchar(100) NOT NULL,
                    roster_row_id int NOT NULL,
                    constraint primary key(id),
                    constraint foreign key (roster_row_id) references RosterRow (roster_row_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE
				RowColumnTwo(
					id int auto_increment NOT NULL,
					value varchar(100) NOT NULL,
                    roster_row_id int NOT NULL,
                    constraint primary key(id),
                    constraint foreign key (roster_row_id) references RosterRow (roster_row_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE
				RowColumnThree(
					id int auto_increment NOT NULL,
					value varchar(100) NOT NULL,
                    roster_row_id int NOT NULL,
                    constraint primary key(id),
                    constraint foreign key (roster_row_id) references RosterRow (roster_row_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE
				RowColumnFour(
					id int auto_increment NOT NULL,
					value varchar(100) NOT NULL,
                    roster_row_id int NOT NULL,
                    constraint primary key(id),
                    constraint foreign key (roster_row_id) references RosterRow (roster_row_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE
				RowColumnFive(
					id int auto_increment NOT NULL,
					value varchar(100) NOT NULL,
                    roster_row_id int NOT NULL,
                    constraint primary key(id),
                    constraint foreign key (roster_row_id) references RosterRow (roster_row_id) ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE
				RowColumnSix(
					id int auto_increment NOT NULL,
					value varchar(100) NOT NULL,
                    roster_row_id int NOT NULL,
                    constraint primary key(id),
                    constraint foreign key (roster_row_id) references RosterRow (roster_row_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE
				RowColumnSeven(
					id int auto_increment NOT NULL,
					value varchar(100) NOT NULL,
                    roster_row_id int NOT NULL,
                    constraint primary key(id),
                    constraint foreign key (roster_row_id) references RosterRow (roster_row_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE
				RowColumnEight(
					id int auto_increment NOT NULL,
					value varchar(100) NOT NULL,
                    roster_row_id int NOT NULL,
                    constraint primary key(id),
                    constraint foreign key (roster_row_id) references RosterRow (roster_row_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE
				RowColumnNine(
					id int auto_increment NOT NULL,
					value varchar(100) NOT NULL,
                    roster_row_id int NOT NULL,
                    constraint primary key(id),
                    constraint foreign key (roster_row_id) references RosterRow (roster_row_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE
				RowColumnTen(
					id int auto_increment NOT NULL,
					value varchar(100) NOT NULL,
                    roster_row_id int NOT NULL,
                    constraint primary key(id),
                    constraint foreign key (roster_row_id) references RosterRow (roster_row_id) ON DELETE CASCADE ON UPDATE CASCADE
);


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

SELECT course_id
FROM Course;

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


INSERT INTO RosterRow (`roster_id`, `course_id`, `professor_id`) 
VALUES('1', '1', '1');

INSERT INTO RosterRow (`roster_id`, `course_id`, `professor_id`) 
VALUES('1', '1', '1');

SELECT *
FROM RosterRow;

INSERT INTO 
					Roster(
							professor_id,
							course_id)
                    VALUES(
							1,
                            1
);




TRUNCATE TABLE songs;
INSERT INTO songs(artist, title, rank) values("The Who", "Baba O'Riley", 1);
INSERT INTO songs(artist, title, rank) values("Michael Jackson", "Beat it", 2);
INSERT INTO songs(artist, title, rank) values("Rihanna Ft. Eminem", "Love The Way You Lie", 3);
INSERT INTO songs(artist, title, rank) values("Ed Sheeran", "Shape Of You", 5);
INSERT INTO songs(artist, title, rank) values("Adele", "Rolling In The Deep", 4);
INSERT INTO songs(artist, title, rank) values("Aerosmith", "I Dont Want To Miss A Thing", 6);
INSERT INTO songs(artist, title, rank) values("Linking Park", "What I've done", 7);
INSERT INTO songs(artist, title, rank) values("The Fray", "How to Save A Life", 8);
INSERT INTO songs(artist, title, rank) values("Pink Floyd", "Comfortably Numb", 9);
INSERT INTO songs(artist, title, rank) values("Selena Gomez", "It Ain't Me", 10);
INSERT INTO songs(artist, title, rank) values("Arijit Singh", "Kabira", 11);
INSERT INTO songs(artist, title, rank) values("Coldplay", "Hymn For The Weekend", 12);
INSERT INTO songs(artist, title, rank) values("James Blunt", "1973", 13);




CREATE TABLE Survey ( survey_id integer auto_increment not null primary key , 
prof_id int ,
 course_id int ,
 deadline datetime,
 foreign key (prof_id) references Professor (professor_id)  ,
 foreign key (course_id) references Course (course_id) );
 
 SELECT *
 FROM Survey;
 
 
 
 INSERT INTO Survey (prof_id , course_id, deadline)
 VALUES ('1','1','2019-10-12 10:21:17');
 
 CREATE TABLE Questions (survey_id int not null , question_object JSON , constraint foreign key (survey_id) references Survey (survey_id) );



INSERT INTO Questions
VALUES ('2', '{"type":"mcq",
        "question":"3.What languages do you know",
        "options":["python","c++", "java"]
    }');

select *
from Questions;

INSERT INTO Questions
VALUES ('2', '{"type":"radio",
        "question":"2.How comfortable are you on web developement projects",
        "options":["very comfortable","comfortable","not at all comfortable"]
    }');


INSERT INTO Questions
VALUES ('2', '{"type":"radio",
        "question":" 1.Do you like working on the weekends",
        "options":["yes","no", "hell no"]
    }');


CREATE TABLE Answers (survey_id int not null , answer_object JSON , roster_row_id int not null , constraint foreign key (survey_id) references Survey (survey_id), constraint foreign key (roster_row_id) references RosterRow (roster_row_id) );



select *
from Answers;


INSERT INTO Answers (survey_id , answer_object, roster_row_id)
VALUES ('2','{"type":"freeform",
        "answer":"1. yes"}','2');
        
INSERT INTO Answers (survey_id , answer_object, roster_row_id)
VALUES ('2','{"type":"freeform",
        "answer":"1. hell no"}','1');
        
INSERT INTO Answers (survey_id , answer_object, roster_row_id)
VALUES ('2','{"type":"freeform",
        "answer":"2. not at all comfortable"}','1');
        
INSERT INTO Answers (survey_id , answer_object, roster_row_id)
VALUES ('2','{"type":"freeform",
        "answer":"2. very comfortable"}','2');
        
INSERT INTO Answers (survey_id , answer_object, roster_row_id)
VALUES ('2','{"type":"freeform",
        "answer":"3. python"}','1');

INSERT INTO Answers (survey_id , answer_object, roster_row_id)
VALUES ('2','{"type":"freeform",
        "answer":"3. java"}','2');
        
        
INSERT INTO Answers (survey_id , answer_object, roster_row_id)
VALUES ('2','{"type":"freeform",
        "answer":"1. yes"}','4');
        
INSERT INTO Answers (survey_id , answer_object, roster_row_id)
VALUES ('2','{"type":"freeform",
        "answer":"1. hell no"}','3');
        
INSERT INTO Answers (survey_id , answer_object, roster_row_id)
VALUES ('2','{"type":"freeform",
        "answer":"2. not at all comfortable"}','3');
        
INSERT INTO Answers (survey_id , answer_object, roster_row_id)
VALUES ('2','{"type":"freeform",
        "answer":"2. very comfortable"}','4');
        
INSERT INTO Answers (survey_id , answer_object, roster_row_id)
VALUES ('2','{"type":"freeform",
        "answer":"3. python"}','3');

INSERT INTO Answers (survey_id , answer_object, roster_row_id)
VALUES ('2','{"type":"freeform",
        "answer":"3. java"}','4');
	
    
    
INSERT INTO Answers (survey_id , answer_object, roster_row_id)
VALUES ('2','{"type":"freeform",
        "answer":"1. yes"}','6');
        
INSERT INTO Answers (survey_id , answer_object, roster_row_id)
VALUES ('2','{"type":"freeform",
        "answer":"1. hell no"}','5');
        
INSERT INTO Answers (survey_id , answer_object, roster_row_id)
VALUES ('2','{"type":"freeform",
        "answer":"2. not at all comfortable"}','5');
        
INSERT INTO Answers (survey_id , answer_object, roster_row_id)
VALUES ('2','{"type":"freeform",
        "answer":"2. comfortable"}','6');
        
INSERT INTO Answers (survey_id , answer_object, roster_row_id)
VALUES ('2','{"type":"freeform",
        "answer":"3. python"}','5');

INSERT INTO Answers (survey_id , answer_object, roster_row_id)
VALUES ('2','{"type":"freeform",
        "answer":"3. python"}','6');    
    
create table student_teams (team_id integer auto_increment not null primary key, survey_id int not null , roster_row_id int not null, constraint foreign key (survey_id) references Survey (survey_id) ,constraint foreign key (roster_row_id) references RosterRow (roster_row_id)  );

select *
from Survey;

insert into student_teams (survey_id , roster_row_id) 
values (1 , 1);

insert into student_teams (survey_id , roster_row_id) 
values (1 , 2);

insert into student_teams (survey_id , roster_row_id) 
values (2 , 3);

insert into student_teams (survey_id , roster_row_id) 
values (2 , 4);

select *
from student_teams;


select roster_row_id
from RosterRow;


SELECT *
FROM Answers;


