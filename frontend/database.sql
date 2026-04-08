-- Create database
CREATE DATABASE IF NOT EXISTS social_media_db;
USE social_media_db;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  account VARCHAR(50) NOT NULL UNIQUE,
  pin_hash VARCHAR(255) NOT NULL,
  nickname VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
