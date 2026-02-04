-- ============================================
-- ADD USERNAME COLUMN TO STUDENTS TABLE
-- ============================================
-- This adds a username column to store student login credentials

-- Add username column to students table
ALTER TABLE students
ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;

-- Add index for faster username lookups
CREATE INDEX IF NOT EXISTS idx_students_username ON students(username);

-- Update existing students with generated usernames (optional)
-- Uncomment if you want to generate usernames for existing students
-- UPDATE students 
-- SET username = LOWER(REGEXP_REPLACE(name, '[^a-zA-Z0-9]', '', 'g')) || FLOOR(RANDOM() * 1000)::TEXT
-- WHERE username IS NULL;

-- ============================================
-- VERIFICATION
-- ============================================
-- Check the updated schema
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'students'
ORDER BY ordinal_position;

-- View students with usernames
SELECT id, name, username, email, course_id
FROM students
ORDER BY created_at DESC;
