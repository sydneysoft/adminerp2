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
-- Table structure for table `banners`
--

DROP TABLE IF EXISTS `banners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `banners` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `z_timestamp_create` datetime DEFAULT current_timestamp(),
  `empresa_id` int(11) DEFAULT 0,
  `nombre` varchar(255) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `imagen` text DEFAULT NULL,
  `activado` char(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `banners`
--

LOCK TABLES `banners` WRITE;
/*!40000 ALTER TABLE `banners` DISABLE KEYS */;
INSERT INTO `banners` VALUES (2,'2022-12-22 09:55:45',0,'banner1','www.fefe','feeffefe','https://www.sistemaimpulsa.com/blog/wp-content/uploads/2019/02/apps-105107-696x541.jpg','1'),(3,'2022-12-22 09:57:48',0,'banne2','fefef','effefe','https://www.escueladenegociosydireccion.com/revista/wp-content/uploads/2016/02/test-mercado.png','1'),(5,'2022-12-22 09:59:59',0,'fefe','fefe','fefe','https://dox4euoyzny9u.cloudfront.net/images/smspubli/website/lanzamiento.jpg','1'),(8,'2022-12-22 10:37:20',75,'banne30','www','wfwf','https://blog.dinterweb.com/hubfs/Imported_Blog_Media/38060627_ml-e1482765993493.jpg','1'),(9,'2023-01-04 16:19:46',29,'Banner1','..','baner','https://res.cloudinary.com/dpcoqe1rt/image/upload/v1673834678/Inkalandia/2023-01-16T02-04-35.419Zmanzan.jpg.jpg','1'),(10,'2023-01-05 20:15:30',29,'Banner2','bae','feffe','https://www.sistemaimpulsa.com/blog/wp-content/uploads/2019/02/apps-105107-696x541.jpg','1');
/*!40000 ALTER TABLE `banners` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-01-17  7:59:05
