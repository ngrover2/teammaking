-- drop database teammaking;
-- 
-- create database teammaking;
-- 
-- use teammaking;

-- SET sql_mode = '';

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

-- CREATE TABLE
-- 				RosterRow(
-- 					roster_row_id int auto_increment not null,
-- 					roster_id int NOT NULL,
--                     course_id int default null,
--                     professor_id int default null,
--                     col1_id int DEFAULT NULL,
--                     col2_id int DEFAULT NULL,
--                     col3_id int DEFAULT NULL,
--                     col4_id int DEFAULT NULL,
--                     col5_id int DEFAULT NULL,
--                     col6_id int DEFAULT NULL,
--                     col7_id int DEFAULT NULL,
--                     col8_id int DEFAULT NULL,
--                     col9_id int DEFAULT NULL,
--                     col10_id int DEFAULT NULL,
--                     col1_type varchar(10) DEFAULT NULL,
--                     col2_type varchar(10) DEFAULT NULL,
--                     col3_type varchar(10) DEFAULT NULL,
--                     col4_type varchar(10) DEFAULT NULL,
--                     col5_type varchar(10) DEFAULT NULL,
--                     col6_type varchar(10) DEFAULT NULL,
--                     col7_type varchar(10) DEFAULT NULL,
--                     col8_type varchar(10) DEFAULT NULL,
--                     col9_type varchar(10) DEFAULT NULL,
--                     col10_type varchar(10) DEFAULT NULL,
--                     constraint primary key(roster_row_id),
--                     constraint foreign key (roster_id) references Roster (roster_id) ON DELETE CASCADE ON UPDATE CASCADE,
--                     constraint foreign key (course_id) references Course (course_id) ON DELETE CASCADE ON UPDATE CASCADE,
--                     constraint foreign key (professor_id) references Professor (professor_id) ON DELETE CASCADE ON UPDATE CASCADE,
--                     constraint foreign key (col1_id) references RowColumnOne (id) ON DELETE CASCADE ON UPDATE CASCADE,
--                     constraint foreign key (col2_id) references RowColumnTwo (id) ON DELETE CASCADE ON UPDATE CASCADE,
--                     constraint foreign key (col3_id) references RowColumnThree (id) ON DELETE CASCADE ON UPDATE CASCADE,
--                     constraint foreign key (col4_id) references RowColumnFour (id) ON DELETE CASCADE ON UPDATE CASCADE,
--                     constraint foreign key (col5_id) references RowColumnFive (id) ON DELETE CASCADE ON UPDATE CASCADE,
--                     constraint foreign key (col6_id) references RowColumnSix (id) ON DELETE CASCADE ON UPDATE CASCADE,
--                     constraint foreign key (col7_id) references RowColumnSeven (id) ON DELETE CASCADE ON UPDATE CASCADE,
--                     constraint foreign key (col8_id) references RowColumnEight (id) ON DELETE CASCADE ON UPDATE CASCADE,
--                     constraint foreign key (col9_id) references RowColumnNine (id) ON DELETE CASCADE ON UPDATE CASCADE,
--                     constraint foreign key (col10_id) references RowColumnTen (id) ON DELETE CASCADE ON UPDATE CASCADE
-- );

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