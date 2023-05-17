CREATE DATABASE  IF NOT EXISTS `morangesoft_inkalandia` /*!40100 DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci */;
USE `morangesoft_inkalandia`;
-- MySQL dump 10.19  Distrib 10.3.37-MariaDB, for Win64 (AMD64)
--
-- Host: 31.220.60.159    Database: morangesoft_inkalandia
-- ------------------------------------------------------
-- Server version	10.3.37-MariaDB

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
-- Table structure for table `empresas_registradas_categorias`
--

DROP TABLE IF EXISTS `empresas_registradas_categorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `empresas_registradas_categorias` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `categoria` varchar(255) DEFAULT NULL,
  `empresa_id` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `empresas_registradas_categorias`
--

LOCK TABLES `empresas_registradas_categorias` WRITE;
/*!40000 ALTER TABLE `empresas_registradas_categorias` DISABLE KEYS */;
INSERT INTO `empresas_registradas_categorias` VALUES (43,'Indumentaria','75','2022-12-20 19:14:44','2022-12-21 21:31:52'),(44,'Tienda','75','2022-12-20 19:14:44','2022-12-20 19:14:44'),(50,'Tienda','79','2022-12-23 00:21:14','2022-12-23 00:21:14'),(51,'Laboratorio','79','2022-12-23 00:21:14','2022-12-23 00:21:14'),(52,'Clinica','80','2022-12-23 00:24:08','2022-12-23 00:24:08'),(53,'Laboratorio','80','2022-12-23 00:24:08','2022-12-23 00:24:08'),(54,'Clinica','81','2022-12-23 00:24:54','2022-12-23 00:24:54'),(55,'Laboratorio','81','2022-12-23 00:24:54','2022-12-23 00:24:54'),(56,'Laboratorio','82','2022-12-23 00:28:58','2022-12-23 00:28:58'),(57,'Indumentaria','82','2022-12-23 00:28:58','2022-12-23 00:28:58'),(58,'Clinica','91','2023-01-12 22:16:43','2023-01-12 22:16:43'),(59,'Tienda','92','2023-01-12 22:23:22','2023-01-12 22:23:22');
/*!40000 ALTER TABLE `empresas_registradas_categorias` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-01-17  7:54:50
