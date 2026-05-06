-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 06, 2026 at 04:25 AM
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
-- Database: `depresi`
--

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

CREATE TABLE `accounts` (
  `account_id` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('student','admin','bk') NOT NULL,
  `profile_picture` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `last_login` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `accounts`
--

INSERT INTO `accounts` (`account_id`, `email`, `password`, `role`, `profile_picture`, `is_active`, `last_login`, `created_at`) VALUES
('admin-001', 'adminsistem@universitas.ac.id', '$2b$12$a0qBsvOL.zACOew44euil.d9mYYADuNnALK2YJYWNlbgOhg2njA9.', 'admin', NULL, 1, NULL, '2026-05-06 02:24:22'),
('bk-001', 'budisantoso@universitas.ac.id', '$2b$12$GMTJGdzRoK5gP5HcJN8Iv.Y0w4n9PGJpc7aIVKAl2XjLvZIqL16g6', 'bk', NULL, 1, NULL, '2026-05-06 02:24:22'),
('bk-002', 'sitinurhaliza@universitas.ac.id', '$2b$12$GMTJGdzRoK5gP5HcJN8Iv.Y0w4n9PGJpc7aIVKAl2XjLvZIqL16g6', 'bk', NULL, 1, NULL, '2026-05-06 02:24:22'),
('student-001', 'ahmadfauzi01@mhs.universitas.ac.id', '$2b$12$nS6PnA6rADW5uJVcKtOiUe6MEoOiTI9EG0qXmWZ3Ch7whbdOaipHy', 'student', NULL, 1, NULL, '2026-05-06 02:24:22'),
('student-002', 'sitirahmawati02@mhs.universitas.ac.id', '$2b$12$nS6PnA6rADW5uJVcKtOiUe6MEoOiTI9EG0qXmWZ3Ch7whbdOaipHy', 'student', NULL, 1, NULL, '2026-05-06 02:24:22'),
('student-003', 'budihartono03@mhs.universitas.ac.id', '$2b$12$nS6PnA6rADW5uJVcKtOiUe6MEoOiTI9EG0qXmWZ3Ch7whbdOaipHy', 'student', NULL, 1, NULL, '2026-05-06 02:24:22'),
('student-004', 'dewikusuma04@mhs.universitas.ac.id', '$2b$12$nS6PnA6rADW5uJVcKtOiUe6MEoOiTI9EG0qXmWZ3Ch7whbdOaipHy', 'student', NULL, 1, NULL, '2026-05-06 02:24:22'),
('student-005', 'ekoprasetyo05@mhs.universitas.ac.id', '$2b$12$nS6PnA6rADW5uJVcKtOiUe6MEoOiTI9EG0qXmWZ3Ch7whbdOaipHy', 'student', NULL, 1, NULL, '2026-05-06 02:24:22'),
('student-006', 'ratnawijaya06@mhs.universitas.ac.id', '$2b$12$nS6PnA6rADW5uJVcKtOiUe6MEoOiTI9EG0qXmWZ3Ch7whbdOaipHy', 'student', NULL, 1, NULL, '2026-05-06 02:24:22'),
('student-007', 'hendragunawan07@mhs.universitas.ac.id', '$2b$12$nS6PnA6rADW5uJVcKtOiUe6MEoOiTI9EG0qXmWZ3Ch7whbdOaipHy', 'student', NULL, 1, NULL, '2026-05-06 02:24:22'),
('student-008', 'indahsulistyo08@mhs.universitas.ac.id', '$2b$12$nS6PnA6rADW5uJVcKtOiUe6MEoOiTI9EG0qXmWZ3Ch7whbdOaipHy', 'student', NULL, 1, NULL, '2026-05-06 02:24:22'),
('student-009', 'jokopambudi09@mhs.universitas.ac.id', '$2b$12$nS6PnA6rADW5uJVcKtOiUe6MEoOiTI9EG0qXmWZ3Ch7whbdOaipHy', 'student', NULL, 1, NULL, '2026-05-06 02:24:22'),
('student-010', 'kimberlytan10@mhs.universitas.ac.id', '$2b$12$nS6PnA6rADW5uJVcKtOiUe6MEoOiTI9EG0qXmWZ3Ch7whbdOaipHy', 'student', NULL, 1, NULL, '2026-05-06 02:24:22'),
('student-011', 'linamarlina11@mhs.universitas.ac.id', '$2b$12$nS6PnA6rADW5uJVcKtOiUe6MEoOiTI9EG0qXmWZ3Ch7whbdOaipHy', 'student', NULL, 1, NULL, '2026-05-06 02:24:22'),
('student-012', 'maulanarizki12@mhs.universitas.ac.id', '$2b$12$nS6PnA6rADW5uJVcKtOiUe6MEoOiTI9EG0qXmWZ3Ch7whbdOaipHy', 'student', NULL, 1, NULL, '2026-05-06 02:24:22'),
('student-013', 'nandapratama13@mhs.universitas.ac.id', '$2b$12$nS6PnA6rADW5uJVcKtOiUe6MEoOiTI9EG0qXmWZ3Ch7whbdOaipHy', 'student', NULL, 1, NULL, '2026-05-06 02:24:22'),
('student-014', 'oktapermana14@mhs.universitas.ac.id', '$2b$12$nS6PnA6rADW5uJVcKtOiUe6MEoOiTI9EG0qXmWZ3Ch7whbdOaipHy', 'student', NULL, 1, NULL, '2026-05-06 02:24:22'),
('student-015', 'priyasantoso15@mhs.universitas.ac.id', '$2b$12$nS6PnA6rADW5uJVcKtOiUe6MEoOiTI9EG0qXmWZ3Ch7whbdOaipHy', 'student', NULL, 1, NULL, '2026-05-06 02:24:22'),
('student-016', 'quentinridho16@mhs.universitas.ac.id', '$2b$12$nS6PnA6rADW5uJVcKtOiUe6MEoOiTI9EG0qXmWZ3Ch7whbdOaipHy', 'student', NULL, 1, NULL, '2026-05-06 02:24:22'),
('student-017', 'rinadwi17@mhs.universitas.ac.id', '$2b$12$nS6PnA6rADW5uJVcKtOiUe6MEoOiTI9EG0qXmWZ3Ch7whbdOaipHy', 'student', NULL, 1, NULL, '2026-05-06 02:24:22'),
('student-018', 'sintanurma18@mhs.universitas.ac.id', '$2b$12$nS6PnA6rADW5uJVcKtOiUe6MEoOiTI9EG0qXmWZ3Ch7whbdOaipHy', 'student', NULL, 1, NULL, '2026-05-06 02:24:22'),
('student-019', 'tonisuryanto19@mhs.universitas.ac.id', '$2b$12$nS6PnA6rADW5uJVcKtOiUe6MEoOiTI9EG0qXmWZ3Ch7whbdOaipHy', 'student', NULL, 1, NULL, '2026-05-06 02:24:22'),
('student-020', 'camekmulyono34@mhs.universitas.ac.id', '$2b$12$nS6PnA6rADW5uJVcKtOiUe6MEoOiTI9EG0qXmWZ3Ch7whbdOaipHy', 'student', NULL, 1, NULL, '2026-05-06 02:24:22');

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `admin_id` varchar(50) NOT NULL,
  `account_id` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `department` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`admin_id`, `account_id`, `name`, `department`) VALUES
('admin-001', 'admin-001', 'Dr. Admin Sistem', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `bk_staff`
--

CREATE TABLE `bk_staff` (
  `bk_id` varchar(50) NOT NULL,
  `account_id` varchar(50) NOT NULL,
  `nip` varchar(20) DEFAULT NULL,
  `nidn` varchar(20) DEFAULT NULL,
  `nuptk` varchar(20) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `specialization` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bk_staff`
--

INSERT INTO `bk_staff` (`bk_id`, `account_id`, `nip`, `nidn`, `nuptk`, `name`, `specialization`) VALUES
('bk-001', 'bk-001', NULL, NULL, NULL, 'Psikolog Budi Santoso, M.Psi', NULL),
('bk-002', 'bk-002', NULL, NULL, NULL, 'Dr. Siti Nurhaliza, M.Psi', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `medical_records`
--

CREATE TABLE `medical_records` (
  `record_id` varchar(50) NOT NULL,
  `student_id` varchar(50) NOT NULL,
  `bk_id` varchar(50) NOT NULL,
  `consultation_date` datetime NOT NULL,
  `complaint` text DEFAULT NULL,
  `diagnosis` text DEFAULT NULL,
  `recommendation` text DEFAULT NULL,
  `status` enum('open','closed','follow-up') DEFAULT 'open'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `student_id` varchar(50) NOT NULL,
  `account_id` varchar(50) NOT NULL,
  `nim` varchar(20) NOT NULL,
  `nik` varchar(20) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `faculty` varchar(100) DEFAULT NULL,
  `major` varchar(100) DEFAULT NULL,
  `semester` int(11) DEFAULT NULL,
  `phone_number` varchar(15) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`student_id`, `account_id`, `nim`, `nik`, `name`, `faculty`, `major`, `semester`, `phone_number`) VALUES
('student-001', 'student-001', '2021110001', '3201051998123001', 'Ahmad Fauzi', 'Fakultas Ilmu Sosial dan Ilmu Politik (Fisipol)', 'Ilmu Administrasi', 6, NULL),
('student-002', 'student-002', '2021110002', '3206021999234002', 'Siti Rahmawati', 'Fakultas Ilmu Sosial dan Ilmu Politik (Fisipol)', 'Ilmu Komunikasi', 6, NULL),
('student-003', 'student-003', '2020110015', '3571021996345003', 'Budi Hartono', 'Fakultas Ilmu Sosial dan Ilmu Politik (Fisipol)', 'Ilmu Politik', 8, NULL),
('student-004', 'student-004', '2022110030', '3502031997456004', 'Dewi Kusuma', 'Fakultas Ekonomi dan Bisnis (FEB)', 'Akuntansi', 4, NULL),
('student-005', 'student-005', '2021110045', '3514121995567005', 'Eko Prasetyo', 'Fakultas Ekonomi dan Bisnis (FEB)', 'Manajemen', 6, NULL),
('student-006', 'student-006', '2021110046', '3301011997123456', 'Ratna Wijaya', 'Fakultas Ekonomi dan Bisnis (FEB)', 'Ekonomi Pembangunan', 5, NULL),
('student-007', 'student-007', '2021110050', '3406021996234567', 'Hendra Gunawan', 'Fakultas Teknik (FT)', 'Teknik Informatika', 6, NULL),
('student-008', 'student-008', '2021110051', '3502121997345678', 'Indah Sulistyo', 'Fakultas Teknik (FT)', 'Teknik Elektro', 6, NULL),
('student-009', 'student-009', '2020110060', '3211231996456789', 'Joko Pambudi', 'Fakultas Teknik (FT)', 'Teknik Sipil', 8, NULL),
('student-010', 'student-010', '2022110070', '3601121997567890', 'Kimberly Tan', 'Fakultas Teknik (FT)', 'Teknik Mesin', 4, NULL),
('student-011', 'student-011', '2021110080', '3701051998678901', 'Lina Marlina', 'Fakultas Vokasi (FV)', 'D3 Perhotelan', 5, NULL),
('student-012', 'student-012', '2021110081', '3302061998789012', 'Maulana Rizki', 'Fakultas Vokasi (FV)', 'D3 Pariwisata', 5, NULL),
('student-013', 'student-013', '2021110090', '3401121997890123', 'Nanda Pratama', 'Fakultas Hukum (FH)', 'Ilmu Hukum', 6, NULL),
('student-014', 'student-014', '2020110100', '3502181996901234', 'Okta Permana', 'Fakultas Hukum (FH)', 'Ilmu Hukum', 8, NULL),
('student-015', 'student-015', '2021110110', '3301051998012345', 'Priya Santoso', 'Fakultas Matematika dan Ilmu Pengetahuan Alam (FMIPA)', 'Matematika', 6, NULL),
('student-016', 'student-016', '2021110111', '3401101997123456', 'Quentin Ridho', 'Fakultas Matematika dan Ilmu Pengetahuan Alam (FMIPA)', 'Fisika', 6, NULL),
('student-017', 'student-017', '2021110112', '3502111996234567', 'Rina Dwi', 'Fakultas Matematika dan Ilmu Pengetahuan Alam (FMIPA)', 'Kimia', 6, NULL),
('student-018', 'student-018', '2022110120', '3601201997345678', 'Sinta Nurma', 'Fakultas Matematika dan Ilmu Pengetahuan Alam (FMIPA)', 'Biologi', 4, NULL),
('student-019', 'student-019', '2021110130', NULL, 'Toni Suryanto', 'Fakultas PSDKU', 'Manajemen', 6, NULL),
('student-020', 'student-020', '2022110140', '3503151998567890', 'Camek Mulyono', 'Fakultas PSDKU', 'Pendidikan Tata Rias', 4, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `test_results`
--

CREATE TABLE `test_results` (
  `test_id` varchar(50) NOT NULL,
  `student_id` varchar(50) NOT NULL,
  `date` datetime NOT NULL,
  `score` int(11) NOT NULL,
  `level` varchar(50) NOT NULL,
  `fuzzy_score` decimal(5,4) NOT NULL,
  `answers` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`answers`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `test_results`
--

INSERT INTO `test_results` (`test_id`, `student_id`, `date`, `score`, `level`, `fuzzy_score`, `answers`) VALUES
('test-001-1', 'student-001', '2026-03-01 10:30:00', 54, 'Berat', 0.8500, '[3,3,2,3,2,3,2,3,3,2,3,2,3,2,3,2,3,2,3,2,3]'),
('test-001-2', 'student-001', '2026-04-01 09:15:00', 51, 'Berat', 0.8200, '[3,2,3,2,3,2,3,2,2,3,2,3,2,3,2,2,3,2,3,2,2]'),
('test-001-3', 'student-001', '2026-04-10 14:20:00', 42, 'Sedang', 0.6800, '[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]'),
('test-002-1', 'student-002', '2026-03-15 11:00:00', 32, 'Sedang', 0.5500, '[2,2,1,2,1,2,1,2,2,1,2,1,2,1,2,1,2,1,2,1,2]'),
('test-002-2', 'student-002', '2026-04-05 13:30:00', 28, 'Ringan', 0.4500, '[1,2,1,1,2,1,2,1,1,2,1,2,1,1,2,1,1,2,1,1,2]'),
('test-003-1', 'student-003', '2026-03-20 10:00:00', 10, 'Normal', 0.1500, '[0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0]'),
('test-003-2', 'student-003', '2026-04-08 15:00:00', 11, 'Normal', 0.1800, '[1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1]'),
('test-004-1', 'student-004', '2026-03-25 09:30:00', 21, 'Ringan', 0.3500, '[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]'),
('test-005-1', 'student-005', '2026-04-12 16:00:00', 63, 'Sangat Berat', 0.9500, '[3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3]'),
('test-006-1', 'student-006', '2026-04-02 14:00:00', 52, 'Berat', 0.8000, '[3,2,3,2,2,3,2,3,3,2,3,2,2,3,2,3,2,3,2,3,2]'),
('test-007-1', 'student-007', '2026-03-28 11:30:00', 31, 'Sedang', 0.5200, '[2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2]'),
('test-008-1', 'student-008', '2026-04-03 10:15:00', 9, 'Normal', 0.1200, '[0,0,0,1,0,1,0,1,0,0,1,0,1,0,1,0,0,1,0,1,0]'),
('test-009-1', 'student-009', '2026-03-30 13:45:00', 19, 'Ringan', 0.3200, '[1,1,0,1,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1]'),
('test-010-1', 'student-010', '2026-04-06 09:00:00', 8, 'Normal', 0.1000, '[0,1,0,0,1,0,0,1,0,1,0,0,1,0,1,0,1,0,0,1,0]'),
('test-011-1', 'student-011', '2026-04-01 15:20:00', 33, 'Sedang', 0.5800, '[2,2,1,2,1,2,2,1,2,1,2,1,2,2,1,2,1,2,1,2,1]'),
('test-012-1', 'student-012', '2026-03-31 12:00:00', 17, 'Ringan', 0.2800, '[1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,0,1,1,0,1,0]'),
('test-013-1', 'student-013', '2026-04-04 11:15:00', 56, 'Berat', 0.8300, '[3,3,2,3,3,2,3,2,3,3,2,3,2,3,3,2,3,2,3,2,3]'),
('test-014-1', 'student-014', '2026-03-22 14:30:00', 10, 'Normal', 0.1400, '[0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0]'),
('test-015-1', 'student-015', '2026-04-07 10:45:00', 20, 'Ringan', 0.3300, '[1,1,1,0,1,1,0,1,1,1,0,1,0,1,1,0,1,0,1,1,0]'),
('test-016-1', 'student-016', '2026-03-26 13:00:00', 9, 'Normal', 0.1300, '[0,0,1,0,1,0,1,0,1,0,1,0,0,1,0,1,0,1,0,0,1]'),
('test-017-1', 'student-017', '2026-04-09 11:45:00', 35, 'Sedang', 0.6000, '[2,1,2,2,1,2,1,2,2,1,2,2,1,2,1,2,2,1,2,1,2]'),
('test-018-1', 'student-018', '2026-04-11 09:30:00', 8, 'Normal', 0.1100, '[0,1,0,0,1,0,1,0,0,1,0,1,0,0,1,0,1,0,1,0,0]'),
('test-019-1', 'student-019', '2026-03-29 14:15:00', 18, 'Ringan', 0.3000, '[1,1,0,1,1,0,1,1,0,1,0,1,1,0,1,1,0,1,0,1,1]'),
('test-020-1', 'student-020', '2026-04-13 15:45:00', 10, 'Normal', 0.1500, '[0,0,1,0,1,0,1,0,1,0,0,1,0,1,0,1,0,0,1,0,1]');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`account_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`admin_id`),
  ADD KEY `account_id` (`account_id`);

--
-- Indexes for table `bk_staff`
--
ALTER TABLE `bk_staff`
  ADD PRIMARY KEY (`bk_id`),
  ADD UNIQUE KEY `nip` (`nip`),
  ADD UNIQUE KEY `nidn` (`nidn`),
  ADD UNIQUE KEY `nuptk` (`nuptk`),
  ADD KEY `account_id` (`account_id`),
  ADD KEY `idx_bk_name` (`name`);

--
-- Indexes for table `medical_records`
--
ALTER TABLE `medical_records`
  ADD PRIMARY KEY (`record_id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `bk_id` (`bk_id`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`student_id`),
  ADD UNIQUE KEY `nim` (`nim`),
  ADD UNIQUE KEY `nik` (`nik`),
  ADD KEY `account_id` (`account_id`),
  ADD KEY `idx_nim` (`nim`),
  ADD KEY `idx_student_name` (`name`);

--
-- Indexes for table `test_results`
--
ALTER TABLE `test_results`
  ADD PRIMARY KEY (`test_id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `idx_test_date` (`date`),
  ADD KEY `idx_level` (`level`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `admins`
--
ALTER TABLE `admins`
  ADD CONSTRAINT `admins_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`) ON DELETE CASCADE;

--
-- Constraints for table `bk_staff`
--
ALTER TABLE `bk_staff`
  ADD CONSTRAINT `bk_staff_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`) ON DELETE CASCADE;

--
-- Constraints for table `medical_records`
--
ALTER TABLE `medical_records`
  ADD CONSTRAINT `medical_records_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `medical_records_ibfk_2` FOREIGN KEY (`bk_id`) REFERENCES `bk_staff` (`bk_id`) ON DELETE CASCADE;

--
-- Constraints for table `students`
--
ALTER TABLE `students`
  ADD CONSTRAINT `students_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`) ON DELETE CASCADE;

--
-- Constraints for table `test_results`
--
ALTER TABLE `test_results`
  ADD CONSTRAINT `test_results_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
