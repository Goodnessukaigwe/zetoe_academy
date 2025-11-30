-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================
-- Run this AFTER running schema.sql

-- ============================================
-- COURSES POLICIES (Public Read)
-- ============================================
CREATE POLICY "Anyone can view courses"
  ON courses FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert courses"
  ON courses FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Only admins can update courses"
  ON courses FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Only super admins can delete courses"
  ON courses FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE user_id = auth.uid() AND role = 'super_admin'
    )
  );

-- ============================================
-- STUDENTS POLICIES
-- ============================================
-- Students can view their own data
CREATE POLICY "Students can view own data"
  ON students FOR SELECT
  USING (user_id = auth.uid());

-- Admins can view all students
CREATE POLICY "Admins can view all students"
  ON students FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE user_id = auth.uid()
    )
  );

-- Students can update their own data
CREATE POLICY "Students can update own data"
  ON students FOR UPDATE
  USING (user_id = auth.uid());

-- Admins can insert students
CREATE POLICY "Admins can insert students"
  ON students FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins
      WHERE user_id = auth.uid()
    )
  );

-- Admins can update any student
CREATE POLICY "Admins can update students"
  ON students FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE user_id = auth.uid()
    )
  );

-- Only super admins can delete students
CREATE POLICY "Super admins can delete students"
  ON students FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE user_id = auth.uid() AND role = 'super_admin'
    )
  );

-- ============================================
-- ADMINS POLICIES (Fixed - No Recursion)
-- ============================================
-- Admins can only view their own record
CREATE POLICY "Admins can view own record"
  ON admins FOR SELECT
  USING (user_id = auth.uid());

-- Allow viewing pending invites (when user_id is null)
CREATE POLICY "Allow viewing pending invites"
  ON admins FOR SELECT
  USING (user_id IS NULL);

-- Super admins can insert admins
CREATE POLICY "Super admins can insert admins"
  ON admins FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins
      WHERE user_id = auth.uid() 
      AND role = 'super_admin'
      LIMIT 1
    )
  );

-- Super admins can update admins
CREATE POLICY "Super admins can update admins"
  ON admins FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE user_id = auth.uid() 
      AND role = 'super_admin'
      LIMIT 1
    )
  );

-- Super admins can delete admins
CREATE POLICY "Super admins can delete admins"
  ON admins FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE user_id = auth.uid() 
      AND role = 'super_admin'
      LIMIT 1
    )
  );

-- ============================================
-- EXAMS POLICIES
-- ============================================
-- Students enrolled in the course can view exams
CREATE POLICY "Students can view course exams"
  ON exams FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM students
      WHERE user_id = auth.uid() AND course_id = exams.course_id
    )
  );

-- Admins can view all exams
CREATE POLICY "Admins can view all exams"
  ON exams FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE user_id = auth.uid()
    )
  );

-- Admins can create exams
CREATE POLICY "Admins can create exams"
  ON exams FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins
      WHERE user_id = auth.uid()
    )
  );

-- Admins can update exams
CREATE POLICY "Admins can update exams"
  ON exams FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE user_id = auth.uid()
    )
  );

-- Only super admins can delete exams
CREATE POLICY "Super admins can delete exams"
  ON exams FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE user_id = auth.uid() AND role = 'super_admin'
    )
  );

-- ============================================
-- SCORES POLICIES
-- ============================================
-- Students can view their own scores
CREATE POLICY "Students can view own scores"
  ON scores FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM students
      WHERE user_id = auth.uid() AND id = scores.student_id
    )
  );

-- Admins can view all scores
CREATE POLICY "Admins can view all scores"
  ON scores FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE user_id = auth.uid()
    )
  );

-- Students can insert their own scores (when submitting exam)
CREATE POLICY "Students can insert own scores"
  ON scores FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM students
      WHERE user_id = auth.uid() AND id = scores.student_id
    )
  );

-- Admins can insert scores
CREATE POLICY "Admins can insert scores"
  ON scores FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins
      WHERE user_id = auth.uid()
    )
  );

-- ============================================
-- PAYMENTS POLICIES (Manual Management by Admins)
-- ============================================
-- Students can view their own payments
CREATE POLICY "Students can view own payments"
  ON payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM students
      WHERE user_id = auth.uid() AND id = payments.student_id
    )
  );

-- Admins can view all payments
CREATE POLICY "Admins can view all payments"
  ON payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE user_id = auth.uid()
    )
  );

-- Only admins can create payment records
CREATE POLICY "Admins can create payments"
  ON payments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins
      WHERE user_id = auth.uid()
    )
  );

-- Admins can update payments
CREATE POLICY "Admins can update payments"
  ON payments FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE user_id = auth.uid()
    )
  );

-- Only super admins can delete payments
CREATE POLICY "Super admins can delete payments"
  ON payments FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE user_id = auth.uid() AND role = 'super_admin'
    )
  );
