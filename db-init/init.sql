-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS task_db;

-- Use the database
USE task_db;

-- Create tasks table
CREATE TABLE IF NOT EXISTS task (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci;
