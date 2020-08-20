-- MySQL dump 10.13  Distrib 5.7.30, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: elitetask
-- ------------------------------------------------------
-- Server version	5.7.30-0ubuntu0.18.04.1

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
-- Table structure for table `dialogue_post`
--

DROP TABLE IF EXISTS `dialogue_post`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dialogue_post` (
  `post_id` int(11) NOT NULL AUTO_INCREMENT,
  `task_id` int(11) DEFAULT NULL,
  `author` int(11) DEFAULT NULL,
  `date_authored` bigint(20) DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `content` varchar(2000) DEFAULT NULL,
  `edit_date` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`post_id`),
  KEY `task_id` (`task_id`),
  KEY `author` (`author`),
  CONSTRAINT `dialogue_post_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `task` (`task_id`) ON DELETE CASCADE,
  CONSTRAINT `dialogue_post_ibfk_2` FOREIGN KEY (`author`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dialogue_post`
--

LOCK TABLES `dialogue_post` WRITE;
/*!40000 ALTER TABLE `dialogue_post` DISABLE KEYS */;
INSERT INTO `dialogue_post` VALUES (1,1,15,1589984940000,'Task details','<p>Create your static webpages. <strong>Use javascript/vue to make them interactive</strong>. <span style=\"color: #e03e2d;\">Also use CSS to style your webpages.</span></p>',NULL),(2,1,1,1589984940000,'A few questions','<p>Hi,</p> <p>Just a few questions about this task.</p> <p>Thanks,</p> <p>Henry</p>',NULL),(3,2,15,1591162384000,'Task details','<ol><li>Design your webpage with HTML and CSS</li><li>Make interactive with JavaScript</li><li>Create SQL schema</li></ol>',1592113795000),(4,2,1,1591162384000,'A few questions','<p>Hi,</p> <p>Just a few questions about this task.</p> <p>Thanks,</p> <p>Henry</p>',NULL),(21,4,15,1592133240000,'Task details','<p><strong>Milestone 1</strong> is a big one and is worth 15% of your grade. It consists of:</p><ul><li>Site design</li><li>Research</li><li>Data plan</li><li>E-R model</li></ul><p>Don\'t submit late!!</p>',1592403901000),(23,4,1,1592383628000,'Request to complete','<p>I\'ve completed the task. Requesting to complete.</p>',NULL),(24,6,23,1592383998000,'Task details','<p><strong>Prepare the report for the meeting</strong></p><p>Be sure to include:</p><ul><li>Details of the other party</li><li>Illustrations of the final design</li></ul><p>Cheers,</p><p>Johnny</p>',NULL),(25,6,24,1592384212000,'Other party\'s details','<p>Hi Johnny,</p><p>We haven\'t received the details of the other party yet. Could you please send them over when you can?</p><p>Thanks,</p><p>Lucy</p>',NULL),(26,6,1,1592384269000,'Same','<p>Ditto</p>',1593154468000),(27,6,16,1592387032000,'Same','<p>Please</p>',NULL),(28,6,23,1592402936000,'','<p>Sorry about the mixup ladies and gents. Here are their details:</p><ul><li>Name: Foxconn Technology Group</li><li>CEO: Elon Musk</li><li>Address: One Infinite Loop, Cupertino, CA 95014, United States</li></ul>',1592403733000),(34,12,22,1592821348000,'Task details','<p>Consolidate all your JavaScript files to increase the performance of your webapp</p>',NULL),(35,13,23,1592888542000,'Task details','<p>Remember to:</p><ul><li>Install Node.js/NPM</li><li>Install its dependencies</li><li>Move all static pages into the public folder</li></ul><p>Comment below if you run into any issues</p>',NULL),(36,14,15,1592895275000,'Task details','<p>You will be recording a video, discussing and showing the features and functionality of your web application.</p><p>You will then zip and submit your work. A marker will review your final product in further detail.</p><p>As well as submitting your work as a ZIP file, you will need to provide the markers with access to your CS50 IDE.</p><p>Good luck!</p>',NULL),(39,1,1,1592909248000,'','<p>The website is primarily done. Check it out when you can.</p>',1592909430000),(40,15,33,1593150456000,'Task details','<p>There is a lot of trash in the office - please help clear it</p>',NULL),(41,16,22,1593151149000,'Task details','<p>There is more trash in the back of the office - please clear</p>',NULL),(43,6,1,1593174264000,'','<p>Requesting to complete task</p>',NULL);
/*!40000 ALTER TABLE `dialogue_post` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) unsigned NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `task`
--

DROP TABLE IF EXISTS `task`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `task` (
  `task_id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `priority` varchar(30) DEFAULT NULL,
  `status` varchar(30) DEFAULT NULL,
  `task_type` varchar(255) DEFAULT NULL,
  `due_date` bigint(20) DEFAULT NULL,
  `req_approval` tinyint(1) DEFAULT NULL,
  `pending` tinyint(1) DEFAULT NULL,
  `completed` tinyint(1) DEFAULT NULL,
  `completed_date` bigint(20) DEFAULT NULL,
  `event_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`task_id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task`
--

LOCK TABLES `task` WRITE;
/*!40000 ALTER TABLE `task` DISABLE KEYS */;
INSERT INTO `task` VALUES (1,'Finish coding up the website','High','Pending approval','Coding',1589984940000,1,1,0,NULL,NULL),(2,'Milestone 2','High','Pending approval','Brainstorming',1591367340000,1,1,0,NULL,NULL),(4,'Milestone 1','Low','Done','Management',1589466540000,1,0,1,1592383742000,NULL),(6,'Prepare report','Medium','Done','Paperwork',1592576940000,1,0,1,1593174377000,NULL),(12,'Consolidate JavaScript files','Medium','Not started','Coding',1592908200000,0,0,0,NULL,'g0ud3438a8m9n11n30vdb3nsos'),(13,'Set up the server','Low','Working on it','Housekeeping',1591972140000,0,0,0,NULL,'f72b9q521vh9rcg0gkos3j41qg'),(14,'Milestone 3 (Final Submission)','High','Not started','Coding',1593181740000,1,0,0,NULL,NULL),(15,'Clear trash','Low','Not started','Cleaning',1593333000000,0,0,0,NULL,NULL),(16,'Clear more trash','Medium','Done','Cleaning',1593419400000,0,0,1,1593173924000,'m2jnfah3avak2enbr248n3coj4');
/*!40000 ALTER TABLE `task` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `task_preference`
--

DROP TABLE IF EXISTS `task_preference`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `task_preference` (
  `user_id` int(11) NOT NULL,
  `preference` varchar(255) NOT NULL,
  PRIMARY KEY (`user_id`,`preference`),
  CONSTRAINT `task_preference_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task_preference`
--

LOCK TABLES `task_preference` WRITE;
/*!40000 ALTER TABLE `task_preference` DISABLE KEYS */;
INSERT INTO `task_preference` VALUES (1,'Brainstorming'),(1,'Cleaning'),(1,'Coding'),(1,'Cooking'),(16,'Brainstorming'),(16,'Coding'),(16,'Debugging'),(16,'Proofing'),(24,'Brainstorming'),(24,'Cleaning'),(24,'Debugging'),(24,'Housekeeping'),(24,'Management'),(25,'Brainstorming'),(25,'Cleaning'),(25,'Cooking'),(25,'Documentation'),(25,'Management'),(25,'Proofing'),(26,'Brainstorming'),(26,'Coding'),(26,'Debugging'),(26,'Penetration Testing');
/*!40000 ALTER TABLE `task_preference` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `task_type`
--

DROP TABLE IF EXISTS `task_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `task_type` (
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task_type`
--

LOCK TABLES `task_type` WRITE;
/*!40000 ALTER TABLE `task_type` DISABLE KEYS */;
INSERT INTO `task_type` VALUES ('Brainstorming'),('Cleaning'),('Coding'),('Cooking'),('Debugging'),('Documentation'),('Graphic Design'),('Housekeeping'),('Inventory'),('Lecture'),('Management'),('Paperwork'),('Penetration Testing'),('Proofing');
/*!40000 ALTER TABLE `task_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `about_me` varchar(400) DEFAULT NULL,
  `is_manager` tinyint(1) NOT NULL DEFAULT '0',
  `google_login` tinyint(1) NOT NULL DEFAULT '0',
  `facebook_login` tinyint(1) NOT NULL DEFAULT '0',
  `google_calendar` tinyint(1) DEFAULT '0',
  `sunday` tinyint(1) DEFAULT NULL,
  `monday` tinyint(1) DEFAULT NULL,
  `tuesday` tinyint(1) DEFAULT NULL,
  `wednesday` tinyint(1) DEFAULT NULL,
  `thursday` tinyint(1) DEFAULT NULL,
  `friday` tinyint(1) DEFAULT NULL,
  `saturday` tinyint(1) DEFAULT NULL,
  `only_open_id` tinyint(1) DEFAULT NULL,
  `google_email` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `google_email` (`google_email`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'Henry','Yin-Chen','henry.yinchen@gmail.com','$argon2id$v=19$m=4096,t=3,p=1$obz2FYofhpjiZaJVojsLrA$pwkC0eKgsqIn5e9uqJaDkFp0UYj7yOa0lOVX1O/WwEo','b51b1d270f99399c84ec60293ac53f2e','Comp sci student',0,1,0,1,0,1,1,0,0,1,0,NULL,'henry.yinchen@gmail.com'),(15,'Ian','Knight','ian.knight@elitetask.com','$argon2id$v=19$m=4096,t=3,p=1$3ryOcEeNC34Pe4DOwnpuEg$Rzh+Dh3EWWxFGtY9biwXUetxgAbPECjTcqiYgLZVoUg','b9a980033ba9cb0c78271af6a4bd6dc1','WDC coordinator',1,0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(16,'James','Dean','james.dean@elitetask.com','$argon2id$v=19$m=4096,t=3,p=1$KtfAm2HBCjSL34AcR5z/ww$Iwep/NeoxglsV94oEmynJ/91B01LLgTgCtv1n0HKcv0','622f08d34382b8f1cca0546a71197cff','My name is James Dean ',0,0,0,NULL,0,1,1,1,1,1,0,NULL,NULL),(22,'Henry','Yin-Chen','a1647362@student.adelaide.edu.au',NULL,NULL,'I am a manager',1,1,0,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'a1647362@student.adelaide.edu.au'),(23,'Johnny','English','johnny.english@elitetask.com','$argon2id$v=19$m=4096,t=3,p=1$pfMChooI3b3nZpE4R6WiYA$quTV7GTWOs15QNIo1hH0ORR5NLa0zKB3JQ5AGzChxps','6f89b6f00de556aef978f4b6bbde583b','I am THE manager',1,0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(24,'Lucy','Lu','lucy.lu@elitetask.com','$argon2id$v=19$m=4096,t=3,p=1$U9nej8YMPY29dcmDm2NG4A$brxik2UZGDmbU9VrOE0h1YQldaAahpADJhIB8WqSPNQ','0fc111ed79fc17b96e533f11dd70ad98','I am Lucy Lu',0,0,0,NULL,0,1,0,1,0,1,0,NULL,NULL),(25,'Walter','White','walter.white@elitetask.com','$argon2id$v=19$m=4096,t=3,p=1$D48kgZiK84vGlJpHBHzoFQ$GVF4C6kJen7ytNgPcTzHiuETGqDMKm04DLS6qho8UBI','832176fec9adaf3d05f5b359422bc963','I am the one who knocks',0,0,0,NULL,1,0,0,0,0,0,1,NULL,NULL),(26,'Elliot','Alderson','elliot.alderson@elitetask.com','$argon2id$v=19$m=4096,t=3,p=1$JPiEN7TEfmbbmBG0671mag$jh/+f4MQzDG/uKzJIJ6+Zk3FqbT+vNquZKA3z5PpD1g','541235c4179a1a35e257ee04dc9c854e','I am Mr. Robot',0,0,0,NULL,0,1,0,1,0,1,0,NULL,NULL),(33,'Peter','Parker','peter.parker@elitetask.com','$argon2id$v=19$m=4096,t=3,p=1$ArUOzoh/NqYJ2aOjbe33VA$+moPZ9Jv8bvI+PNM2GOTNQ4N2pe6uKSG7egfE+yHVPg','42c7b591dbd06b85663950b93f57a1e3','Not Spider-Man',1,0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_has_task`
--

DROP TABLE IF EXISTS `user_has_task`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_has_task` (
  `user_id` int(11) NOT NULL,
  `task_id` int(11) NOT NULL,
  PRIMARY KEY (`user_id`,`task_id`),
  KEY `task_id` (`task_id`),
  CONSTRAINT `user_has_task_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE NO ACTION,
  CONSTRAINT `user_has_task_ibfk_2` FOREIGN KEY (`task_id`) REFERENCES `task` (`task_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_has_task`
--

LOCK TABLES `user_has_task` WRITE;
/*!40000 ALTER TABLE `user_has_task` DISABLE KEYS */;
INSERT INTO `user_has_task` VALUES (1,1),(15,1),(16,1),(1,2),(15,2),(1,4),(15,4),(1,6),(16,6),(23,6),(24,6),(1,12),(22,12),(1,13),(16,13),(23,13),(1,14),(15,14),(16,14),(24,14),(25,14),(26,14),(1,15),(16,15),(25,15),(33,15),(1,16),(16,16),(22,16),(25,16),(26,16);
/*!40000 ALTER TABLE `user_has_task` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-06-27 13:53:21
