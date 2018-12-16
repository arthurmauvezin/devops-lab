-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Nov 19, 2018 at 04:50 PM
-- Server version: 5.7.24-0ubuntu0.18.04.1
-- PHP Version: 7.2.10-0ubuntu0.18.04.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: project
--

-- --------------------------------------------------------

--
-- Table structure for table animals
--

CREATE TABLE animals (
  id int(11) NOT NULL,
  name varchar(255) NOT NULL,
  breed varchar(255) NOT NULL,
  food_per_day int(11) NOT NULL,
  birthday date NOT NULL,
  entry_date date NOT NULL,
  id_cage int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table cages
--

CREATE TABLE cages (
  id int(11) NOT NULL,
  name varchar(255) NOT NULL,
  description text NOT NULL,
  area int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table food
--

CREATE TABLE food (
  id int(11) NOT NULL,
  name varchar(255) NOT NULL,
  quantity int(11) NOT NULL,
  id_animal int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table staff
--

CREATE TABLE staff (
  id int(11) NOT NULL,
  firstname varchar(255) NOT NULL,
  lastname varchar(255) NOT NULL,
  wage int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table users
--

CREATE TABLE users (
  id int(11) NOT NULL,
  username varchar(255) NOT NULL,
  apikey varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `apikey`) VALUES
(1, 'robot', 'ceciestmonjeton');

--
-- Indexes for dumped tables
--

--
-- Indexes for table animals
--
ALTER TABLE animals
  ADD PRIMARY KEY (id);

--
-- Indexes for table cages
--
ALTER TABLE cages
  ADD PRIMARY KEY (id);

--
-- Indexes for table food
--
ALTER TABLE food
  ADD PRIMARY KEY (id);

--
-- Indexes for table staff
--
ALTER TABLE staff
  ADD PRIMARY KEY (id);

--
-- Indexes for table users
--
ALTER TABLE users
  ADD PRIMARY KEY (id);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table animals
--
ALTER TABLE animals
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table cages
--
ALTER TABLE cages
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table food
--
ALTER TABLE food
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table staff
--
ALTER TABLE staff
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table users
--
ALTER TABLE users
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
