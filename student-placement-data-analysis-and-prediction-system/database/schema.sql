-- ====================================================================
-- Project: Student Placement Data Analysis and Prediction System
-- Database: placement_analysis
-- Author: BTech Placement Intelligence Engineering Cell
-- Engine: MySQL 8.0+ / MariaDB 10.5+
-- ====================================================================

CREATE DATABASE IF NOT EXISTS `placement_analysis`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `placement_analysis`;

-- 1. Table: users (Authentication & RBAC)
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(120) NOT NULL,
  `email` VARCHAR(160) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('Placement Officer', 'Dean / Administrator', 'Department Faculty') NOT NULL DEFAULT 'Placement Officer',
  `department` VARCHAR(80) DEFAULT NULL,
  `college_name` VARCHAR(180) NOT NULL DEFAULT 'National Institute of Technology & Engineering',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Table: academic_years
DROP TABLE IF EXISTS `academic_years`;
CREATE TABLE `academic_years` (
  `year` INT PRIMARY KEY,
  `total_enrolled` INT NOT NULL DEFAULT 0,
  `placed_count` INT NOT NULL DEFAULT 0,
  `placement_rate` DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  `avg_package_lpa` DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  `highest_package_lpa` DECIMAL(5,2) NOT NULL DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Table: companies (Recruiter Registry)
DROP TABLE IF EXISTS `companies`;
CREATE TABLE `companies` (
  `id` VARCHAR(32) PRIMARY KEY,
  `name` VARCHAR(120) NOT NULL UNIQUE,
  `tier` ENUM('Super Dream (> 15 LPA)', 'Dream (8-15 LPA)', 'Regular (< 8 LPA)') NOT NULL,
  `industry` VARCHAR(100) NOT NULL,
  `avg_package_lpa` DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  `highest_package_lpa` DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  `recruited_count` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Table: students
DROP TABLE IF EXISTS `students`;
CREATE TABLE `students` (
  `id` VARCHAR(32) PRIMARY KEY,
  `name` VARCHAR(120) NOT NULL,
  `email` VARCHAR(160) NOT NULL UNIQUE,
  `gender` ENUM('Male', 'Female', 'Other') NOT NULL DEFAULT 'Male',
  `department` VARCHAR(80) NOT NULL,
  `cgpa` DECIMAL(4,2) NOT NULL,
  `backlogs` INT NOT NULL DEFAULT 0,
  `aptitude_score` INT NOT NULL,
  `technical_score` INT NOT NULL,
  `communication_score` INT NOT NULL,
  `technical_skills` TEXT NOT NULL,
  `internship_months` INT NOT NULL DEFAULT 0,
  `placement_status` ENUM('Placed', 'Not Placed', 'In Process') NOT NULL DEFAULT 'Not Placed',
  `company_name` VARCHAR(120) DEFAULT NULL,
  `package_lpa` DECIMAL(5,2) DEFAULT NULL,
  `graduation_year` INT NOT NULL,
  `placed_date` DATE DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_students_dept` (`department`),
  INDEX `idx_students_status` (`placement_status`),
  INDEX `idx_students_cgpa` (`cgpa`),
  INDEX `idx_students_year` (`graduation_year`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Table: placements (Detailed Offer Audit Trail)
DROP TABLE IF EXISTS `placements`;
CREATE TABLE `placements` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_id` VARCHAR(32) NOT NULL,
  `company_id` VARCHAR(32) DEFAULT NULL,
  `company_name` VARCHAR(120) NOT NULL,
  `package_lpa` DECIMAL(5,2) NOT NULL,
  `offer_date` DATE NOT NULL,
  `designation` VARCHAR(100) DEFAULT 'Graduate Engineer Trainee',
  `status` ENUM('Accepted', 'Pending Verification', 'Declined') DEFAULT 'Accepted',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE CASCADE,
  INDEX `idx_placements_company` (`company_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
