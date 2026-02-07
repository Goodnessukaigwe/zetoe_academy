-- ============================================
-- MIGRATION: USERNAME-BASED AUTHENTICATION
-- ============================================
-- This migration adds username support and removes email as unique identifier
-- Run this SQL in your Supabase SQL Editor after backing up your database

-- ============================================
-- 1. ADD USERNAME COLUMN TO STUDENTS TABLE
-- ============================================
ALTER TABLE students ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;

-- ============================================
-- 2. REMOVE UNIQUE CONSTRAINT FROM EMAIL
-- ============================================
-- Drop the existing unique constraint on email
ALTER TABLE students DROP CONSTRAINT IF EXISTS students_email_key;

-- Recreate email column index without unique constraint
DROP INDEX IF EXISTS idx_students_email;
CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);

-- ============================================
-- 3. ADD USERNAME INDEX FOR FAST LOOKUPS
-- ============================================
CREATE INDEX IF NOT EXISTS idx_students_username ON students(username);

-- ============================================
-- 4. CREATE USERNAME GENERATION FUNCTION
-- ============================================
-- This function generates unique usernames in format: STU2026001, STU2026002, etc.
CREATE OR REPLACE FUNCTION generate_student_username()
RETURNS TEXT AS $$
DECLARE
  new_username TEXT;
  current_year TEXT;
  counter INTEGER;
  max_attempts INTEGER := 100;
  attempt INTEGER := 0;
BEGIN
  current_year := TO_CHAR(NOW(), 'YYYY');
  
  LOOP
    -- Get the count of students created this year
    SELECT COUNT(*) + 1 INTO counter
    FROM students
    WHERE username LIKE 'STU' || current_year || '%';
    
    -- Generate username: STU + YEAR + 3-digit counter
    new_username := 'STU' || current_year || LPAD(counter::TEXT, 3, '0');
    
    -- Check if username already exists
    IF NOT EXISTS (SELECT 1 FROM students WHERE username = new_username) THEN
      RETURN new_username;
    END IF;
    
    -- Increment counter and try again
    counter := counter + 1;
    attempt := attempt + 1;
    
    -- Prevent infinite loop
    IF attempt >= max_attempts THEN
      RAISE EXCEPTION 'Failed to generate unique username after % attempts', max_attempts;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 5. MIGRATE EXISTING STUDENTS (ADD USERNAMES)
-- ============================================
-- Generate usernames for existing students who don't have one
DO $$
DECLARE
  student_record RECORD;
  new_username TEXT;
BEGIN
  FOR student_record IN 
    SELECT id FROM students WHERE username IS NULL
  LOOP
    new_username := generate_student_username();
    UPDATE students SET username = new_username WHERE id = student_record.id;
  END LOOP;
END $$;

-- ============================================
-- 6. MAKE USERNAME NOT NULL (AFTER MIGRATION)
-- ============================================
-- Now that all existing students have usernames, make it required
ALTER TABLE students ALTER COLUMN username SET NOT NULL;

-- ============================================
-- 7. ADD TRIGGER TO AUTO-GENERATE USERNAME
-- ============================================
-- This trigger automatically generates a username for new students if not provided
CREATE OR REPLACE FUNCTION auto_generate_username()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.username IS NULL THEN
    NEW.username := generate_student_username();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists, then recreate
DROP TRIGGER IF EXISTS trigger_auto_generate_username ON students;

CREATE TRIGGER trigger_auto_generate_username
  BEFORE INSERT ON students
  FOR EACH ROW
  EXECUTE FUNCTION auto_generate_username();

-- ============================================
-- 8. VERIFICATION QUERIES
-- ============================================
-- Run these to verify the migration was successful

-- Check if all students have usernames
-- SELECT COUNT(*) as total_students, 
--        COUNT(username) as students_with_username 
-- FROM students;

-- View sample of generated usernames
-- SELECT id, name, email, username, created_at 
-- FROM students 
-- ORDER BY created_at DESC 
-- LIMIT 10;

-- Test username generation
-- SELECT generate_student_username();

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
-- Next steps:
-- 1. Update application code to use username for authentication
-- 2. Update student creation forms to display generated username
-- 3. Inform existing students of their new usernames
-- 4. Update login page to accept username instead of email
