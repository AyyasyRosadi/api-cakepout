-- MySQL dump 10.13  Distrib 8.3.0, for macos14.3 (arm64)
--
-- Host: localhost    Database: sipaham3
-- ------------------------------------------------------
-- Server version	8.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `institution`
--

DROP TABLE IF EXISTS `institution`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `institution` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `institution`
--

LOCK TABLES `institution` WRITE;
/*!40000 ALTER TABLE `institution` DISABLE KEYS */;
INSERT INTO `institution` VALUES (1,'KEBENDAHARAAN','2023-05-06 06:58:44','2023-05-06 06:58:44'),(2,'SD IT PUTRI','2023-05-15 05:06:55','2023-05-15 05:06:55'),(3,'SD IT PUTRA','2023-05-15 05:10:24','2023-05-15 05:10:24'),(4,'SMP IT PUTRI','2023-05-15 05:12:26','2023-05-15 05:12:26'),(5,'SMA IT','2023-05-15 05:12:49','2023-05-15 05:12:49'),(6,'MA PLUS','2023-05-15 05:13:00','2023-05-15 05:13:00'),(7,'SMP IT PUTRA','2023-05-15 05:13:20','2023-05-15 05:13:20'),(8,'IDAD MUALLLIMAT','2023-05-15 05:13:32','2023-05-15 05:13:32'),(9,'SMP IT PUTRA FULLDAY','2023-05-15 05:13:45','2023-05-15 05:13:45'),(10,'SMA IT PUTRA FULLDAY','2023-05-15 05:13:58','2023-05-15 05:13:58'),(11,'DINIYYAH','2023-05-15 05:14:40','2023-05-15 05:14:40'),(12,'KESEKRETARIATAN','2023-05-15 13:19:05','2023-05-15 13:19:05'),(13,'PERSONALIA','2023-05-15 13:19:19','2023-05-15 13:19:19'),(14,'BIDANG UMUM - SARANA PRA SARANA','2023-05-15 13:20:07','2023-05-15 13:20:07'),(15,'BIDANG UMUM - KEBERSIHAN','2023-05-15 13:20:30','2023-05-15 13:20:30'),(16,'KEAMANAN','2023-05-15 13:20:47','2023-05-15 13:20:47'),(17,'DEVISI DAPUR','2023-05-15 13:24:41','2023-05-17 03:14:27'),(18,'ASRAMA PUTRA SMP','2023-05-22 09:00:33','2023-05-22 09:00:33'),(19,'ASRAMA PUTRA MA','2023-05-22 09:00:57','2023-05-22 09:00:57'),(20,'ASRAMA PUTRI SMP','2023-05-22 09:02:15','2023-05-22 09:02:15'),(21,'ASRAMA PUTRI SMA','2023-05-22 09:02:32','2023-05-22 09:02:32'),(22,'ASRAMA DINIYAH','2023-05-22 09:02:52','2023-05-22 09:02:52'),(23,'ASRAMA IDAD MUALLIMAT','2023-05-22 09:03:22','2023-05-22 09:03:22'),(24,'DEPARTEMEN TAHFIDZ','2023-05-24 03:04:01','2023-05-24 03:04:01'),(26,'DEPARTEMEN BAHASA DAN KSA','2023-08-15 10:01:58','2023-08-15 10:01:58'),(28,'PRODI PGMI','2024-05-21 03:03:35','2024-05-21 03:03:35');
/*!40000 ALTER TABLE `institution` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-06-24 15:05:04
