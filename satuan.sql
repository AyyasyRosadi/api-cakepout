-- MySQL dump 10.13  Distrib 8.3.0, for macos14.3 (arm64)
--
-- Host: localhost    Database: sipaham2
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
-- Table structure for table `list_satuan`
--

DROP TABLE IF EXISTS `list_satuan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `list_satuan` (
  `id` int NOT NULL AUTO_INCREMENT,
  `satuan` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `list_satuan`
--

LOCK TABLES `list_satuan` WRITE;
/*!40000 ALTER TABLE `list_satuan` DISABLE KEYS */;
INSERT INTO `list_satuan` VALUES (1,'batang','2023-05-06 09:17:09','2023-05-06 09:17:09'),(2,'botol','2023-05-06 09:17:09','2023-05-06 09:17:09'),(3,'box','2023-05-06 09:17:09','2023-05-06 09:17:09'),(4,'buah','2023-05-06 09:17:09','2023-05-06 09:17:09'),(5,'buku','2023-05-06 09:17:09','2023-05-06 09:17:09'),(6,'bulan','2023-05-06 09:17:09','2023-05-06 09:17:09'),(7,'bungkus','2023-05-06 09:17:09','2023-05-06 09:17:09'),(8,'dos','2023-05-06 09:17:09','2023-05-06 09:17:09'),(9,'feet','2023-05-06 09:17:09','2023-05-06 09:17:09'),(10,'galon','2023-05-06 09:17:09','2023-05-06 09:17:09'),(11,'gulung','2023-05-06 09:17:09','2023-05-06 09:17:09'),(12,'hari','2023-05-06 09:17:09','2023-05-06 09:17:09'),(13,'jam','2023-05-06 09:17:09','2023-05-06 09:17:09'),(14,'jam tatap muka','2023-05-06 09:17:09','2023-05-06 09:17:09'),(15,'jirigen','2023-05-06 09:17:09','2023-05-06 09:17:09'),(16,'kaleng','2023-05-06 09:17:09','2023-05-06 09:17:09'),(17,'kali','2023-05-06 09:17:09','2023-05-06 09:17:09'),(18,'kapsul','2023-05-06 09:17:09','2023-05-06 09:17:09'),(19,'kegiatan','2023-05-06 09:17:09','2023-05-06 09:17:09'),(20,'kelompok','2023-05-06 09:17:09','2023-05-06 09:17:09'),(21,'kg','2023-05-06 09:17:09','2023-05-06 09:17:09'),(22,'kotak','2023-05-06 09:17:09','2023-05-06 09:17:09'),(23,'kubik','2023-05-06 09:17:09','2023-05-06 09:17:09'),(24,'liter','2023-05-06 09:17:09','2023-05-06 09:17:09'),(25,'lomba','2023-05-06 09:17:09','2023-05-06 09:17:09'),(26,'lusin','2023-05-06 09:17:09','2023-05-06 09:17:09'),(27,'m2','2023-05-06 09:17:09','2023-05-06 09:17:09'),(28,'mapel','2023-05-06 09:17:09','2023-05-06 09:17:09'),(29,'meter','2023-05-06 09:17:09','2023-05-06 09:17:09'),(30,'OB','2023-05-06 09:17:09','2023-05-06 09:17:09'),(31,'OH','2023-05-06 09:17:09','2023-05-06 09:17:09'),(32,'OK','2023-05-06 09:17:09','2023-05-06 09:17:09'),(33,'pak','2023-05-06 09:17:09','2023-05-06 09:17:09'),(34,'paket','2023-05-06 09:17:09','2023-05-06 09:17:09'),(35,'pasang','2023-05-06 09:17:09','2023-05-06 09:17:09'),(36,'pekan','2023-05-06 09:17:09','2023-05-06 09:17:09'),(37,'persen','2023-05-06 09:17:09','2023-05-06 09:17:09'),(38,'potong','2023-05-06 09:17:09','2023-05-06 09:17:09'),(39,'rim','2023-05-06 09:17:09','2023-05-06 09:17:09'),(40,'roll','2023-05-06 09:17:09','2023-05-06 09:17:09'),(41,'semester','2023-05-06 09:17:09','2023-05-06 09:17:09'),(42,'set','2023-05-06 09:17:09','2023-05-06 09:17:09'),(43,'siswa','2023-05-06 09:17:09','2023-05-06 09:17:09'),(44,'strip','2023-05-06 09:17:09','2023-05-06 09:17:09'),(45,'tablet','2023-05-06 09:17:09','2023-05-06 09:17:09'),(46,'tabung','2023-05-06 09:17:09','2023-05-06 09:17:09'),(47,'tahun','2023-05-06 09:17:09','2023-05-06 09:17:09'),(48,'trip','2023-05-06 09:17:09','2023-05-06 09:17:09'),(49,'triwulan','2023-05-06 09:17:09','2023-05-06 09:17:09'),(50,'unit','2023-05-06 09:17:09','2023-05-06 09:17:09'),(51,'zak','2023-05-06 09:17:09','2023-05-06 09:17:09');
/*!40000 ALTER TABLE `list_satuan` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-06-22 11:11:15