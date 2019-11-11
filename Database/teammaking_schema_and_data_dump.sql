CREATE DATABASE  IF NOT EXISTS `teammaking` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `teammaking`;
-- MySQL dump 10.13  Distrib 5.7.17, for macos10.12 (x86_64)
--
-- Host: 127.0.0.1    Database: teammaking
-- ------------------------------------------------------
-- Server version	5.7.27

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Course`
--

DROP TABLE IF EXISTS `Course`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Course`
--

LOCK TABLES `Course` WRITE;
/*!40000 ALTER TABLE `Course` DISABLE KEYS */;
INSERT INTO `Course` VALUES (12,1,'saa;','SSDI','smnd;cnw;','2019-10-01 13:00:00','2019-10-03 13:00:00','03:34:00','03:34:00','sd;n;v','sc;lnd'),(13,1,'ITCS 312','test','Test Course','2019-11-18 13:00:00','2019-11-17 13:00:00','04:44:00','04:44:00','ta@email.com','ta'),(14,1,'ITCS 3122','test','Test Course','2019-11-18 13:00:00','2019-11-17 13:00:00','04:44:00','04:44:00','ta@email.com','ta');
/*!40000 ALTER TABLE `Course` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Professor`
--

DROP TABLE IF EXISTS `Professor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Professor` (
  `professor_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `university` varchar(100) DEFAULT NULL,
  `university_id` varchar(100) NOT NULL,
  PRIMARY KEY (`professor_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Professor`
--

LOCK TABLES `Professor` WRITE;
/*!40000 ALTER TABLE `Professor` DISABLE KEYS */;
INSERT INTO `Professor` VALUES (1,'Harini Ramaprasad','harini@email.com','University of the World','UN123456');
/*!40000 ALTER TABLE `Professor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Roster`
--

DROP TABLE IF EXISTS `Roster`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Roster` (
  `roster_id` int(11) NOT NULL AUTO_INCREMENT,
  `professor_id` int(11) DEFAULT NULL,
  `course_id` int(11) NOT NULL,
  PRIMARY KEY (`roster_id`),
  UNIQUE KEY `course_id` (`course_id`),
  KEY `professor_id` (`professor_id`),
  CONSTRAINT `roster_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `Course` (`course_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `roster_ibfk_2` FOREIGN KEY (`professor_id`) REFERENCES `Professor` (`professor_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Roster`
--

LOCK TABLES `Roster` WRITE;
/*!40000 ALTER TABLE `Roster` DISABLE KEYS */;
INSERT INTO `Roster` VALUES (22,1,12);
/*!40000 ALTER TABLE `Roster` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `RosterHeaderRow`
--

DROP TABLE IF EXISTS `RosterHeaderRow`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RosterHeaderRow`
--

LOCK TABLES `RosterHeaderRow` WRITE;
/*!40000 ALTER TABLE `RosterHeaderRow` DISABLE KEYS */;
INSERT INTO `RosterHeaderRow` VALUES (22,12,'name','email','skill','age','studentId',NULL,NULL,NULL,NULL,NULL,'\0','\0','\0','\0','\0','\0','\0','\0','\0','\0');
/*!40000 ALTER TABLE `RosterHeaderRow` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `RosterRow`
--

DROP TABLE IF EXISTS `RosterRow`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RosterRow`
--

LOCK TABLES `RosterRow` WRITE;
/*!40000 ALTER TABLE `RosterRow` DISABLE KEYS */;
INSERT INTO `RosterRow` VALUES (37,22,12,1),(38,22,12,1),(39,22,12,1),(40,22,12,1);
/*!40000 ALTER TABLE `RosterRow` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `RowColumnEight`
--

DROP TABLE IF EXISTS `RowColumnEight`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `RowColumnEight` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `value` varchar(100) NOT NULL,
  `roster_row_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `roster_row_id` (`roster_row_id`),
  CONSTRAINT `rowcolumneight_ibfk_1` FOREIGN KEY (`roster_row_id`) REFERENCES `RosterRow` (`roster_row_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RowColumnEight`
--

LOCK TABLES `RowColumnEight` WRITE;
/*!40000 ALTER TABLE `RowColumnEight` DISABLE KEYS */;
/*!40000 ALTER TABLE `RowColumnEight` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `RowColumnFive`
--

DROP TABLE IF EXISTS `RowColumnFive`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `RowColumnFive` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `value` varchar(100) NOT NULL,
  `roster_row_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `roster_row_id` (`roster_row_id`),
  CONSTRAINT `rowcolumnfive_ibfk_1` FOREIGN KEY (`roster_row_id`) REFERENCES `RosterRow` (`roster_row_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RowColumnFive`
--

LOCK TABLES `RowColumnFive` WRITE;
/*!40000 ALTER TABLE `RowColumnFive` DISABLE KEYS */;
INSERT INTO `RowColumnFive` VALUES (25,'80100010',37),(26,'80100011',38),(27,'80100012',39),(28,'80100010',40);
/*!40000 ALTER TABLE `RowColumnFive` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `RowColumnFour`
--

DROP TABLE IF EXISTS `RowColumnFour`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `RowColumnFour` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `value` varchar(100) NOT NULL,
  `roster_row_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `roster_row_id` (`roster_row_id`),
  CONSTRAINT `rowcolumnfour_ibfk_1` FOREIGN KEY (`roster_row_id`) REFERENCES `RosterRow` (`roster_row_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RowColumnFour`
--

LOCK TABLES `RowColumnFour` WRITE;
/*!40000 ALTER TABLE `RowColumnFour` DISABLE KEYS */;
INSERT INTO `RowColumnFour` VALUES (25,'28',37),(26,'25',38),(27,'23',39),(28,'23',40);
/*!40000 ALTER TABLE `RowColumnFour` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `RowColumnNine`
--

DROP TABLE IF EXISTS `RowColumnNine`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `RowColumnNine` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `value` varchar(100) NOT NULL,
  `roster_row_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `roster_row_id` (`roster_row_id`),
  CONSTRAINT `rowcolumnnine_ibfk_1` FOREIGN KEY (`roster_row_id`) REFERENCES `RosterRow` (`roster_row_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RowColumnNine`
--

LOCK TABLES `RowColumnNine` WRITE;
/*!40000 ALTER TABLE `RowColumnNine` DISABLE KEYS */;
/*!40000 ALTER TABLE `RowColumnNine` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `RowColumnOne`
--

DROP TABLE IF EXISTS `RowColumnOne`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `RowColumnOne` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `value` varchar(100) NOT NULL,
  `roster_row_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `roster_row_id` (`roster_row_id`),
  CONSTRAINT `rowcolumnone_ibfk_1` FOREIGN KEY (`roster_row_id`) REFERENCES `RosterRow` (`roster_row_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RowColumnOne`
--

LOCK TABLES `RowColumnOne` WRITE;
/*!40000 ALTER TABLE `RowColumnOne` DISABLE KEYS */;
INSERT INTO `RowColumnOne` VALUES (25,'Navit',37),(26,'Rachel',38),(27,'Rahul',39),(28,'Devika',40);
/*!40000 ALTER TABLE `RowColumnOne` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `RowColumnSeven`
--

DROP TABLE IF EXISTS `RowColumnSeven`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `RowColumnSeven` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `value` varchar(100) NOT NULL,
  `roster_row_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `roster_row_id` (`roster_row_id`),
  CONSTRAINT `rowcolumnseven_ibfk_1` FOREIGN KEY (`roster_row_id`) REFERENCES `RosterRow` (`roster_row_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RowColumnSeven`
--

LOCK TABLES `RowColumnSeven` WRITE;
/*!40000 ALTER TABLE `RowColumnSeven` DISABLE KEYS */;
/*!40000 ALTER TABLE `RowColumnSeven` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `RowColumnSix`
--

DROP TABLE IF EXISTS `RowColumnSix`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `RowColumnSix` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `value` varchar(100) NOT NULL,
  `roster_row_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `roster_row_id` (`roster_row_id`),
  CONSTRAINT `rowcolumnsix_ibfk_1` FOREIGN KEY (`roster_row_id`) REFERENCES `RosterRow` (`roster_row_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RowColumnSix`
--

LOCK TABLES `RowColumnSix` WRITE;
/*!40000 ALTER TABLE `RowColumnSix` DISABLE KEYS */;
/*!40000 ALTER TABLE `RowColumnSix` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `RowColumnTen`
--

DROP TABLE IF EXISTS `RowColumnTen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `RowColumnTen` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `value` varchar(100) NOT NULL,
  `roster_row_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `roster_row_id` (`roster_row_id`),
  CONSTRAINT `rowcolumnten_ibfk_1` FOREIGN KEY (`roster_row_id`) REFERENCES `RosterRow` (`roster_row_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RowColumnTen`
--

LOCK TABLES `RowColumnTen` WRITE;
/*!40000 ALTER TABLE `RowColumnTen` DISABLE KEYS */;
/*!40000 ALTER TABLE `RowColumnTen` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `RowColumnThree`
--

DROP TABLE IF EXISTS `RowColumnThree`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `RowColumnThree` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `value` varchar(100) NOT NULL,
  `roster_row_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `roster_row_id` (`roster_row_id`),
  CONSTRAINT `rowcolumnthree_ibfk_1` FOREIGN KEY (`roster_row_id`) REFERENCES `RosterRow` (`roster_row_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RowColumnThree`
--

LOCK TABLES `RowColumnThree` WRITE;
/*!40000 ALTER TABLE `RowColumnThree` DISABLE KEYS */;
INSERT INTO `RowColumnThree` VALUES (25,'react',37),(26,'UI',38),(27,'python',39),(28,'express',40);
/*!40000 ALTER TABLE `RowColumnThree` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `RowColumnTwo`
--

DROP TABLE IF EXISTS `RowColumnTwo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `RowColumnTwo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `value` varchar(100) NOT NULL,
  `roster_row_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `roster_row_id` (`roster_row_id`),
  CONSTRAINT `rowcolumntwo_ibfk_1` FOREIGN KEY (`roster_row_id`) REFERENCES `RosterRow` (`roster_row_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RowColumnTwo`
--

LOCK TABLES `RowColumnTwo` WRITE;
/*!40000 ALTER TABLE `RowColumnTwo` DISABLE KEYS */;
INSERT INTO `RowColumnTwo` VALUES (25,'navit@email.com',37),(26,'rachel@email.com',38),(27,'rahul@email.com',39),(28,'devika@email.com',40);
/*!40000 ALTER TABLE `RowColumnTwo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Survey`
--

DROP TABLE IF EXISTS `Survey`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Survey`
--

LOCK TABLES `Survey` WRITE;
/*!40000 ALTER TABLE `Survey` DISABLE KEYS */;
/*!40000 ALTER TABLE `Survey` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SurveyAnswers`
--

DROP TABLE IF EXISTS `SurveyAnswers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SurveyAnswers`
--

LOCK TABLES `SurveyAnswers` WRITE;
/*!40000 ALTER TABLE `SurveyAnswers` DISABLE KEYS */;
/*!40000 ALTER TABLE `SurveyAnswers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SurveyQuestions`
--

DROP TABLE IF EXISTS `SurveyQuestions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `SurveyQuestions` (
  `question_id` int(11) NOT NULL AUTO_INCREMENT,
  `survey_id` int(11) NOT NULL,
  `question_object` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`question_id`),
  KEY `survey_id` (`survey_id`),
  CONSTRAINT `surveyquestions_ibfk_1` FOREIGN KEY (`survey_id`) REFERENCES `Survey` (`survey_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SurveyQuestions`
--

LOCK TABLES `SurveyQuestions` WRITE;
/*!40000 ALTER TABLE `SurveyQuestions` DISABLE KEYS */;
/*!40000 ALTER TABLE `SurveyQuestions` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-11-11 10:10:00
