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
-- Table structure for table `empresas_sedes`
--

DROP TABLE IF EXISTS `empresas_sedes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `empresas_sedes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `estado` int(11) DEFAULT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `telefono` varchar(255) DEFAULT NULL,
  `celular` varchar(255) DEFAULT NULL,
  `whatsapp` varchar(255) DEFAULT NULL,
  `correo` varchar(255) DEFAULT NULL,
  `location` text DEFAULT NULL,
  `horario` varchar(255) DEFAULT NULL,
  `empresa_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `empresas_sedes`
--

LOCK TABLES `empresas_sedes` WRITE;
/*!40000 ALTER TABLE `empresas_sedes` DISABLE KEYS */;
INSERT INTO `empresas_sedes` VALUES (1,'Tienda Prueba 1','<p>adasd</p>\n','Callao 105 ',NULL,'https://uploadgerencie.com/imagenes/el-costo-unitario-de-fabricacion-de-un-producto-y-la-determinacion-del-precio-de-venta.png','123456789','12345678910','123456789','tienda_test@hotmail.com','-12.05659,-77.11814','10:00 AM - 20:00 P.M',NULL),(2,'Tienda Prueba 2',NULL,'',1,'https://sole.com.pe/img/cms/cms_contenido/Fachada_Sole-callao.jpg','123456789','12345678910','123456789','tienda_test@hotmail.com','','07:00 AM - 21:00 P.M',NULL),(4,'Tienda 04','<p>Tienda 04 actualizada con horario desactivado</p>\n','',0,'https://s14415.pcdn.co/wp-content/uploads/2014/03/logos.jpg','','','','tienda04@gmail.com','','07:00 AM - 10:00 PM',NULL),(5,'Tienda 05','<p>Tienda 05 actualizada</p>\n','Calle tienda 05',0,'https://blog.dinterweb.com/hubfs/Imported_Blog_Media/38060627_ml-e1482765993493.jpg','','','','tienda05@gmail.com','','05:00 AM - 07:00 PM',NULL),(6,'Tienda 06','<p>Tienda 06 nuevo</p>\n',NULL,1,'https://www.beetrack.com/hs-fs/hubfs/Distribucion%20por%20producto%20planta.jpg?width=600&name=Distribucion%20por%20producto%20planta.jpg','7654321','undefined','987654321','tienda06@gmail.com',NULL,'9:00 AM - 10:00 PM',NULL),(8,'Tienda 07','<p>Tienda 07 nueva con datos basicos</p>\n',NULL,1,'http://localhost:3001/uploads/fUELVWhTz.png','','undefined','','tienda07@gmail.com',NULL,'05:00AM - 04:00 PM',NULL),(9,'Frutos Secos','<p>Frutos Secos&nbsp;</p>\n','',1,'https://www.beetrack.com/hs-fs/hubfs/Distribucion%20por%20producto%20planta.jpg?width=600&name=Distribucion%20por%20producto%20planta.jpg','0190148228','','990148228','frutossecos@gmail.com','','9am a 6pm',NULL),(11,'sede 1',NULL,'calle 5',1,'https://www.cuba.travel/images/noimage.png','11525352',NULL,NULL,'test@correo.com',NULL,'9 a 10 hs',75),(12,'sede 1',NULL,'calle1',1,'https://res.cloudinary.com/dpcoqe1rt/image/upload/v1673834678/Inkalandia/2023-01-16T02-04-35.419Zmanzan.jpg.jpg','1130000','111',NULL,'test@correo.com',NULL,'9 a 10 hs',29);
/*!40000 ALTER TABLE `empresas_sedes` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-01-17  7:56:26
