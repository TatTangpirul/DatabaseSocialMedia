-- Add unique constraint to nickname column
USE social_media_db;

ALTER TABLE users ADD UNIQUE INDEX idx_nickname (nickname);
