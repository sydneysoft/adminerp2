-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 19-01-2023 a las 07:27:48
-- Versión del servidor: 10.4.24-MariaDB
-- Versión de PHP: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `inkalandia`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `blog_categoriable`
--

DROP TABLE IF EXISTS `blog_categoriable`;
CREATE TABLE `blog_categoriable` (
  `id` int(11) UNSIGNED NOT NULL,
  `categoria_id` int(11) UNSIGNED NOT NULL,
  `pagina_id` int(11) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `blog_categorias`
--

DROP TABLE IF EXISTS `blog_categorias`;
CREATE TABLE `blog_categorias` (
  `id` int(11) UNSIGNED NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `empresa_id` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `blog_paginas`
--

DROP TABLE IF EXISTS `blog_paginas`;
CREATE TABLE `blog_paginas` (
  `id` int(11) UNSIGNED NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `subtitulo` varchar(255) DEFAULT NULL,
  `estracto` tinytext DEFAULT NULL,
  `body` longtext DEFAULT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `estado` enum('publish','draft','delete','pending','nuevo') NOT NULL DEFAULT 'nuevo',
  `empresa_id` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `blog_categoriable`
--
ALTER TABLE `blog_categoriable`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `blog_categorias`
--
ALTER TABLE `blog_categorias`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `blog_paginas`
--
ALTER TABLE `blog_paginas`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `blog_categoriable`
--
ALTER TABLE `blog_categoriable`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `blog_categorias`
--
ALTER TABLE `blog_categorias`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `blog_paginas`
--
ALTER TABLE `blog_paginas`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
