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
-- Table structure for table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accounts` (
  `uuid` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `group_account_id` varchar(255) DEFAULT NULL,
  `account_number` varchar(255) DEFAULT NULL,
  `activity_id` varchar(255) DEFAULT NULL,
  `asset` tinyint(1) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`uuid`),
  KEY `group_account_id` (`group_account_id`),
  KEY `activity_id` (`activity_id`),
  CONSTRAINT `accounts_ibfk_3` FOREIGN KEY (`group_account_id`) REFERENCES `group_accounts` (`uuid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `accounts_ibfk_4` FOREIGN KEY (`activity_id`) REFERENCES `detail_of_activity` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts`
--

LOCK TABLES `accounts` WRITE;
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `activity`
--

DROP TABLE IF EXISTS `activity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activity` (
  `id` varchar(255) NOT NULL,
  `activity_no` int DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `status` int DEFAULT NULL,
  `component_id` varchar(255) DEFAULT NULL,
  `continue` tinyint(1) DEFAULT NULL,
  `institution_no` int DEFAULT NULL,
  `academic_year` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `component_id` (`component_id`),
  CONSTRAINT `activity_ibfk_1` FOREIGN KEY (`component_id`) REFERENCES `component` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity`
--

LOCK TABLES `activity` WRITE;
/*!40000 ALTER TABLE `activity` DISABLE KEYS */;
/*!40000 ALTER TABLE `activity` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blacklist_token`
--

DROP TABLE IF EXISTS `blacklist_token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blacklist_token` (
  `id` int NOT NULL AUTO_INCREMENT,
  `jti` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blacklist_token`
--

LOCK TABLES `blacklist_token` WRITE;
/*!40000 ALTER TABLE `blacklist_token` DISABLE KEYS */;
/*!40000 ALTER TABLE `blacklist_token` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `component`
--

DROP TABLE IF EXISTS `component`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `component` (
  `id` varchar(255) NOT NULL,
  `component_no` int DEFAULT NULL,
  `item` varchar(255) DEFAULT NULL,
  `modifable` tinyint(1) DEFAULT '0',
  `program_id` varchar(255) DEFAULT NULL,
  `academic_year` varchar(255) DEFAULT NULL,
  `institution_no` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `program_id` (`program_id`),
  CONSTRAINT `component_ibfk_1` FOREIGN KEY (`program_id`) REFERENCES `program` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `component`
--

LOCK TABLES `component` WRITE;
/*!40000 ALTER TABLE `component` DISABLE KEYS */;
/*!40000 ALTER TABLE `component` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detail_of_activity`
--

DROP TABLE IF EXISTS `detail_of_activity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detail_of_activity` (
  `id` varchar(255) NOT NULL,
  `description` text,
  `unit_id` int DEFAULT NULL,
  `vol` int DEFAULT NULL,
  `unit_price` int DEFAULT NULL,
  `thawing_method` varchar(255) DEFAULT NULL,
  `from` int DEFAULT NULL,
  `until` int DEFAULT NULL,
  `total` bigint DEFAULT NULL,
  `sub_activity_id` varchar(255) DEFAULT NULL,
  `activity_id` varchar(255) DEFAULT NULL,
  `academic_year` varchar(255) DEFAULT NULL,
  `institution_income_id` varchar(255) DEFAULT NULL,
  `sharing_program` tinyint(1) DEFAULT '0',
  `post` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `sub_activity_id` (`sub_activity_id`),
  KEY `activity_id` (`activity_id`),
  KEY `institution_income_id` (`institution_income_id`),
  CONSTRAINT `detail_of_activity_ibfk_4` FOREIGN KEY (`sub_activity_id`) REFERENCES `sub_activity` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `detail_of_activity_ibfk_5` FOREIGN KEY (`activity_id`) REFERENCES `activity` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `detail_of_activity_ibfk_6` FOREIGN KEY (`institution_income_id`) REFERENCES `institution_income` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detail_of_activity`
--

LOCK TABLES `detail_of_activity` WRITE;
/*!40000 ALTER TABLE `detail_of_activity` DISABLE KEYS */;
/*!40000 ALTER TABLE `detail_of_activity` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `disbursement_of_funds`
--

DROP TABLE IF EXISTS `disbursement_of_funds`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `disbursement_of_funds` (
  `uuid` varchar(255) NOT NULL,
  `amount` bigint DEFAULT NULL,
  `status` tinyint(1) DEFAULT '0',
  `withdraw` tinyint(1) DEFAULT '0',
  `accounting_year` varchar(255) DEFAULT NULL,
  `month_index` int DEFAULT NULL,
  `sharing_program` tinyint(1) DEFAULT '0',
  `recipient` varchar(255) DEFAULT NULL,
  `ptk_id` varchar(255) DEFAULT NULL,
  `activity_id` varchar(255) DEFAULT NULL,
  `reference_of_jurnal` varchar(255) DEFAULT NULL,
  `sharing_program_id` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`uuid`),
  KEY `ptk_id` (`ptk_id`),
  KEY `activity_id` (`activity_id`),
  KEY `sharing_program_id` (`sharing_program_id`),
  CONSTRAINT `disbursement_of_funds_ibfk_4` FOREIGN KEY (`ptk_id`) REFERENCES `ptk` (`uuid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `disbursement_of_funds_ibfk_5` FOREIGN KEY (`activity_id`) REFERENCES `detail_of_activity` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `disbursement_of_funds_ibfk_6` FOREIGN KEY (`sharing_program_id`) REFERENCES `sharing_programs` (`uuid`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `disbursement_of_funds`
--

LOCK TABLES `disbursement_of_funds` WRITE;
/*!40000 ALTER TABLE `disbursement_of_funds` DISABLE KEYS */;
/*!40000 ALTER TABLE `disbursement_of_funds` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `group_accounts`
--

DROP TABLE IF EXISTS `group_accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `group_accounts` (
  `uuid` varchar(255) NOT NULL,
  `group_account` int DEFAULT NULL,
  `group_account_label` int DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `group_accounts`
--

LOCK TABLES `group_accounts` WRITE;
/*!40000 ALTER TABLE `group_accounts` DISABLE KEYS */;
/*!40000 ALTER TABLE `group_accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `income_groups`
--

DROP TABLE IF EXISTS `income_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `income_groups` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `parent_id` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `income_groups`
--

LOCK TABLES `income_groups` WRITE;
/*!40000 ALTER TABLE `income_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `income_groups` ENABLE KEYS */;
UNLOCK TABLES;

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

--
-- Table structure for table `institution_income`
--

DROP TABLE IF EXISTS `institution_income`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `institution_income` (
  `id` varchar(255) NOT NULL,
  `institution_id` int DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `academic_year` varchar(255) DEFAULT NULL,
  `total` bigint DEFAULT NULL,
  `budgeted` bigint DEFAULT NULL,
  `income_group_id` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `institution_income`
--

LOCK TABLES `institution_income` WRITE;
/*!40000 ALTER TABLE `institution_income` DISABLE KEYS */;
/*!40000 ALTER TABLE `institution_income` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `journal_reference_numbers`
--

DROP TABLE IF EXISTS `journal_reference_numbers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `journal_reference_numbers` (
  `uuid` varchar(255) NOT NULL,
  `number` int DEFAULT NULL,
  `accounting_year` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `journal_reference_numbers`
--

LOCK TABLES `journal_reference_numbers` WRITE;
/*!40000 ALTER TABLE `journal_reference_numbers` DISABLE KEYS */;
/*!40000 ALTER TABLE `journal_reference_numbers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `journals`
--

DROP TABLE IF EXISTS `journals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `journals` (
  `uuid` varchar(255) NOT NULL,
  `reference` varchar(255) DEFAULT NULL,
  `transaction_date` date DEFAULT NULL,
  `amount` bigint DEFAULT NULL,
  `status` varchar(1) DEFAULT NULL,
  `accounting_year` varchar(255) DEFAULT NULL,
  `account_id` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `closing` tinyint(1) DEFAULT '0',
  `automatic_generate` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`uuid`),
  KEY `account_id` (`account_id`),
  CONSTRAINT `journals_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`uuid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `journals`
--

LOCK TABLES `journals` WRITE;
/*!40000 ALTER TABLE `journals` DISABLE KEYS */;
/*!40000 ALTER TABLE `journals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ledgers`
--

DROP TABLE IF EXISTS `ledgers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ledgers` (
  `uuid` varchar(255) NOT NULL,
  `accounting_year` varchar(255) DEFAULT NULL,
  `account_id` varchar(255) DEFAULT NULL,
  `month_index` int DEFAULT NULL,
  `open` tinyint(1) DEFAULT '1',
  `total` bigint DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`uuid`),
  KEY `account_id` (`account_id`),
  CONSTRAINT `ledgers_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`uuid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ledgers`
--

LOCK TABLES `ledgers` WRITE;
/*!40000 ALTER TABLE `ledgers` DISABLE KEYS */;
/*!40000 ALTER TABLE `ledgers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `listTahun`
--

DROP TABLE IF EXISTS `listTahun`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `listTahun` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tahun` varchar(255) DEFAULT NULL,
  `active` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `listTahun`
--

LOCK TABLES `listTahun` WRITE;
/*!40000 ALTER TABLE `listTahun` DISABLE KEYS */;
/*!40000 ALTER TABLE `listTahun` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `program`
--

DROP TABLE IF EXISTS `program`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `program` (
  `id` varchar(255) NOT NULL,
  `institution_no` int DEFAULT NULL,
  `program_no` int DEFAULT NULL,
  `item` varchar(255) DEFAULT NULL,
  `modifable` tinyint(1) DEFAULT NULL,
  `academic_year` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `institution_no` (`institution_no`),
  CONSTRAINT `program_ibfk_1` FOREIGN KEY (`institution_no`) REFERENCES `institution` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `program`
--

LOCK TABLES `program` WRITE;
/*!40000 ALTER TABLE `program` DISABLE KEYS */;
/*!40000 ALTER TABLE `program` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ptk`
--

DROP TABLE IF EXISTS `ptk`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ptk` (
  `uuid` varchar(255) NOT NULL,
  `nupy` varchar(14) DEFAULT NULL,
  `nama` varchar(100) DEFAULT NULL,
  `tempat_lahir` varchar(255) DEFAULT NULL,
  `tanggal_lahir` date DEFAULT NULL,
  `alamat` varchar(255) DEFAULT NULL,
  `kecamatan` varchar(255) DEFAULT NULL,
  `kabupaten` varchar(255) DEFAULT NULL,
  `provinsi` varchar(255) DEFAULT NULL,
  `gender` varchar(1) DEFAULT NULL,
  `no_hp` varchar(255) DEFAULT NULL,
  `status_pernikahan` varchar(255) DEFAULT NULL,
  `pendidikan_terakhir` varchar(255) DEFAULT NULL,
  `gelar` varchar(255) DEFAULT NULL,
  `gol_darah` varchar(4) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ptk`
--

LOCK TABLES `ptk` WRITE;
/*!40000 ALTER TABLE `ptk` DISABLE KEYS */;
/*!40000 ALTER TABLE `ptk` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role` (
  `uuid` varchar(255) NOT NULL,
  `nama_role` varchar(255) DEFAULT NULL,
  `uuid_sistem` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`uuid`),
  KEY `uuid_sistem` (`uuid_sistem`),
  CONSTRAINT `role_ibfk_1` FOREIGN KEY (`uuid_sistem`) REFERENCES `sistem` (`uuid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sharing_programs`
--

DROP TABLE IF EXISTS `sharing_programs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sharing_programs` (
  `uuid` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sharing_programs`
--

LOCK TABLES `sharing_programs` WRITE;
/*!40000 ALTER TABLE `sharing_programs` DISABLE KEYS */;
/*!40000 ALTER TABLE `sharing_programs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sistem`
--

DROP TABLE IF EXISTS `sistem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sistem` (
  `uuid` varchar(255) NOT NULL,
  `nama_sistem` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sistem`
--

LOCK TABLES `sistem` WRITE;
/*!40000 ALTER TABLE `sistem` DISABLE KEYS */;
/*!40000 ALTER TABLE `sistem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sub_activity`
--

DROP TABLE IF EXISTS `sub_activity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sub_activity` (
  `id` varchar(255) NOT NULL,
  `sub_activity_no` int DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `institution_no` int DEFAULT NULL,
  `academic_year` varchar(255) DEFAULT NULL,
  `activity_id` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `activity_id` (`activity_id`),
  CONSTRAINT `sub_activity_ibfk_1` FOREIGN KEY (`activity_id`) REFERENCES `activity` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sub_activity`
--

LOCK TABLES `sub_activity` WRITE;
/*!40000 ALTER TABLE `sub_activity` DISABLE KEYS */;
/*!40000 ALTER TABLE `sub_activity` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `unit`
--

DROP TABLE IF EXISTS `unit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `unit` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `unit`
--

LOCK TABLES `unit` WRITE;
/*!40000 ALTER TABLE `unit` DISABLE KEYS */;
INSERT INTO `unit` VALUES (1,'batang','2023-05-06 09:17:09','2023-05-06 09:17:09'),(2,'botol','2023-05-06 09:17:09','2023-05-06 09:17:09'),(3,'box','2023-05-06 09:17:09','2023-05-06 09:17:09'),(4,'buah','2023-05-06 09:17:09','2023-05-06 09:17:09'),(5,'buku','2023-05-06 09:17:09','2023-05-06 09:17:09'),(6,'bulan','2023-05-06 09:17:09','2023-05-06 09:17:09'),(7,'bungkus','2023-05-06 09:17:09','2023-05-06 09:17:09'),(8,'dos','2023-05-06 09:17:09','2023-05-06 09:17:09'),(9,'feet','2023-05-06 09:17:09','2023-05-06 09:17:09'),(10,'galon','2023-05-06 09:17:09','2023-05-06 09:17:09'),(11,'gulung','2023-05-06 09:17:09','2023-05-06 09:17:09'),(12,'hari','2023-05-06 09:17:09','2023-05-06 09:17:09'),(13,'jam','2023-05-06 09:17:09','2023-05-06 09:17:09'),(14,'jam tatap muka','2023-05-06 09:17:09','2023-05-06 09:17:09'),(15,'jirigen','2023-05-06 09:17:09','2023-05-06 09:17:09'),(16,'kaleng','2023-05-06 09:17:09','2023-05-06 09:17:09'),(17,'kali','2023-05-06 09:17:09','2023-05-06 09:17:09'),(18,'kapsul','2023-05-06 09:17:09','2023-05-06 09:17:09'),(19,'kegiatan','2023-05-06 09:17:09','2023-05-06 09:17:09'),(20,'kelompok','2023-05-06 09:17:09','2023-05-06 09:17:09'),(21,'kg','2023-05-06 09:17:09','2023-05-06 09:17:09'),(22,'kotak','2023-05-06 09:17:09','2023-05-06 09:17:09'),(23,'kubik','2023-05-06 09:17:09','2023-05-06 09:17:09'),(24,'liter','2023-05-06 09:17:09','2023-05-06 09:17:09'),(25,'lomba','2023-05-06 09:17:09','2023-05-06 09:17:09'),(26,'lusin','2023-05-06 09:17:09','2023-05-06 09:17:09'),(27,'m2','2023-05-06 09:17:09','2023-05-06 09:17:09'),(28,'mapel','2023-05-06 09:17:09','2023-05-06 09:17:09'),(29,'meter','2023-05-06 09:17:09','2023-05-06 09:17:09'),(30,'OB','2023-05-06 09:17:09','2023-05-06 09:17:09'),(31,'OH','2023-05-06 09:17:09','2023-05-06 09:17:09'),(32,'OK','2023-05-06 09:17:09','2023-05-06 09:17:09'),(33,'pak','2023-05-06 09:17:09','2023-05-06 09:17:09'),(34,'paket','2023-05-06 09:17:09','2023-05-06 09:17:09'),(35,'pasang','2023-05-06 09:17:09','2023-05-06 09:17:09'),(36,'pekan','2023-05-06 09:17:09','2023-05-06 09:17:09'),(37,'persen','2023-05-06 09:17:09','2023-05-06 09:17:09'),(38,'potong','2023-05-06 09:17:09','2023-05-06 09:17:09'),(39,'rim','2023-05-06 09:17:09','2023-05-06 09:17:09'),(40,'roll','2023-05-06 09:17:09','2023-05-06 09:17:09'),(41,'semester','2023-05-06 09:17:09','2023-05-06 09:17:09'),(42,'set','2023-05-06 09:17:09','2023-05-06 09:17:09'),(43,'siswa','2023-05-06 09:17:09','2023-05-06 09:17:09'),(44,'strip','2023-05-06 09:17:09','2023-05-06 09:17:09'),(45,'tablet','2023-05-06 09:17:09','2023-05-06 09:17:09'),(46,'tabung','2023-05-06 09:17:09','2023-05-06 09:17:09'),(47,'tahun','2023-05-06 09:17:09','2023-05-06 09:17:09'),(48,'trip','2023-05-06 09:17:09','2023-05-06 09:17:09'),(49,'triwulan','2023-05-06 09:17:09','2023-05-06 09:17:09'),(50,'unit','2023-05-06 09:17:09','2023-05-06 09:17:09'),(51,'zak','2023-05-06 09:17:09','2023-05-06 09:17:09');
/*!40000 ALTER TABLE `unit` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `uuid` varchar(255) NOT NULL,
  `nama` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `general_user` tinyint(1) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`uuid`),
  UNIQUE KEY `user_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_sistem`
--

DROP TABLE IF EXISTS `user_sistem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_sistem` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid_user` varchar(255) DEFAULT NULL,
  `uuid_sistem` varchar(255) DEFAULT NULL,
  `uuid_role` varchar(255) DEFAULT NULL,
  `super_admin` tinyint(1) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `user_sistem` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `uuid_user` (`uuid_user`),
  KEY `uuid_sistem` (`uuid_sistem`),
  KEY `uuid_role` (`uuid_role`),
  KEY `user_sistem` (`user_sistem`),
  CONSTRAINT `user_sistem_ibfk_1` FOREIGN KEY (`uuid_user`) REFERENCES `user` (`uuid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_sistem_ibfk_2` FOREIGN KEY (`uuid_sistem`) REFERENCES `sistem` (`uuid`) ON UPDATE CASCADE,
  CONSTRAINT `user_sistem_ibfk_3` FOREIGN KEY (`uuid_role`) REFERENCES `role` (`uuid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_sistem_ibfk_4` FOREIGN KEY (`user_sistem`) REFERENCES `sistem` (`uuid`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_sistem`
--

LOCK TABLES `user_sistem` WRITE;
/*!40000 ALTER TABLE `user_sistem` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_sistem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `year_active_in_systems`
--

DROP TABLE IF EXISTS `year_active_in_systems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `year_active_in_systems` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `academic_year` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `year_active_in_systems`
--

LOCK TABLES `year_active_in_systems` WRITE;
/*!40000 ALTER TABLE `year_active_in_systems` DISABLE KEYS */;
INSERT INTO `year_active_in_systems` VALUES ('0','apakah','2024/2025','2024-06-24 22:22:55','2024-06-24 22:22:55');
/*!40000 ALTER TABLE `year_active_in_systems` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-06-24 22:23:22
