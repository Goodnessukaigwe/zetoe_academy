-- ============================================
-- FIX: Create username generation function
-- ============================================
-- Run this in your Supabase SQL Editor to fix the student creation error

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

-- Test the function (optional)
-- SELECT generate_student_username();
