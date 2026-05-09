-- =============================================
-- Hospital Management System - Microservices DBs
-- =============================================

-- 1. AUTH SERVICE
-- =============================================
CREATE DATABASE IF NOT EXISTS auth_db;
USE auth_db;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'DOCTOR', 'PATIENT', 'EMPLOYEE') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. DOCTOR SERVICE
-- =============================================
CREATE DATABASE IF NOT EXISTS doctor_db;
USE doctor_db;

CREATE TABLE IF NOT EXISTS doctors (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    experience_years INT DEFAULT 0,
    consultation_fee DECIMAL(10, 2) NOT NULL,
    is_approved BOOLEAN DEFAULT FALSE
);

-- 3. PATIENT SERVICE
-- =============================================
CREATE DATABASE IF NOT EXISTS patient_db;
USE patient_db;

CREATE TABLE IF NOT EXISTS patients (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    gender ENUM('MALE', 'FEMALE') NOT NULL,
    date_of_birth DATE,
    blood_group VARCHAR(5),
    address TEXT,
    medical_history TEXT,
    emergency_contact VARCHAR(20)
);

-- 4. APPOINTMENT SERVICE
-- =============================================
CREATE DATABASE IF NOT EXISTS appointment_db;
USE appointment_db;

CREATE TABLE IF NOT EXISTS appointments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    doctor_id BIGINT NOT NULL,
    app_date DATETIME NOT NULL,
    reason VARCHAR(255),
    status ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. BILLING SERVICE
-- =============================================
CREATE DATABASE IF NOT EXISTS billing_db;
USE billing_db;

CREATE TABLE IF NOT EXISTS invoices (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    appointment_id BIGINT NOT NULL,
    patient_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    tax DECIMAL(10, 2) DEFAULT 0.00,
    payment_method ENUM('CASH', 'CARD', 'INSURANCE') NOT NULL,
    payment_status ENUM('PAID', 'UNPAID', 'PARTIALLY_PAID') DEFAULT 'UNPAID',
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Use patient database
USE patient_db;

-- Option 1: Add individual columns to patients table (RECOMMENDED)
ALTER TABLE patients 
ADD COLUMN visit_date DATETIME AFTER medical_history,
ADD COLUMN diagnosis LONGTEXT AFTER visit_date,
ADD COLUMN treatment LONGTEXT AFTER diagnosis,
ADD COLUMN medications LONGTEXT AFTER treatment,
ADD COLUMN tests LONGTEXT AFTER medications,
ADD COLUMN notes LONGTEXT AFTER tests,
ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP AFTER notes,
ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at;

-- Create index for better performance
ALTER TABLE patients ADD INDEX idx_visit_date (visit_date);
ALTER TABLE patients ADD INDEX idx_created_at (created_at);