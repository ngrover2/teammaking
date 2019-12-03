CREATE DATABASE  IF NOT EXISTS `teammaking`;
USE `teammaking`;
-- MySQL dump 10.13  Distrib 5.7.17, for macos10.12 (x86_64)
--
-- Host: 127.0.0.1    Database: teammaking
-- ------------------------------------------------------
-- Server version	5.7.27

--
-- Table structure for table `Course`
--

DROP TABLE IF EXISTS `Course`;
CREATE TABLE `Course` (
  `course_id` int(11) NOT NULL AUTO_INCREMENT,
  `professor_id` int(11) DEFAULT NULL,
  `course_code` varchar(100) NOT NULL,
  `course_name` varchar(100) DEFAULT NULL,
  `course_desc` varchar(500) DEFAULT NULL,
  `start_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `end_date` timestamp NOT NULL DEFAULT '2037-12-31 18:29:59',
  `timings_start` time DEFAULT '23:59:59',
  `timings_end` time DEFAULT '23:59:59',
  `ta_email` varchar(100) DEFAULT NULL,
  `ta_name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`course_id`),
  KEY `professor_id` (`professor_id`),
  CONSTRAINT `course_ibfk_1` FOREIGN KEY (`professor_id`) REFERENCES `Professor` (`professor_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=88 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Course`
--

LOCK TABLES `Course` WRITE;
INSERT INTO `Course` VALUES 
(12,1,'saa;','SSDI','smnd;cnw;','2019-10-01 13:00:00','2019-10-03 13:00:00','03:34:00','03:34:00','sd;n;v','sc;lnd'),
(13,1,'ITCS 312','test','Test Course','2019-11-18 13:00:00','2019-11-17 13:00:00','04:44:00','04:44:00','ta@email.com','ta'),
(14,1,'ITCS 3122','test','Test Course','2019-11-18 13:00:00','2019-11-17 13:00:00','04:44:00','04:44:00','ta@email.com','ta'),
(17,1,'ITCS TEST2','test','This is a test course','2019-11-09 13:00:00','2019-11-29 13:00:00','04:02:00','04:02:00','testta@email.com','test ta'),
(87,1,'ITCS TEST','Test Course','This Course teaches you about the facts about life (and people and illnesses and death!, but not by Loopus)','2019-07-09 13:00:00','2019-12-12 13:00:00','02:30:00','05:15:00','SeekerOfVicodine@EverybodyLies.com','Gregory House');
UNLOCK TABLES;

--
-- Table structure for table `Professor`
--

DROP TABLE IF EXISTS `Professor`;
CREATE TABLE `Professor` (
  `professor_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `university` varchar(100) DEFAULT NULL,
  `university_id` varchar(100) NOT NULL,
  PRIMARY KEY (`professor_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Professor`
--

LOCK TABLES `Professor` WRITE;
INSERT INTO `Professor` VALUES (1,'Harini Ramaprasad','harini@email.com','University of the World','UN123456');
UNLOCK TABLES;

--
-- Table structure for table `Roster`
--

DROP TABLE IF EXISTS `Roster`;
CREATE TABLE `Roster` (
  `roster_id` int(11) NOT NULL AUTO_INCREMENT,
  `professor_id` int(11) DEFAULT NULL,
  `course_id` int(11) NOT NULL,
  PRIMARY KEY (`roster_id`),
  UNIQUE KEY `course_id` (`course_id`),
  KEY `professor_id` (`professor_id`),
  CONSTRAINT `roster_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `Course` (`course_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `roster_ibfk_2` FOREIGN KEY (`professor_id`) REFERENCES `Professor` (`professor_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Roster`
--

LOCK TABLES `Roster` WRITE;
INSERT INTO `Roster` VALUES (23,1,12),(24,1,13);
UNLOCK TABLES;

--
-- Table structure for table `RosterHeaderRow`
--

DROP TABLE IF EXISTS `RosterHeaderRow`;
CREATE TABLE `RosterHeaderRow` (
  `roster_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `col1_name` varchar(100) NOT NULL,
  `col2_name` varchar(100) DEFAULT NULL,
  `col3_name` varchar(100) DEFAULT NULL,
  `col4_name` varchar(100) DEFAULT NULL,
  `col5_name` varchar(100) DEFAULT NULL,
  `col6_name` varchar(100) DEFAULT NULL,
  `col7_name` varchar(100) DEFAULT NULL,
  `col8_name` varchar(100) DEFAULT NULL,
  `col9_name` varchar(100) DEFAULT NULL,
  `col10_name` varchar(100) DEFAULT NULL,
  `col1_mandatory` bit(1) DEFAULT b'0',
  `col2_mandatory` bit(1) DEFAULT b'0',
  `col3_mandatory` bit(1) DEFAULT b'0',
  `col4_mandatory` bit(1) DEFAULT b'0',
  `col5_mandatory` bit(1) DEFAULT b'0',
  `col6_mandatory` bit(1) DEFAULT b'0',
  `col7_mandatory` bit(1) DEFAULT b'0',
  `col8_mandatory` bit(1) DEFAULT b'0',
  `col9_mandatory` bit(1) DEFAULT b'0',
  `col10_mandatory` bit(1) DEFAULT b'0',
  PRIMARY KEY (`roster_id`),
  UNIQUE KEY `roster_id` (`roster_id`),
  UNIQUE KEY `course_id` (`course_id`),
  CONSTRAINT `rosterheaderrow_ibfk_1` FOREIGN KEY (`roster_id`) REFERENCES `Roster` (`roster_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `RosterHeaderRow`
--

LOCK TABLES `RosterHeaderRow` WRITE;
INSERT INTO `RosterHeaderRow` VALUES (23,12,'name','email','skill','age','studentId',NULL,NULL,NULL,NULL,NULL,'\0','\0','\0','\0','\0','\0','\0','\0','\0','\0'),(24,13,'name','email','skill','age','studentId',NULL,NULL,NULL,NULL,NULL,'\0','\0','\0','\0','\0','\0','\0','\0','\0','\0');
UNLOCK TABLES;

--
-- Table structure for table `RosterRow`
--

DROP TABLE IF EXISTS `RosterRow`;
CREATE TABLE `RosterRow` (
  `roster_row_id` int(11) NOT NULL AUTO_INCREMENT,
  `roster_id` int(11) NOT NULL,
  `course_id` int(11) DEFAULT NULL,
  `professor_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`roster_row_id`),
  KEY `roster_id` (`roster_id`),
  KEY `course_id` (`course_id`),
  KEY `professor_id` (`professor_id`),
  CONSTRAINT `rosterrow_ibfk_1` FOREIGN KEY (`roster_id`) REFERENCES `Roster` (`roster_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rosterrow_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `Course` (`course_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rosterrow_ibfk_3` FOREIGN KEY (`professor_id`) REFERENCES `Professor` (`professor_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=133 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `RosterRow`
--

LOCK TABLES `RosterRow` WRITE;
INSERT INTO `RosterRow` VALUES (41,23,12,1),(42,23,12,1),(43,23,12,1),(44,23,12,1),(45,24,13,1),(46,24,13,1),(47,24,13,1),(48,24,13,1);
UNLOCK TABLES;

--
-- Table structure for table `RowColumnEight`
--

DROP TABLE IF EXISTS `RowColumnEight`;
CREATE TABLE `RowColumnEight` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `value` varchar(100) NOT NULL,
  `roster_row_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `roster_row_id` (`roster_row_id`),
  CONSTRAINT `rowcolumneight_ibfk_1` FOREIGN KEY (`roster_row_id`) REFERENCES `RosterRow` (`roster_row_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `RowColumnEight`
--

LOCK TABLES `RowColumnEight` WRITE;
UNLOCK TABLES;

--
-- Table structure for table `RowColumnFive`
--

DROP TABLE IF EXISTS `RowColumnFive`;
CREATE TABLE `RowColumnFive` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `value` varchar(100) NOT NULL,
  `roster_row_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `roster_row_id` (`roster_row_id`),
  CONSTRAINT `rowcolumnfive_ibfk_1` FOREIGN KEY (`roster_row_id`) REFERENCES `RosterRow` (`roster_row_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=121 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `RowColumnFive`
--

LOCK TABLES `RowColumnFive` WRITE;
INSERT INTO `RowColumnFive` VALUES (29,'80100010',41),(30,'80100011',42),(31,'80100012',43),(32,'80100010',44),(33,'80100010',45),(34,'80100011',46),(35,'80100012',47),(36,'80100010',48);
UNLOCK TABLES;

--
-- Table structure for table `RowColumnFour`
--

DROP TABLE IF EXISTS `RowColumnFour`;
CREATE TABLE `RowColumnFour` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `value` varchar(100) NOT NULL,
  `roster_row_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `roster_row_id` (`roster_row_id`),
  CONSTRAINT `rowcolumnfour_ibfk_1` FOREIGN KEY (`roster_row_id`) REFERENCES `RosterRow` (`roster_row_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=121 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `RowColumnFour`
--

LOCK TABLES `RowColumnFour` WRITE;
INSERT INTO `RowColumnFour` VALUES (29,'28',41),(30,'25',42),(31,'23',43),(32,'23',44),(33,'28',45),(34,'25',46),(35,'23',47),(36,'23',48);
UNLOCK TABLES;

--
-- Table structure for table `RowColumnNine`
--

DROP TABLE IF EXISTS `RowColumnNine`;
CREATE TABLE `RowColumnNine` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `value` varchar(100) NOT NULL,
  `roster_row_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `roster_row_id` (`roster_row_id`),
  CONSTRAINT `rowcolumnnine_ibfk_1` FOREIGN KEY (`roster_row_id`) REFERENCES `RosterRow` (`roster_row_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


--
-- Dumping data for table `RowColumnNine`
--

LOCK TABLES `RowColumnNine` WRITE;
UNLOCK TABLES;

--
-- Table structure for table `RowColumnOne`
--

DROP TABLE IF EXISTS `RowColumnOne`;
CREATE TABLE `RowColumnOne` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `value` varchar(100) NOT NULL,
  `roster_row_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `roster_row_id` (`roster_row_id`),
  CONSTRAINT `rowcolumnone_ibfk_1` FOREIGN KEY (`roster_row_id`) REFERENCES `RosterRow` (`roster_row_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=121 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `RowColumnOne`
--

LOCK TABLES `RowColumnOne` WRITE;
INSERT INTO `RowColumnOne` VALUES (29,'Navit',41),(30,'Rachel',42),(31,'Rahul',43),(32,'Devika',44),(33,'Navit',45),(34,'Rachel',46),(35,'Rahul',47),(36,'Devika',48);
UNLOCK TABLES;

--
-- Table structure for table `RowColumnSeven`
--

DROP TABLE IF EXISTS `RowColumnSeven`;
CREATE TABLE `RowColumnSeven` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `value` varchar(100) NOT NULL,
  `roster_row_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `roster_row_id` (`roster_row_id`),
  CONSTRAINT `rowcolumnseven_ibfk_1` FOREIGN KEY (`roster_row_id`) REFERENCES `RosterRow` (`roster_row_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `RowColumnSeven`
--

LOCK TABLES `RowColumnSeven` WRITE;
UNLOCK TABLES;

--
-- Table structure for table `RowColumnSix`
--

DROP TABLE IF EXISTS `RowColumnSix`;
CREATE TABLE `RowColumnSix` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `value` varchar(100) NOT NULL,
  `roster_row_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `roster_row_id` (`roster_row_id`),
  CONSTRAINT `rowcolumnsix_ibfk_1` FOREIGN KEY (`roster_row_id`) REFERENCES `RosterRow` (`roster_row_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `RowColumnSix`
--

LOCK TABLES `RowColumnSix` WRITE;
UNLOCK TABLES;

--
-- Table structure for table `RowColumnTen`
--

DROP TABLE IF EXISTS `RowColumnTen`;
CREATE TABLE `RowColumnTen` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `value` varchar(100) NOT NULL,
  `roster_row_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `roster_row_id` (`roster_row_id`),
  CONSTRAINT `rowcolumnten_ibfk_1` FOREIGN KEY (`roster_row_id`) REFERENCES `RosterRow` (`roster_row_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `RowColumnTen`
--

LOCK TABLES `RowColumnTen` WRITE;
UNLOCK TABLES;

--
-- Table structure for table `RowColumnThree`
--

DROP TABLE IF EXISTS `RowColumnThree`;
CREATE TABLE `RowColumnThree` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `value` varchar(100) NOT NULL,
  `roster_row_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `roster_row_id` (`roster_row_id`),
  CONSTRAINT `rowcolumnthree_ibfk_1` FOREIGN KEY (`roster_row_id`) REFERENCES `RosterRow` (`roster_row_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=121 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `RowColumnThree`
--

LOCK TABLES `RowColumnThree` WRITE;
INSERT INTO `RowColumnThree` VALUES (29,'react',41),(30,'UI',42),(31,'python',43),(32,'express',44),(33,'react',45),(34,'UI',46),(35,'python',47),(36,'express',48);
UNLOCK TABLES;

--
-- Table structure for table `RowColumnTwo`
--

DROP TABLE IF EXISTS `RowColumnTwo`;
CREATE TABLE `RowColumnTwo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `value` varchar(100) NOT NULL,
  `roster_row_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `roster_row_id` (`roster_row_id`),
  CONSTRAINT `rowcolumntwo_ibfk_1` FOREIGN KEY (`roster_row_id`) REFERENCES `RosterRow` (`roster_row_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=121 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `RowColumnTwo`
--

LOCK TABLES `RowColumnTwo` WRITE;
INSERT INTO `RowColumnTwo` VALUES (29,'navit@email.com',41),(30,'rachel@email.com',42),(31,'rahul@email.com',43),(32,'devika@email.com',44),(33,'navit@email.com',45),(34,'rachel@email.com',46),(35,'rahul@email.com',47),(36,'devika@email.com',48);
UNLOCK TABLES;

--
-- Table structure for table `Survey`
--

DROP TABLE IF EXISTS `Survey`;
CREATE TABLE `Survey` (
  `survey_id` int(11) NOT NULL AUTO_INCREMENT,
  `professor_id` int(11) DEFAULT NULL,
  `course_id` int(11) DEFAULT NULL,
  `deadline` datetime DEFAULT NULL,
  PRIMARY KEY (`survey_id`),
  KEY `professor_id` (`professor_id`),
  KEY `course_id` (`course_id`),
  CONSTRAINT `survey_ibfk_1` FOREIGN KEY (`professor_id`) REFERENCES `Professor` (`professor_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `survey_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `Course` (`course_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Survey`
--

LOCK TABLES `Survey` WRITE;
INSERT INTO `Survey` VALUES(1,1,87,'2019-11-28 05:00:00 ');
INSERT INTO `Survey` VALUES(2,1,12, '2019-12-25 05:00:00 ');
UNLOCK TABLES;

--
-- Table structure for table `SurveyAnswers`
--

DROP TABLE IF EXISTS `SurveyAnswers`;
CREATE TABLE `SurveyAnswers` (
  `answer_id` int(11) NOT NULL AUTO_INCREMENT,
  `survey_id` int(11) NOT NULL,
  `answer_object` varchar(200) DEFAULT NULL,
  `roster_row_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`answer_id`),
  KEY `roster_row_id` (`roster_row_id`),
  KEY `survey_id` (`survey_id`),
  CONSTRAINT `surveyanswers_ibfk_1` FOREIGN KEY (`roster_row_id`) REFERENCES `RosterRow` (`roster_row_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `surveyanswers_ibfk_2` FOREIGN KEY (`survey_id`) REFERENCES `Survey` (`survey_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `SurveyAnswers`
--

LOCK TABLES `SurveyAnswers` WRITE;
UNLOCK TABLES;

--
-- Table structure for table `SurveyQuestions`
--

DROP TABLE IF EXISTS `SurveyQuestions`;
CREATE TABLE `SurveyQuestions` (
  `question_id` int(11) NOT NULL AUTO_INCREMENT,
  `survey_id` int(11) NOT NULL,
  `question_object` JSON DEFAULT NULL,
  PRIMARY KEY (`question_id`),
  KEY `survey_id` (`survey_id`),
  CONSTRAINT `surveyquestions_ibfk_1` FOREIGN KEY (`survey_id`) REFERENCES `Survey` (`survey_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `SurveyQuestions`
--

LOCK TABLES `SurveyQuestions` WRITE;
INSERT INTO `SurveyQuestions` VALUES (1,1,'{"0": {"qid": null, "qtext": "What is your weekend availability?", "qtype": "text", "qweight": "Very Important"}}' );
INSERT INTO `SurveyQuestions` VALUES (2,2,'{"0": {"qid": null, "qtext": "What is your weekend availability?", "qtype": "text", "qweight": "Very Important"}}' );
UNLOCK TABLES;

--
-- Table structure for table `StudentTeams`
--

DROP TABLE IF EXISTS `StudentTeams`;
CREATE TABLE `StudentTeams` (
    `team_id` integer auto_increment NOT NULL PRIMARY KEY,
    `survey_id` int NOT NULL,
    `roster_row_id` int NOT NULL,
    CONSTRAINT FOREIGN KEY (`survey_id`) REFERENCES `Survey` (`survey_id`),
    CONSTRAINT FOREIGN KEY (`roster_row_id`) REFERENCES `RosterRow` (`roster_row_id`)
  );
 
--
-- Dumping data for table `StudentTeams`
--
LOCK TABLES `StudentTeams` WRITE;
INSERT INTO `StudentTeams` (survey_id, roster_row_id)
VALUES
  (2, 41);
INSERT INTO `StudentTeams` (survey_id, roster_row_id)
VALUES
  (2, 42);
UNLOCK TABLES;

-- Dump completed on 2019-11-25 15:10:36
