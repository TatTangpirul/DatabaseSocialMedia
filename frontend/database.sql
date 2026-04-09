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

-- --- NEW MODIFICATION START ---
-- Create posts table (Stores the Image URLs and Content)
CREATE TABLE IF NOT EXISTS posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  content TEXT,
  image_url VARCHAR(255), -- The link to the image
  likes_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Add a test user and a test post so you can see the visualization immediately
INSERT INTO users (account, pin_hash, nickname) VALUES ('tianxing_hku', 'hash123', 'Tianxing');

INSERT INTO posts (user_id, content, image_url, likes_count) 
VALUES (1, 'Testing the HKUgram feed visualization!', 'https://images.unsplash.com/photo-1519389950473-47ba0277781c', 16);
-- --- NEW MODIFICATION END ---