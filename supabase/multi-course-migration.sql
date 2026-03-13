/*
  Multi-Course Registration System Migration
  
  This migration transforms the system from one-to-one (student-to-course)
  to many-to-many relationship with per-course payment tracking.
  
  BREAKING CHANGES:
  - Creates student_courses junction table
  - Adds course_id to payments table
  - Migrates existing student enrollments
  - Preserves existing payment data
  
  Run this migration during a maintenance window.
  Test thoroughly on staging before production.
*/

-- ============================================
-- STEP 1: Create Junction Table
-- ============================================

CREATE TABLE IF NOT EXISTS student_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('paid', 'unpaid', 'partial')),
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, course_id)
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_student_courses_student_id ON student_courses(student_id);
CREATE INDEX IF NOT EXISTS idx_student_courses_course_id ON student_courses(course_id);
CREATE INDEX IF NOT EXISTS idx_student_courses_payment_status ON student_courses(payment_status);

-- Add comment for documentation
COMMENT ON TABLE student_courses IS 'Junction table tracking student course enrollments with per-course payment status';

-- ============================================
-- STEP 2: Migrate Existing Enrollments
-- ============================================

-- Move existing student-course relationships to junction table
INSERT INTO student_courses (student_id, course_id, payment_status, enrolled_at)
SELECT 
  id as student_id, 
  course_id, 
  payment_status,
  created_at as enrolled_at
FROM students 
WHERE course_id IS NOT NULL
ON CONFLICT (student_id, course_id) DO NOTHING;

-- Log migration results
DO $$
DECLARE
  migrated_count INT;
BEGIN
  SELECT COUNT(*) INTO migrated_count FROM student_courses;
  RAISE NOTICE 'Migrated % student enrollments to student_courses table', migrated_count;
END $$;

-- ============================================
-- STEP 3: Update Payments Table
-- ============================================

-- Add course_id column to payments table
ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS course_id UUID REFERENCES courses(id) ON DELETE SET NULL;

-- Add index for payments by course
CREATE INDEX IF NOT EXISTS idx_payments_course_id ON payments(course_id);

-- For existing payments, try to link to student's enrolled course
-- This is best-effort - manual review may be needed for students with multiple courses
UPDATE payments p
SET course_id = (
  SELECT course_id 
  FROM students s 
  WHERE s.id = p.student_id 
  AND s.course_id IS NOT NULL
)
WHERE p.course_id IS NULL;

-- ============================================
-- STEP 4: Row Level Security (RLS) Policies
-- ============================================

-- Enable RLS on student_courses table
ALTER TABLE student_courses ENABLE ROW LEVEL SECURITY;

-- Students can view their own enrollments
CREATE POLICY "Students can view their own enrollments"
  ON student_courses
  FOR SELECT
  USING (
    student_id IN (
      SELECT id FROM students WHERE user_id = auth.uid()
    )
  );

-- Admins can view all enrollments
CREATE POLICY "Admins can view all enrollments"
  ON student_courses
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admins WHERE user_id = auth.uid()
    )
  );

-- Admins can insert enrollments
CREATE POLICY "Admins can insert enrollments"
  ON student_courses
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins WHERE user_id = auth.uid()
    )
  );

-- Admins can update enrollments (including payment status)
CREATE POLICY "Admins can update enrollments"
  ON student_courses
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admins WHERE user_id = auth.uid()
    )
  );

-- Admins can delete enrollments
CREATE POLICY "Admins can delete enrollments"
  ON student_courses
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM admins WHERE user_id = auth.uid()
    )
  );

-- Students can enroll themselves in courses (self-registration)
CREATE POLICY "Students can enroll themselves"
  ON student_courses
  FOR INSERT
  WITH CHECK (
    student_id IN (
      SELECT id FROM students WHERE user_id = auth.uid()
    )
  );

-- ============================================
-- STEP 5: Create Helper Functions
-- ============================================

-- Function to get student's enrolled courses with payment status
CREATE OR REPLACE FUNCTION get_student_enrollments(p_student_id UUID)
RETURNS TABLE (
  enrollment_id UUID,
  course_id UUID,
  course_name TEXT,
  course_description TEXT,
  payment_status TEXT,
  enrolled_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sc.id as enrollment_id,
    c.id as course_id,
    c.name as course_name,
    c.description as course_description,
    sc.payment_status,
    sc.enrolled_at
  FROM student_courses sc
  JOIN courses c ON sc.course_id = c.id
  WHERE sc.student_id = p_student_id
  ORDER BY sc.enrolled_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if student has paid for a specific course
CREATE OR REPLACE FUNCTION has_course_access(p_student_id UUID, p_course_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_payment_status TEXT;
BEGIN
  SELECT payment_status INTO v_payment_status
  FROM student_courses
  WHERE student_id = p_student_id 
    AND course_id = p_course_id;
  
  RETURN v_payment_status = 'paid';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update enrollment payment status
CREATE OR REPLACE FUNCTION update_enrollment_payment(
  p_student_id UUID, 
  p_course_id UUID, 
  p_payment_status TEXT
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE student_courses
  SET 
    payment_status = p_payment_status,
    updated_at = NOW()
  WHERE student_id = p_student_id 
    AND course_id = p_course_id;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- STEP 6: Create Triggers
-- ============================================

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_student_courses_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER student_courses_updated_at
  BEFORE UPDATE ON student_courses
  FOR EACH ROW
  EXECUTE FUNCTION update_student_courses_timestamp();

-- ============================================
-- STEP 7: Verification Queries
-- ============================================

-- Run these after migration to verify data integrity

-- Check total enrollments
-- SELECT COUNT(*) as total_enrollments FROM student_courses;

-- Check enrollments per student
-- SELECT student_id, COUNT(*) as course_count 
-- FROM student_courses 
-- GROUP BY student_id 
-- ORDER BY course_count DESC;

-- Check payment status distribution
-- SELECT payment_status, COUNT(*) as count 
-- FROM student_courses 
-- GROUP BY payment_status;

-- Find students with multiple courses
-- SELECT s.name, s.email, COUNT(sc.id) as course_count
-- FROM students s
-- JOIN student_courses sc ON s.id = sc.student_id
-- GROUP BY s.id, s.name, s.email
-- HAVING COUNT(sc.id) > 1;

-- Find payments without course linkage
-- SELECT COUNT(*) as unlinked_payments 
-- FROM payments 
-- WHERE course_id IS NULL;

-- ============================================
-- NOTES FOR FUTURE CLEANUP
-- ============================================

/*
  After verifying the migration works correctly and all applications
  are updated to use the new schema, consider:
  
  1. Remove students.course_id column:
     ALTER TABLE students DROP COLUMN IF EXISTS course_id;
  
  2. Remove students.payment_status column:
     ALTER TABLE students DROP COLUMN IF EXISTS payment_status;
  
  DO NOT run these until:
  - All APIs are updated to use student_courses table
  - All frontend components are updated
  - Thorough testing is completed
  - At least 1-2 weeks of production usage without issues
*/
