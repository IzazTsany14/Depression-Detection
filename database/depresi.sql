-- Schema awal aplikasi Depression Detection untuk MySQL/MariaDB.
-- Jalankan file ini di phpMyAdmin atau MySQL CLI untuk membuat ulang database `depresi`.

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";
SET NAMES utf8mb4;

DROP DATABASE IF EXISTS `depresi`;
CREATE DATABASE `depresi` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `depresi`;

CREATE TABLE `accounts` (
  `account_id` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('student','admin','bk') NOT NULL,
  `profile_picture` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `last_login` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`account_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `admins` (
  `admin_id` varchar(50) NOT NULL,
  `account_id` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `department` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`admin_id`),
  KEY `account_id` (`account_id`),
  CONSTRAINT `admins_account_fk` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `bk_staff` (
  `bk_id` varchar(50) NOT NULL,
  `account_id` varchar(50) NOT NULL,
  `nip` varchar(20) DEFAULT NULL,
  `nidn` varchar(20) DEFAULT NULL,
  `nuptk` varchar(20) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `specialization` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`bk_id`),
  UNIQUE KEY `nip` (`nip`),
  UNIQUE KEY `nidn` (`nidn`),
  UNIQUE KEY `nuptk` (`nuptk`),
  KEY `account_id` (`account_id`),
  KEY `idx_bk_name` (`name`),
  CONSTRAINT `bk_staff_account_fk` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `students` (
  `student_id` varchar(50) NOT NULL,
  `account_id` varchar(50) NOT NULL,
  `nim` varchar(20) NOT NULL,
  `nik` varchar(20) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `faculty` varchar(100) DEFAULT NULL,
  `major` varchar(100) DEFAULT NULL,
  `semester` int(11) DEFAULT NULL,
  `phone_number` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`student_id`),
  UNIQUE KEY `nim` (`nim`),
  UNIQUE KEY `nik` (`nik`),
  KEY `account_id` (`account_id`),
  KEY `idx_student_name` (`name`),
  CONSTRAINT `students_account_fk` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `password_reset_tokens` (
  `token_id` varchar(50) NOT NULL,
  `account_id` varchar(50) NOT NULL,
  `token_hash` varchar(64) NOT NULL,
  `expires_at` datetime NOT NULL,
  `used_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`token_id`),
  UNIQUE KEY `token_hash` (`token_hash`),
  KEY `account_id` (`account_id`),
  CONSTRAINT `password_reset_tokens_account_fk` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `medical_records` (
  `record_id` varchar(50) NOT NULL,
  `student_id` varchar(50) NOT NULL,
  `bk_id` varchar(50) NOT NULL,
  `consultation_date` datetime NOT NULL,
  `complaint` text DEFAULT NULL,
  `diagnosis` text DEFAULT NULL,
  `recommendation` text DEFAULT NULL,
  `status` enum('open','closed','follow-up') DEFAULT 'open',
  PRIMARY KEY (`record_id`),
  KEY `student_id` (`student_id`),
  KEY `bk_id` (`bk_id`),
  CONSTRAINT `medical_records_student_fk` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE,
  CONSTRAINT `medical_records_bk_fk` FOREIGN KEY (`bk_id`) REFERENCES `bk_staff` (`bk_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `test_results` (
  `test_id` varchar(50) NOT NULL,
  `student_id` varchar(50) NOT NULL,
  `date` datetime NOT NULL,
  `score` int(11) NOT NULL,
  `level` varchar(50) NOT NULL,
  `fuzzy_score` decimal(5,4) NOT NULL,
  `answers` json NOT NULL,
  PRIMARY KEY (`test_id`),
  KEY `student_id` (`student_id`),
  KEY `idx_test_date` (`date`),
  KEY `idx_level` (`level`),
  CONSTRAINT `test_results_student_fk` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Password seed:
-- admin@universitas.ac.id / password: admin123
-- bk@universitas.ac.id / password: bk123456
-- akun mahasiswa seed bisa ditimpa melalui halaman registrasi berdasarkan NIM.

INSERT INTO `accounts` (`account_id`, `email`, `password`, `role`, `profile_picture`, `is_active`) VALUES
('admin-001', 'adminsistem@universitas.ac.id', '$2b$12$a0qBsvOL.zACOew44euil.d9mYYADuNnALK2YJYWNlbgOhg2njA9.', 'admin', NULL, 1),
('bk-001', 'budisantoso@universitas.ac.id', '$2b$12$GMTJGdzRoK5gP5HcJN8Iv.Y0w4n9PGJpc7aIVKAl2XjLvZIqL16g6', 'bk', NULL, 1),
('bk-002', 'sitinurhaliza@universitas.ac.id', '$2b$12$GMTJGdzRoK5gP5HcJN8Iv.Y0w4n9PGJpc7aIVKAl2XjLvZIqL16g6', 'bk', NULL, 1),
('student-001', 'ahmadfauzi01@mhs.universitas.ac.id', '$2b$12$nS6PnA6rADW5uJVcKtOiUe6MEoOiTI9EG0qXmWZ3Ch7whbdOaipHy', 'student', NULL, 1),
('student-002', 'sitirahmawati02@mhs.universitas.ac.id', '$2b$12$nS6PnA6rADW5uJVcKtOiUe6MEoOiTI9EG0qXmWZ3Ch7whbdOaipHy', 'student', NULL, 1),
('student-003', 'budihartono03@mhs.universitas.ac.id', '$2b$12$nS6PnA6rADW5uJVcKtOiUe6MEoOiTI9EG0qXmWZ3Ch7whbdOaipHy', 'student', NULL, 1),
('student-004', 'dewikusuma04@mhs.universitas.ac.id', '$2b$12$nS6PnA6rADW5uJVcKtOiUe6MEoOiTI9EG0qXmWZ3Ch7whbdOaipHy', 'student', NULL, 1),
('student-005', 'ekoprasetyo05@mhs.universitas.ac.id', '$2b$12$nS6PnA6rADW5uJVcKtOiUe6MEoOiTI9EG0qXmWZ3Ch7whbdOaipHy', 'student', NULL, 1);

INSERT INTO `admins` (`admin_id`, `account_id`, `name`, `department`) VALUES
('admin-001', 'admin-001', 'Dr. Admin Sistem', 'Kemahasiswaan');

INSERT INTO `bk_staff` (`bk_id`, `account_id`, `nip`, `nidn`, `nuptk`, `name`, `specialization`) VALUES
('bk-001', 'bk-001', NULL, NULL, NULL, 'Psikolog Budi Santoso, M.Psi', 'Konseling Mahasiswa'),
('bk-002', 'bk-002', NULL, NULL, NULL, 'Dr. Siti Nurhaliza, M.Psi', 'Psikologi Klinis');

INSERT INTO `students` (`student_id`, `account_id`, `nim`, `nik`, `name`, `faculty`, `major`, `semester`, `phone_number`) VALUES
('student-001', 'student-001', '2021110001', '3201051998123001', 'Ahmad Fauzi', 'Fakultas Ilmu Sosial dan Ilmu Politik (Fisipol)', 'Ilmu Administrasi', 6, NULL),
('student-002', 'student-002', '2021110002', '3206021999234002', 'Siti Rahmawati', 'Fakultas Ilmu Sosial dan Ilmu Politik (Fisipol)', 'Ilmu Komunikasi', 6, NULL),
('student-003', 'student-003', '2020110015', '3571021996345003', 'Budi Hartono', 'Fakultas Ilmu Sosial dan Ilmu Politik (Fisipol)', 'Ilmu Politik', 8, NULL),
('student-004', 'student-004', '2022110030', '3502031997456004', 'Dewi Kusuma', 'Fakultas Ekonomi dan Bisnis (FEB)', 'Akuntansi', 4, NULL),
('student-005', 'student-005', '2021110045', '3514121995567005', 'Eko Prasetyo', 'Fakultas Ekonomi dan Bisnis (FEB)', 'Manajemen', 6, NULL);

INSERT INTO `test_results` (`test_id`, `student_id`, `date`, `score`, `level`, `fuzzy_score`, `answers`) VALUES
('test-001-1', 'student-001', '2026-03-01 10:30:00', 54, 'Parah', 0.8500, JSON_ARRAY(3,3,2,3,2,3,2,3,3,2,3,2,3,2,3,2,3,2,3,2,3)),
('test-001-2', 'student-001', '2026-04-10 14:20:00', 42, 'Sedang', 0.6800, JSON_ARRAY(2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2)),
('test-002-1', 'student-002', '2026-04-05 13:30:00', 28, 'Ringan', 0.4500, JSON_ARRAY(1,2,1,1,2,1,2,1,1,2,1,2,1,1,2,1,1,2,1,1,2)),
('test-003-1', 'student-003', '2026-04-08 15:00:00', 11, 'Normal', 0.1800, JSON_ARRAY(1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1)),
('test-005-1', 'student-005', '2026-04-12 16:00:00', 63, 'Sangat Parah', 0.9500, JSON_ARRAY(3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3));
