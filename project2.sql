-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: project
-- ------------------------------------------------------
-- Server version	8.0.37
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */
;

/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */
;

/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */
;

/*!50503 SET NAMES utf8mb4 */
;

/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */
;

/*!40103 SET TIME_ZONE='+00:00' */
;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */
;

/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */
;

/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */
;

/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */
;

DROP DATABASE IF EXISTS project;

CREATE DATABASE project;

use project;

--
-- Table structure for table `comments`
--
DROP TABLE IF EXISTS `comments`;

/*!40101 SET @saved_cs_client     = @@character_set_client */
;

/*!50503 SET character_set_client = utf8mb4 */
;

CREATE TABLE `comments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint DEFAULT NULL,
  `post_id` bigint DEFAULT NULL,
  `content` longtext,
  `created_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 4 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `comments`
--
LOCK TABLES `comments` WRITE;

/*!40000 ALTER TABLE `comments` DISABLE KEYS */
;

INSERT INTO
  `comments`
VALUES
  (
    1,
    2,
    1,
    'Đi hôm nào đấy em',
    '2024-05-16 17:59:49'
  ),
  (
    2,
    1,
    3,
    'anh Hùng đi đâu á',
    '2024-05-19 02:40:21'
  ),
  (
    3,
    2,
    1,
    'Hôm nào về quê em?',
    '2024-05-19 03:02:13'
  );

/*!40000 ALTER TABLE `comments` ENABLE KEYS */
;

UNLOCK TABLES;

--
-- Table structure for table `group_chat`
--
DROP TABLE IF EXISTS `group_chat`;

/*!40101 SET @saved_cs_client     = @@character_set_client */
;

/*!50503 SET character_set_client = utf8mb4 */
;

CREATE TABLE `group_chat` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id_admin` bigint DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `img_url` varchar(1000) DEFAULT NULL,
  `created_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 3 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `group_chat`
--
LOCK TABLES `group_chat` WRITE;

/*!40000 ALTER TABLE `group_chat` DISABLE KEYS */
;

INSERT INTO
  `group_chat`
VALUES
  (
    1,
    1,
    'Nhóm chat 3 anh em',
    NULL,
    '2024-05-17 01:23:47'
  ),
  (
    2,
    1,
    'Nhóm chat 4 anh em',
    NULL,
    '2024-05-17 01:24:22'
  );

/*!40000 ALTER TABLE `group_chat` ENABLE KEYS */
;

UNLOCK TABLES;

--
-- Table structure for table `group_msg`
--
DROP TABLE IF EXISTS `group_msg`;

/*!40101 SET @saved_cs_client     = @@character_set_client */
;

/*!50503 SET character_set_client = utf8mb4 */
;

CREATE TABLE `group_msg` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_from` bigint DEFAULT NULL,
  `group_to` bigint DEFAULT NULL,
  `msg` longtext,
  `created_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `group_msg`
--
LOCK TABLES `group_msg` WRITE;

/*!40000 ALTER TABLE `group_msg` DISABLE KEYS */
;

/*!40000 ALTER TABLE `group_msg` ENABLE KEYS */
;

UNLOCK TABLES;

--
-- Table structure for table `imgs_post`
--
DROP TABLE IF EXISTS `imgs_post`;

/*!40101 SET @saved_cs_client     = @@character_set_client */
;

/*!50503 SET character_set_client = utf8mb4 */
;

CREATE TABLE `imgs_post` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `img_url` varchar(1000) DEFAULT NULL,
  `post_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 9 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `imgs_post`
--
LOCK TABLES `imgs_post` WRITE;

/*!40000 ALTER TABLE `imgs_post` DISABLE KEYS */
;

INSERT INTO
  `imgs_post`
VALUES
  (
    1,
    '438880571_1171469764019625_5715784017649521140_n-1715907482338.jpg',
    1
  ),
  (
    7,
    'IMG_20210129_170913_884-1716089953235.jpg',
    3
  ),
  (
    8,
    'IMG_20210129_171019_623-1716089953239.jpg',
    3
  );

/*!40000 ALTER TABLE `imgs_post` ENABLE KEYS */
;

UNLOCK TABLES;

--
-- Table structure for table `members_of_group`
--
DROP TABLE IF EXISTS `members_of_group`;

/*!40101 SET @saved_cs_client     = @@character_set_client */
;

/*!50503 SET character_set_client = utf8mb4 */
;

CREATE TABLE `members_of_group` (
  `group_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`group_id`, `user_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `members_of_group`
--
LOCK TABLES `members_of_group` WRITE;

/*!40000 ALTER TABLE `members_of_group` DISABLE KEYS */
;

INSERT INTO
  `members_of_group`
VALUES
  (1, 1),
  (1, 2),
  (1, 4),
  (2, 1),
  (2, 2),
  (2, 3),
  (2, 4);

/*!40000 ALTER TABLE `members_of_group` ENABLE KEYS */
;

UNLOCK TABLES;

--
-- Table structure for table `msg`
--
DROP TABLE IF EXISTS `msg`;

/*!40101 SET @saved_cs_client     = @@character_set_client */
;

/*!50503 SET character_set_client = utf8mb4 */
;

CREATE TABLE `msg` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user0` bigint DEFAULT NULL,
  `user1` bigint DEFAULT NULL,
  `msg` longtext,
  `is_user0_send` bit(1) DEFAULT NULL,
  `created_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 3 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `msg`
--
LOCK TABLES `msg` WRITE;

/*!40000 ALTER TABLE `msg` DISABLE KEYS */
;

INSERT INTO
  `msg`
VALUES
  (
    1,
    1,
    2,
    'a Hùng ơi',
    _binary '',
    '2024-05-17 01:24:57'
  ),
  (
    2,
    1,
    2,
    'a Hùng',
    _binary '',
    '2024-05-17 01:25:08'
  );

/*!40000 ALTER TABLE `msg` ENABLE KEYS */
;

UNLOCK TABLES;

--
-- Table structure for table `notifications`
--
DROP TABLE IF EXISTS `notifications`;

/*!40101 SET @saved_cs_client     = @@character_set_client */
;

/*!50503 SET character_set_client = utf8mb4 */
;

CREATE TABLE `notifications` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id_to` bigint DEFAULT NULL,
  `notification_type` int DEFAULT NULL,
  `content` longtext,
  `open` bit(1) DEFAULT NULL,
  `link_id` bigint DEFAULT NULL,
  `img_url` varchar(1000) DEFAULT NULL,
  `created_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `ref_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 4 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `notifications`
--
LOCK TABLES `notifications` WRITE;

/*!40000 ALTER TABLE `notifications` DISABLE KEYS */
;

INSERT INTO
  `notifications`
VALUES
  (
    1,
    1,
    0,
    'Bùi Đình Hùng đã bình luận về bài viết của bạn.',
    _binary '',
    1,
    '2-1711296560446.jpg',
    '2024-05-17 00:59:49',
    1
  ),
  (
    2,
    2,
    0,
    'Bùi Đình Hiếu đã bình luận về bài viết của bạn.',
    _binary '\0',
    3,
    '1-1711296353398.jpg',
    '2024-05-19 03:40:21',
    2
  ),
  (
    3,
    1,
    0,
    'Bùi Đình Hùng đã bình luận về bài viết của bạn.',
    _binary '\0',
    1,
    '2-1711296560446.jpg',
    '2024-05-19 04:02:13',
    3
  );

/*!40000 ALTER TABLE `notifications` ENABLE KEYS */
;

UNLOCK TABLES;

--
-- Table structure for table `posts`
--
DROP TABLE IF EXISTS `posts`;

/*!40101 SET @saved_cs_client     = @@character_set_client */
;

/*!50503 SET character_set_client = utf8mb4 */
;

CREATE TABLE `posts` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint DEFAULT NULL,
  `content` longtext,
  `created_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 4 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `posts`
--
LOCK TABLES `posts` WRITE;

/*!40000 ALTER TABLE `posts` DISABLE KEYS */
;

INSERT INTO
  `posts`
VALUES
  (1, 1, 'Đã ở Mộc Châu', '2024-05-17 00:58:02'),
  (
    3,
    2,
    'Hôm nay trời đẹp quá!!!',
    '2024-05-19 03:39:13'
  );

/*!40000 ALTER TABLE `posts` ENABLE KEYS */
;

UNLOCK TABLES;

--
-- Table structure for table `users`
--
DROP TABLE IF EXISTS `users`;

/*!40101 SET @saved_cs_client     = @@character_set_client */
;

/*!50503 SET character_set_client = utf8mb4 */
;

CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `username` varchar(1000) DEFAULT NULL,
  `password` varchar(1000) DEFAULT NULL,
  `email` varchar(1000) DEFAULT NULL,
  `img_url` varchar(1000) DEFAULT NULL,
  `full_name` varchar(1000) DEFAULT NULL,
  `created_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 8 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `users`
--
LOCK TABLES `users` WRITE;

/*!40000 ALTER TABLE `users` DISABLE KEYS */
;

INSERT INTO
  `users`
VALUES
  (
    1,
    'hieubuict96',
    '$2a$10$Ixu4QquBcm2NOAIdaOvjouvWE4Bwi3TNdsphyA9dUdt630cQi1mfq',
    'hieubuict96@gmail.com',
    '1-1711296353398.jpg',
    'Bùi Đình Hiếu',
    '2024-03-24 15:58:14'
  ),
  (
    2,
    'hungbui94',
    '$2a$10$Ixu4QquBcm2NOAIdaOvjouvWE4Bwi3TNdsphyA9dUdt630cQi1mfq',
    'hungbui94@gmail.com',
    '2-1711296560446.jpg',
    'Bùi Đình Hùng',
    '2024-03-24 16:09:20'
  ),
  (
    3,
    'tienson89',
    '$2a$10$Ixu4QquBcm2NOAIdaOvjouvWE4Bwi3TNdsphyA9dUdt630cQi1mfq',
    'tienson89@gmail.com',
    '3-1711296689400.jpg',
    'Bùi Tiến Sơn',
    '2024-03-24 16:11:29'
  ),
  (
    4,
    'phuongbui00',
    '$2a$10$Ixu4QquBcm2NOAIdaOvjouvWE4Bwi3TNdsphyA9dUdt630cQi1mfq',
    'phuongbui@gmail.com',
    '4-1711296689400.jpg',
    'Bùi Lê Phương',
    '2024-03-24 16:11:29'
  );

/*!40000 ALTER TABLE `users` ENABLE KEYS */
;

UNLOCK TABLES;

--
-- Dumping routines for database 'project'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */
;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */
;

/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */
;

/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */
;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */
;

/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */
;

/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */
;

/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */
;

-- Dump completed on 2024-05-19 11:14:09