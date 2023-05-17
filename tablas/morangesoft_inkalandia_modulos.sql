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
-- Table structure for table `modulos`
--

DROP TABLE IF EXISTS `modulos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `modulos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `categoria_id` varchar(255) DEFAULT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `icono` varchar(255) DEFAULT NULL,
  `texto` varchar(255) DEFAULT NULL,
  `orden` varchar(255) DEFAULT NULL,
  `fuente` varchar(255) DEFAULT NULL,
  `activo` char(1) DEFAULT NULL,
  `nombre_componente` varchar(255) DEFAULT NULL,
  `import` text DEFAULT NULL,
  `roles` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `modulos`
--

LOCK TABLES `modulos` WRITE;
/*!40000 ALTER TABLE `modulos` DISABLE KEYS */;
INSERT INTO `modulos` VALUES (1,'4','Productos','admin-productos','fa-user','Productos','25','Roboto Condensed, sans-serif','1',NULL,NULL,NULL),(2,'8','Módulos','admin-modulos','fa-user-md','Módulos','4','Roboto Condensed, sans-serif','0',NULL,NULL,NULL),(3,'4','Marcas','admin-marcas','fa-user','Marcas','21','Roboto Condensed, sans-serif','1',NULL,NULL,NULL),(4,'3','Banners','admin-banners','fa-hand-holding-medical','Banners','6','Roboto Condensed, sans-serif','1',NULL,NULL,NULL),(5,'4','Categorías','admin-categorias','fa-microphone-alt','Categorías','20','Roboto Condensed, sans-serif','1',NULL,NULL,NULL),(6,'5','Galeria','admin-galeria','fa-user-md','Galeria','12','Roboto Condensed, sans-serif','1',NULL,NULL,NULL),(7,'4','Subcategorías','admin-subcategorias','fa-user-md','Subcategorías','10','Roboto Condensed, sans-serif','1',NULL,NULL,NULL),(8,'4','Filtros','admin-filtros','fa-user-md','Filtros','1','Roboto Condensed, sans-serif','1',NULL,NULL,NULL),(9,'1','Facturación','admin-facturacion','fa-user-md','Facturación','100','Roboto Condensed, sans-serif','1',NULL,NULL,NULL),(10,'5','Métodos de Envío','admin-shipping','fa fa-user','Métodos de Envío','15','font-family: regular','1',NULL,NULL,NULL),(11,'5','Regiones','admin-regiones','fa fa-user','Regiones','18','font-family:regular;','1',NULL,NULL,NULL),(12,'5','Admin Servicios','admin-servicios-entrega','fa fa-user','Servicios de Entrega','21','Roboto Condensed, sans-serif','1',NULL,NULL,NULL),(13,'5','Métodos de Pago','admin-metodos-pago','fa-user-md','Métodos de Pago','25','Roboto Condensed, sans-serif','1',NULL,NULL,NULL),(14,'1','Métodos de Facturación','admin-metodos-facturacion','fa-user-md','Configuración Nubefact','15','Roboto Condensed, sans-serif','1',NULL,NULL,NULL),(15,'3','Configuración Portadas','admin-portadas','fa-user-md','Configuración Portadas','25','Roboto Condensed, sans-serif','1',NULL,NULL,NULL),(16,'3','Ventanas Emergentes','admin-ventanas-emergentes','fa-user-md','Ventanas Emergentes','23','Roboto Condensed, sans-serif','1',NULL,NULL,NULL),(17,'5','Configuración Chatbots','admin-configuracion-chatbot','fa-user-md','Configuración Chatbots','16','Roboto Condensed, sans-serif','1',NULL,NULL,NULL),(18,'4','Catálogos','admin-catalogo','fa-user-md','Catálogos','50','Roboto Condensed, sans-serif','0',NULL,NULL,NULL),(19,'2','Libro de Reclamaciónes','admin-libro-reclamaciones','fa-user-md','Libro de Reclamaciónes','21','Roboto Condensed, sans-serif','1',NULL,NULL,NULL),(20,'3','Newsletter','admin-newsletter','fa-hand-holding-medical','Newsletter','38','Roboto Condensed, sans-serif','1',NULL,NULL,NULL),(21,'5','Agregar CSS','admin-agregar-css','fa-user-md','Agregar CSS','12','Roboto Condensed, sans-serif','1',NULL,NULL,NULL),(22,'5','Configuración Sistema','admin-sistema','fa-user-md','Configuración Sistema','9999999999999','Roboto Condensed, sans-serif','1',NULL,NULL,NULL),(23,'2','Administradores','admin-usuarios','fa-user-md','Administradores','24','Roboto Condensed, sans-serif','1',NULL,NULL,NULL),(24,'6','Configuración Citas','admin-configuracion-citas','fa-user-md','Configuración Citas','12','Roboto Condensed, sans-serif','0',NULL,NULL,NULL),(25,'4','Prendas','admin-prendas','fa-user','Prendas','26','Roboto Condensed, sans-serif','1',NULL,NULL,NULL),(26,'4','Sedes','admin-sedes','fa-user','Sedes','27','Roboto Condensed, sans-serif','1',NULL,NULL,NULL),(27,'4','Tratamientos','admin-tratamientos','fa-user','Tratamientos','28','Roboto Condensed, sans-serif','1',NULL,NULL,NULL),(29,'1','Proveedores','admin-pago-proveedores','fa-user','Pago Proveedores','457','Roboto Condensed, sans-serif','1',NULL,NULL,NULL),(30,'1','Personal','admin-pago-personal','fa-user','Pago Personal','458','Roboto Condensed, sans-serif','1',NULL,NULL,NULL),(31,'4','Almacenes','admin-almacenes','fa-user','Almacenes','459','Roboto Condensed, sans-serif','1',NULL,NULL,NULL),(32,'2','Choferes','admin-choferes','fa-user','Choferes','457','Roboto Condensed, sans-serif','1',NULL,NULL,NULL),(33,'2','Trabajadores','admin-trabajadores','fa-user','Trabajadores','457','Roboto Condensed, sans-serif','1',NULL,NULL,NULL),(34,'2','Sesiones','admin-sesiones','fa-user','Sesiones','459','Roboto Condensed, sans-serif','1',NULL,NULL,NULL),(35,'7','Cotizaciones','cotizaciones','fa-user','Cotizaciones','460','Roboto Condensed, sans-serif','1',NULL,NULL,NULL),(36,'8','Empresas','admin-empresas','fa-user','Empresas','461','Roboto Condensed, sans-serif','1',NULL,NULL,NULL),(37,'8','Marketplace','admin-marketplace','fa-user','Marketplace','462','Roboto Condensed, sans-serif','1',NULL,NULL,NULL),(38,'9','Planes de membresia','admin-planes-landing',NULL,NULL,NULL,NULL,'1',NULL,NULL,NULL),(42,'1','Footer','admin-footer','fa-list','Footer','500','Roboto Condensed, sans-serif','1','','',NULL),(43,'1','Páginas','admin-paginas','fa-file','Paginas','501','Roboto Condensed, sans-serif','1','','',NULL),(44,'1','Horarios','admin-horarios','fa-clock','Horarios','503','','1','','',NULL),(45,'1','Sliders','admin-sliders','fa-sliders-h','Sliders','502','Roboto Condensed, sans-serif','1',NULL,NULL,NULL),(46,'1','CE Servicios','admin-ceservicios','fa-concierge-bell','CE Servicios','504','Roboto Condensed, sans-serif','1',NULL,NULL,NULL),(47,'1','Contactos','admin-contactos','fa-address-book','Contactos','505','Roboto Condensed, sans-serif','1','','',NULL),(48,'1','Google Map','admin-gmaps','fa-map','Google Maps','505','Roboto Condensed, sans-serif','1','','',NULL),(49,'1','TV','admin-tv','fa-tv','TV','505','Roboto Condensed, sans-serif','1','','',NULL),(50,'10','Redes sociales','admin-ceredes','fa-network-wired','Redes sociales','505','Roboto Condensed, sans-serif','1','','',NULL),(51,'10','Preguntas frecuentes','admin-faqs','fa-question','FAQs','505','Roboto Condensed, sans-serif','1','','',NULL),(52,'10','Sitios web','admin-sitios-web','fa-bars','Sitio Web','505','Roboto Condensed, sans-serif','1','','',NULL);
/*!40000 ALTER TABLE `modulos` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-01-17  7:59:18
