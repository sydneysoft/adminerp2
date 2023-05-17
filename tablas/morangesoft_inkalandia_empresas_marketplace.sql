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
-- Table structure for table `empresas_marketplace`
--

DROP TABLE IF EXISTS `empresas_marketplace`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `empresas_marketplace` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `membresa_id` int(10) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `nombre` varchar(255) DEFAULT '-',
  `razon_social` varchar(255) DEFAULT '-',
  `whatsapp_corporativo` varchar(255) DEFAULT '-',
  `facebook_corporativo` varchar(255) DEFAULT '-',
  `youtube_corporativo` varchar(255) DEFAULT '-',
  `twitter_corporativo` varchar(255) DEFAULT '-',
  `instagram_corporativo` varchar(255) DEFAULT '-',
  `email_corporativo` varchar(255) DEFAULT '-',
  `direccion` varchar(255) DEFAULT '-',
  `nombre_contacto` varchar(255) DEFAULT '-',
  `celular_contacto` varchar(255) DEFAULT '-',
  `email_contacto` varchar(255) DEFAULT '-',
  `plan` varchar(45) DEFAULT '-',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `contrasena` varchar(255) DEFAULT NULL,
  `estado_de_membresia` varchar(50) NOT NULL DEFAULT 'ACTIVO',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `empresas_marketplace`
--

LOCK TABLES `empresas_marketplace` WRITE;
/*!40000 ALTER TABLE `empresas_marketplace` DISABLE KEYS */;
INSERT INTO `empresas_marketplace` VALUES (0,NULL,NULL,'Inkalandia','Inkalandia','-','-','-','-','-','-','-','-','-','-','-','2023-01-05 20:08:30','2023-01-11 18:55:04',NULL,'ACTIVO'),(29,NULL,NULL,'localhost:3000','test','+514125765863','test','test','test','test','test@test.com','test','test','+51412576','test@test.com','-','2023-01-10 21:28:30','2023-01-16 23:27:14','$2b$05$7aNcN3SgEg74V8Bjm.kDMex5F6qyMJc9h0K4d1lsgIxXZmJSfgEAO','ACTIVO'),(55,NULL,NULL,'empresa2','empresa2','+5104145765863','empresa2','empresa2','empresa2','empresa2','empresa2@empresa2.com','empresa2','empresa2','+5104155555555','empresa2@empresa2.com','-','2023-01-11 19:14:25','2023-01-14 18:29:03','$2b$05$WYSSxFONxPZ07RNnNEhAbeQG0jKP5IkTFxgsROl6lgsNt9ayzJQFO','ACTIVO'),(56,NULL,NULL,'mintoautomotive','-','+51123456','-','-','-','-','minto@minto.com','-','-','-','-','-','2023-01-12 20:03:19','2023-01-12 20:23:19','123456','ACTIVO');
/*!40000 ALTER TABLE `empresas_marketplace` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-01-17  8:01:50
