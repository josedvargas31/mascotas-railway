-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 01-09-2024 a las 03:20:31
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `adopcion_mascotas`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `adopciones`
--

CREATE TABLE `adopciones` (
  `id_adopcion` int(11) NOT NULL,
  `fk_id_mascota` int(11) DEFAULT NULL,
  `fk_id_usuario_adoptante` int(11) NOT NULL,
  `fecha_adopcion_proceso` date DEFAULT NULL,
  `fecha_adopcion_aceptada` date DEFAULT NULL,
  `estado` enum('aceptada','rechazada','proceso de adopcion') DEFAULT NULL,
  `estado_anterior` enum('En Adopcion','Urgente') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `adopciones`
--

INSERT INTO `adopciones` (`id_adopcion`, `fk_id_mascota`, `fk_id_usuario_adoptante`, `fecha_adopcion_proceso`, `fecha_adopcion_aceptada`, `estado`, `estado_anterior`) VALUES
(51, 7, 5, '2024-08-31', '2024-08-31', 'aceptada', 'En Adopcion'),
(54, 13, 5, '2024-08-31', NULL, 'proceso de adopcion', 'Urgente');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `id_categoria` int(11) NOT NULL,
  `nombre_categoria` varchar(50) NOT NULL,
  `estado` enum('activa','inactiva') NOT NULL DEFAULT 'activa'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`id_categoria`, `nombre_categoria`, `estado`) VALUES
(4, 'esteban full', 'activa');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `departamentos`
--

CREATE TABLE `departamentos` (
  `id_departamento` int(11) NOT NULL,
  `nombre_departamento` varchar(50) NOT NULL,
  `codigo_dane` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `departamentos`
--

INSERT INTO `departamentos` (`id_departamento`, `nombre_departamento`, `codigo_dane`) VALUES
(1, 'Huilaq', '12345'),
(3, 'Bogota', '1234501'),
(4, 'qweqsd', '123'),
(7, 'wadascas', '23124322');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `imagenes`
--

CREATE TABLE `imagenes` (
  `id_imagen` int(11) NOT NULL,
  `fk_id_mascota` int(11) NOT NULL,
  `ruta_imagen` varchar(255) NOT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `imagenes`
--

INSERT INTO `imagenes` (`id_imagen`, `fk_id_mascota`, `ruta_imagen`, `fecha_registro`) VALUES
(87, 7, 'imagenes-1724985519642-178738400.jpg', '2024-08-30 02:38:39'),
(88, 7, 'imagenes-1724985519644-916967833.jpg', '2024-08-30 02:38:39'),
(89, 7, 'imagenes-1724985519651-590040244.png', '2024-08-30 02:38:39'),
(90, 7, 'imagenes-1724985519653-190022385.png', '2024-08-30 02:38:39'),
(91, 12, 'imagenes-1724985752832-562450668.jpg', '2024-08-30 02:42:32'),
(92, 12, 'imagenes-1724985752834-66846134.jpg', '2024-08-30 02:42:32'),
(93, 12, 'imagenes-1724985752837-261804207.png', '2024-08-30 02:42:32'),
(94, 12, 'imagenes-1724985752837-400331760.png', '2024-08-30 02:42:32'),
(95, 13, 'imagenes-1724985761177-227396980.jpg', '2024-08-30 02:42:41'),
(96, 13, 'imagenes-1724985761180-87317263.jpg', '2024-08-30 02:42:41'),
(97, 14, 'imagenes-1724985767126-315329133.jpg', '2024-08-30 02:42:47'),
(98, 14, 'imagenes-1724985767129-59169565.jpg', '2024-08-30 02:42:47'),
(99, 14, 'imagenes-1724985767132-291414032.png', '2024-08-30 02:42:47'),
(100, 15, 'imagenes-1724985772578-166364722.jpg', '2024-08-30 02:42:52');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mascotas`
--

CREATE TABLE `mascotas` (
  `id_mascota` int(11) NOT NULL,
  `nombre_mascota` varchar(50) NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `estado` enum('En Adopcion','Urgente','Adoptado','Reservado') NOT NULL DEFAULT 'En Adopcion',
  `descripcion` varchar(300) DEFAULT NULL,
  `esterilizado` enum('si','no') NOT NULL,
  `tamano` enum('Pequeno','Mediano','Intermedio','Grande') NOT NULL,
  `peso` decimal(5,2) NOT NULL,
  `fk_id_categoria` int(11) DEFAULT NULL,
  `fk_id_raza` int(11) DEFAULT NULL,
  `fk_id_departamento` int(11) DEFAULT NULL,
  `fk_id_municipio` int(11) DEFAULT NULL,
  `sexo` enum('Macho','Hembra') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `mascotas`
--

INSERT INTO `mascotas` (`id_mascota`, `nombre_mascota`, `fecha_nacimiento`, `estado`, `descripcion`, `esterilizado`, `tamano`, `peso`, `fk_id_categoria`, `fk_id_raza`, `fk_id_departamento`, `fk_id_municipio`, `sexo`) VALUES
(7, 'pepe', '2222-11-12', 'Adoptado', 'lulu feliz', 'si', 'Pequeno', 4.00, 4, 3, 1, 1, 'Macho'),
(12, 'mascota con  cuatro imagenes', '2024-03-22', 'En Adopcion', 'Mascota registarda desde el backend con imagen, y si funciona', 'si', 'Mediano', 3.00, 4, 3, 1, 1, 'Hembra'),
(13, 'mascota con  cuatro imagenes', '2024-03-22', 'Reservado', 'Mascota registarda desde el backend con imagen, y si funciona', 'si', 'Mediano', 3.00, 4, 3, 1, 1, 'Hembra'),
(14, 'mascota con  cuatro imagenes', '2024-03-22', 'Urgente', 'Mascota registarda desde el backend con imagen, y si funciona', 'si', 'Mediano', 3.00, 4, 3, 1, 1, 'Hembra'),
(15, 'mascota con  cuatro imagenes', '2024-03-22', 'Urgente', 'Mascota registarda desde el backend con imagen, y si funciona', 'si', 'Mediano', 3.00, 4, 3, 1, 1, 'Hembra');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `municipios`
--

CREATE TABLE `municipios` (
  `id_municipio` int(11) NOT NULL,
  `nombre_municipio` varchar(50) NOT NULL,
  `codigo_dane` varchar(10) NOT NULL,
  `fk_id_departamento` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `municipios`
--

INSERT INTO `municipios` (`id_municipio`, `nombre_municipio`, `codigo_dane`, `fk_id_departamento`) VALUES
(1, 'Isnosq', '5432101', 1),
(3, 'Pitalito', '123450', 1),
(4, 'Mocoa', '122542', 1),
(5, 'qwe', '123123', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notificaciones`
--

CREATE TABLE `notificaciones` (
  `id_notificacion` int(11) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `mensaje` text DEFAULT NULL,
  `leido` tinyint(1) DEFAULT 0,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  `estado` enum('aceptada','rechazada','proceso de adopcion','pendiente') DEFAULT 'pendiente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `notificaciones`
--

INSERT INTO `notificaciones` (`id_notificacion`, `id_usuario`, `mensaje`, `leido`, `fecha`, `estado`) VALUES
(2, 7, 'El usuario 9 ha solicitado cambiar su rol de usuario a undefined', 0, '2024-08-24 18:57:36', ''),
(5, 9, 'El Super Usuario Jose ha aceptado tu solicitud de cambio de rol. Para continuar con el cambio de rol, debes comunicarte al WhatsApp 3188690317 de Jose para confirmar el cambio.', 0, '2024-08-24 20:32:58', 'pendiente');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `razas`
--

CREATE TABLE `razas` (
  `id_raza` int(11) NOT NULL,
  `nombre_raza` varchar(50) NOT NULL,
  `fk_id_categoria` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `razas`
--

INSERT INTO `razas` (`id_raza`, `nombre_raza`, `fk_id_categoria`) VALUES
(3, 'raza web actualizada', 4),
(4, 'nueva', 4),
(5, 'qwe', 4),
(9, 'dario full', 4),
(10, 'qweloco', 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `direccion` varchar(100) NOT NULL,
  `telefono` varchar(15) NOT NULL,
  `correo` varchar(50) NOT NULL,
  `tipo_documento` enum('tarjeta','cedula','tarjeta de extranjeria') NOT NULL,
  `documento_identidad` varchar(20) NOT NULL,
  `password` varchar(200) NOT NULL,
  `img` varchar(255) DEFAULT NULL,
  `rol` enum('superusuario','administrador','usuario') NOT NULL DEFAULT 'usuario'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `nombre`, `apellido`, `direccion`, `telefono`, `correo`, `tipo_documento`, `documento_identidad`, `password`, `img`, `rol`) VALUES
(5, 'Dario', 'Zamora', 'loco', '3158716879', 'dajo59416@gmail.com', 'cedula', '55065264', '$2b$10$eKsLg1yJd2QLuRomNG8PrOF7QLXFv1L7qoTjjp7oif8WqJ5g.879K', 'img-1723496583726-780509290.png', 'usuario'),
(7, 'Jose', 'Vargas', 'loco', '3188690317', 'dajozavargas@gmail.com', 'cedula', '1077848366', '$2b$10$rvI0wYQLni8k4qZC6DCJ2emaQhcNk8fIsBtW8dgUGpKjk7RfdvAT2', 'img-1724804730945-519039254.jpeg', 'superusuario'),
(8, 'qwe', 'qwe', 'locoq', '1231', 'qwe@gmail.com', 'cedula', '123123', '$2b$10$CfnIn.Z.LlH3cV9kd1Fh1eYnMgHyho/aqKNnlSRNUQSH1L54eCvRO', 'img-1724116616335-283913486.png', 'administrador'),
(9, 'zorro lololololo', 'zorro', 'loco', '124675846356345', 'zorro@gmail.com', 'tarjeta de extranjeria', '23465678674', '$2b$10$HlLlBPkg7IdbgpGHw0FmfeLSpGjo4Twi6OlsxAeJX5Kv2/ptQ10.W', 'img-1723513152450-8202856.jpeg', 'usuario'),
(10, 'lolo', 'loloq', 'lolo@gmail.com', '12353648456', 'lolo@gmail.com', 'cedula', '1341489713', '$2b$10$eVKK0f7TMD4HtqHB7EcAX.gT/p87gEVcwDS/zoLvPUBNQ3fChIXNu', 'img-1723687878413-330559835.png', 'usuario'),
(11, 'qwe', 'qwe', 'qwe', '213234364564', 'jose@gmail.com', 'tarjeta', '2342353523', '$2b$10$mF./B2PwzkKI6QD5P5GMce55KyMcwW9/X0kdOZqR5vXiuybWQ8VDu', 'img-1724113918049-554800424.jpeg', 'usuario'),
(12, ' asd asd', 'qwe', ' dvdvv sdvw ', '213123123', 'da@gmail.com', 'cedula', '1231231243', '$2b$10$tsk6gvgMSm4YQjKtWsngueOju/MKfnrt/vViFvIF.5riaosUihu3C', 'img-1725147425412-617538646.png', 'usuario');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vacunas`
--

CREATE TABLE `vacunas` (
  `id_vacuna` int(11) NOT NULL,
  `fk_id_mascota` int(11) DEFAULT NULL,
  `fecha_vacuna` date NOT NULL,
  `enfermedad` varchar(100) NOT NULL,
  `estado` enum('Completa','Incompleta','En proceso','no se') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `vacunas`
--

INSERT INTO `vacunas` (`id_vacuna`, `fk_id_mascota`, `fecha_vacuna`, `enfermedad`, `estado`) VALUES
(4, 7, '2024-08-08', 'loco', 'Completa');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `adopciones`
--
ALTER TABLE `adopciones`
  ADD PRIMARY KEY (`id_adopcion`),
  ADD KEY `fk_id_mascota` (`fk_id_mascota`),
  ADD KEY `fk_id_usuario_adoptante` (`fk_id_usuario_adoptante`);

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id_categoria`);

--
-- Indices de la tabla `departamentos`
--
ALTER TABLE `departamentos`
  ADD PRIMARY KEY (`id_departamento`),
  ADD UNIQUE KEY `codigo_dane` (`codigo_dane`);

--
-- Indices de la tabla `imagenes`
--
ALTER TABLE `imagenes`
  ADD PRIMARY KEY (`id_imagen`),
  ADD KEY `fk_id_mascota` (`fk_id_mascota`);

--
-- Indices de la tabla `mascotas`
--
ALTER TABLE `mascotas`
  ADD PRIMARY KEY (`id_mascota`),
  ADD KEY `fk_id_categoria` (`fk_id_categoria`),
  ADD KEY `fk_id_raza` (`fk_id_raza`),
  ADD KEY `fk_id_departamento` (`fk_id_departamento`),
  ADD KEY `fk_id_municipio` (`fk_id_municipio`);

--
-- Indices de la tabla `municipios`
--
ALTER TABLE `municipios`
  ADD PRIMARY KEY (`id_municipio`),
  ADD UNIQUE KEY `codigo_dane` (`codigo_dane`),
  ADD KEY `fk_id_departamento` (`fk_id_departamento`);

--
-- Indices de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD PRIMARY KEY (`id_notificacion`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `razas`
--
ALTER TABLE `razas`
  ADD PRIMARY KEY (`id_raza`),
  ADD KEY `fk_id_categoria` (`fk_id_categoria`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `correo` (`correo`),
  ADD UNIQUE KEY `documento_identidad` (`documento_identidad`);

--
-- Indices de la tabla `vacunas`
--
ALTER TABLE `vacunas`
  ADD PRIMARY KEY (`id_vacuna`),
  ADD KEY `fk_id_mascota` (`fk_id_mascota`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `adopciones`
--
ALTER TABLE `adopciones`
  MODIFY `id_adopcion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id_categoria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `departamentos`
--
ALTER TABLE `departamentos`
  MODIFY `id_departamento` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `imagenes`
--
ALTER TABLE `imagenes`
  MODIFY `id_imagen` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=101;

--
-- AUTO_INCREMENT de la tabla `mascotas`
--
ALTER TABLE `mascotas`
  MODIFY `id_mascota` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `municipios`
--
ALTER TABLE `municipios`
  MODIFY `id_municipio` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  MODIFY `id_notificacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `razas`
--
ALTER TABLE `razas`
  MODIFY `id_raza` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `vacunas`
--
ALTER TABLE `vacunas`
  MODIFY `id_vacuna` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `adopciones`
--
ALTER TABLE `adopciones`
  ADD CONSTRAINT `adopciones_ibfk_1` FOREIGN KEY (`fk_id_mascota`) REFERENCES `mascotas` (`id_mascota`) ON DELETE CASCADE,
  ADD CONSTRAINT `adopciones_ibfk_2` FOREIGN KEY (`fk_id_usuario_adoptante`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `imagenes`
--
ALTER TABLE `imagenes`
  ADD CONSTRAINT `imagenes_ibfk_1` FOREIGN KEY (`fk_id_mascota`) REFERENCES `mascotas` (`id_mascota`) ON DELETE CASCADE;

--
-- Filtros para la tabla `mascotas`
--
ALTER TABLE `mascotas`
  ADD CONSTRAINT `mascotas_ibfk_1` FOREIGN KEY (`fk_id_categoria`) REFERENCES `categorias` (`id_categoria`) ON DELETE CASCADE,
  ADD CONSTRAINT `mascotas_ibfk_2` FOREIGN KEY (`fk_id_raza`) REFERENCES `razas` (`id_raza`) ON DELETE CASCADE,
  ADD CONSTRAINT `mascotas_ibfk_3` FOREIGN KEY (`fk_id_departamento`) REFERENCES `departamentos` (`id_departamento`) ON DELETE CASCADE,
  ADD CONSTRAINT `mascotas_ibfk_4` FOREIGN KEY (`fk_id_municipio`) REFERENCES `municipios` (`id_municipio`) ON DELETE CASCADE;

--
-- Filtros para la tabla `municipios`
--
ALTER TABLE `municipios`
  ADD CONSTRAINT `municipios_ibfk_1` FOREIGN KEY (`fk_id_departamento`) REFERENCES `departamentos` (`id_departamento`) ON DELETE CASCADE;

--
-- Filtros para la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD CONSTRAINT `notificaciones_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `razas`
--
ALTER TABLE `razas`
  ADD CONSTRAINT `razas_ibfk_1` FOREIGN KEY (`fk_id_categoria`) REFERENCES `categorias` (`id_categoria`) ON DELETE CASCADE;

--
-- Filtros para la tabla `vacunas`
--
ALTER TABLE `vacunas`
  ADD CONSTRAINT `vacunas_ibfk_1` FOREIGN KEY (`fk_id_mascota`) REFERENCES `mascotas` (`id_mascota`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
