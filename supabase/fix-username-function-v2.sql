-- ============================================
-- FIX: Improved username generation function
-- ============================================
-- Run this in your Supabase SQL Editor to replace the broken function

CREATE OR REPLACE FUNCTION generate_student_username()
RETURNS TEXT AS $$
DECLARE
  new_username TEXT;
  current_year TEXT;
  counter INTEGER;
  max_counter INTEGER;
  max_attempts INTEGER := 1000;
  attempt INTEGER := 0;
BEGIN
  current_year := TO_CHAR(NOW(), 'YYYY');
  
  -- Find the highest counter for this year
  SELECT COALESCE(MAX(
    CASE 
      WHEN username ~ ('^STU' || current_year || '[0-9]+$')
      THEN CAST(SUBSTRING(username FROM (LENGTH('STU' || current_year) + 1)) AS INTEGER)
      ELSE 0
    END
  ), 0) INTO max_counter
  FROM students
  WHERE username LIKE 'STU' || current_year || '%';
  
  -- Start from the next available number
  counter := max_counter + 1;
  
  LOOP
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

-- Test the function
SELECT generate_student_username();
