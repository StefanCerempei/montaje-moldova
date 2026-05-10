-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 10, 2026 at 12:24 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `montaj_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `comenzi`
--

CREATE TABLE `comenzi` (
  `id` int(11) NOT NULL,
  `client_id` int(11) NOT NULL,
  `montator_id` int(11) DEFAULT NULL,
  `locatie` varchar(255) NOT NULL,
  `oras` varchar(100) NOT NULL,
  `suprafata` decimal(10,2) DEFAULT NULL,
  `btu` varchar(20) DEFAULT NULL,
  `bloc` varchar(50) DEFAULT NULL,
  `interfon` varchar(100) DEFAULT NULL,
  `etaj` varchar(10) DEFAULT NULL,
  `data_preferata` date DEFAULT NULL,
  `ora_preferata` varchar(20) DEFAULT NULL,
  `instructiuni` text DEFAULT NULL,
  `nume_client` varchar(100) DEFAULT NULL,
  `telefon_client` varchar(20) DEFAULT NULL,
  `status` enum('asteapta','asignata','finalizata') DEFAULT 'asteapta',
  `confirmat_montator` enum('neconfirmat','confirmat','respins') DEFAULT 'neconfirmat',
  `data_confirmare` timestamp NULL DEFAULT NULL,
  `motiv_respingere` text DEFAULT NULL,
  `semnatura` text DEFAULT NULL,
  `data_creare` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `comenzi`
--

INSERT INTO `comenzi` (`id`, `client_id`, `montator_id`, `locatie`, `oras`, `suprafata`, `btu`, `bloc`, `interfon`, `etaj`, `data_preferata`, `ora_preferata`, `instructiuni`, `nume_client`, `telefon_client`, `status`, `confirmat_montator`, `data_confirmare`, `motiv_respingere`, `semnatura`, `data_creare`) VALUES
(1, 1, 4, 'gheorghe madan 50', 'Chisinau', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'CEREMPEI  Ștefan', '+40 775 167 663', 'finalizata', 'neconfirmat', NULL, NULL, 'CEREMPEI  Ștefan, 4/30/2026', '2026-04-30 14:30:56'),
(2, 1, 4, 'florarii 4', 'chisinau', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'CEREMPEI  Ștefan', '+40 775 167 663', 'finalizata', 'neconfirmat', NULL, NULL, 'CEREMPEI  Ștefan, 4/30/2026', '2026-04-30 14:36:48'),
(3, 1, 5, 'Timisoara', 'Timisoara', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'CEREMPEI  Ștefan', '+40 775 167 663', 'finalizata', 'neconfirmat', NULL, NULL, 'CEREMPEI  Ștefan, 4/30/2026', '2026-04-30 14:42:00'),
(4, 1, 4, 'Gheorghe Madan 50/2', 'Chișinău', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'CEREMPEI  Ștefan', '+40 775 167 663', 'finalizata', 'neconfirmat', NULL, NULL, 'CEREMPEI  Ștefan, 30.04.2026', '2026-04-30 15:59:33'),
(5, 1, 4, 'Rapitei', 'Chișinău', 10.00, '9.000 BTU', '2', '6', '3', '2028-10-01', '11:00 - 13:00', NULL, 'CEREMPEI  Ștefan', '+40 775 167 663', 'asignata', 'neconfirmat', NULL, NULL, NULL, '2026-04-30 19:06:30'),
(6, 1, 5, 'test', 'Bălți', 0.00, '9.000 BTU', '2', '2', '2', '2026-05-22', '09:00 - 11:00', '2', 'CEREMPEI  Ștefan', '+40 775 167 663', 'asignata', 'confirmat', '2026-05-05 13:54:17', NULL, NULL, '2026-05-05 13:49:48'),
(7, 1, 5, 'test', 'Soroca', 1.00, '9.000 BTU', '1', '1', '1', '2026-05-22', '13:00 - 15:00', '11', 'CEREMPEI  Ștefan', '+40 775 167 663', 'asignata', 'confirmat', '2026-05-05 13:56:32', NULL, NULL, '2026-05-05 13:55:19'),
(8, 1, 4, 'test', 'Ungheni', 22.00, '18.000 BTU', '1', '1', '1', '2026-05-22', '15:00 - 17:00', '111', 'CEREMPEI  Ștefan', '+40 775 167 663', 'asignata', 'confirmat', '2026-05-05 17:58:01', NULL, NULL, '2026-05-05 17:57:08');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `type` enum('client','montator') NOT NULL,
  `nume` varchar(50) NOT NULL,
  `prenume` varchar(50) NOT NULL,
  `telefon` varchar(15) NOT NULL,
  `email` varchar(100) NOT NULL,
  `parola` varchar(255) NOT NULL,
  `adresa` text DEFAULT NULL,
  `idnp` varchar(13) DEFAULT NULL,
  `salariu_total` decimal(10,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `type`, `nume`, `prenume`, `telefon`, `email`, `parola`, `adresa`, `idnp`, `salariu_total`) VALUES
(1, 'client', 'CEREMPEI ', 'Ștefan', '+40 775 167 663', 'stefancerempei06@gmail.com', '$2a$10$qOUyyvBenUxm3JPKgiUgMOrkJqNNsE/pmljO0UosH/hdLTHKqzKzC', 'Chisinau', NULL, 0.00),
(4, 'montator', 'CEREMPEI ', 'ION', '000 000 000', 'test@gmail.com', '$2a$10$hRZOnnxCD8OBpywwCNXY1uol3jbeJpMulGX9bR05CtJEOdMR0YldG', NULL, '1234567890123', 5400.00),
(5, 'montator', 'Anrei', 'Dodon', '111111111', 'dodon@gmail.com', '$2a$10$2Y7A7XvTqWBVpehxhgBkJuWd0cXCWCsx0EHy41xEPZtKhWHUbC5ci', NULL, '1234567890123', 1200.00);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `comenzi`
--
ALTER TABLE `comenzi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `client_id` (`client_id`),
  ADD KEY `montator_id` (`montator_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `comenzi`
--
ALTER TABLE `comenzi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `comenzi`
--
ALTER TABLE `comenzi`
  ADD CONSTRAINT `comenzi_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `comenzi_ibfk_2` FOREIGN KEY (`montator_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
