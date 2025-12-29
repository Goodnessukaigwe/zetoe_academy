-- ============================================
-- DATABASE OPTIMIZATION & PERFORMANCE IMPROVEMENTS
-- ============================================
-- This file contains additional indexes and optimizations
-- for the Zetoe Academy database
-- Run this in your Supabase SQL Editor after schema.sql

-- ============================================
-- 1. ENABLE TRIGRAM EXTENSION FIRST
-- ============================================
-- This must be enabled before creating GIN indexes with trigram operators
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ============================================
-- 2. ADDITIONAL INDEXES FOR PERFORMANCE
-- ============================================

-- Composite index for common student queries (user_id + payment_status)
CREATE INDEX IF NOT EXISTS idx_students_user_payment ON students(user_id, payment_status);

-- Index for payment status filtering (used in many dashboard queries)
CREATE INDEX IF NOT EXISTS idx_students_payment_status ON students(payment_status);

-- Composite index for scores queries (student + exam lookup)
CREATE INDEX IF NOT EXISTS idx_scores_student_exam ON scores(student_id, exam_id);

-- Index for scores by status (filtering passed/failed students)
CREATE INDEX IF NOT EXISTS idx_scores_status ON scores(status);

-- Index for payment queries by date range
CREATE INDEX IF NOT EXISTS idx_payments_paid_at ON payments(paid_at DESC);

-- Index for exam created_by (admin activity tracking)
CREATE INDEX IF NOT EXISTS idx_exams_created_by ON exams(created_by);

-- Composite index for certificates (code + active status for public verification)
CREATE INDEX IF NOT EXISTS idx_certificates_code_active ON certificates(certificate_code, is_active);

-- Index for certificates by course (for reporting)
CREATE INDEX IF NOT EXISTS idx_certificates_course_id ON certificates(course_id);

-- Index for certificates by issue date (for date range queries)
CREATE INDEX IF NOT EXISTS idx_certificates_issue_date ON certificates(issue_date DESC);

-- Index for students by name (for search functionality - requires pg_trgm extension)
CREATE INDEX IF NOT EXISTS idx_students_name_gin ON students USING gin(name gin_trgm_ops);

-- Index for admins by role (filtering super_admins)
CREATE INDEX IF NOT EXISTS idx_admins_role ON admins(role);

-- Composite index for common date-based queries
CREATE INDEX IF NOT EXISTS idx_students_created_at ON students(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_exams_created_at ON exams(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_scores_submitted_at ON scores(submitted_at DESC);

-- ============================================
-- 3. STATISTICS UPDATE
-- ============================================
-- Update table statistics for better query planning
ANALYZE students;
ANALYZE admins;
ANALYZE exams;
ANALYZE scores;
ANALYZE payments;
ANALYZE courses;
ANALYZE certificates;

-- ============================================
-- 4. VIEW FOR STUDENT DASHBOARD PERFORMANCE
-- ============================================
-- Materialized view for student dashboard stats (optional)
-- Uncomment if you need very fast dashboard loading
/*
CREATE MATERIALIZED VIEW IF NOT EXISTS student_stats AS
SELECT 
  s.id,
  s.name,
  s.email,
  s.payment_status,
  c.name as course_name,
  COUNT(DISTINCT sc.id) as total_exams_taken,
  AVG(sc.percentage) as average_score,
  MAX(sc.submitted_at) as last_exam_date
FROM students s
LEFT JOIN courses c ON s.course_id = c.id
LEFT JOIN scores sc ON s.id = sc.student_id
GROUP BY s.id, s.name, s.email, s.payment_status, c.name;

-- Create index on the materialized view
CREATE INDEX IF NOT EXISTS idx_student_stats_id ON student_stats(id);

-- Refresh the materialized view (run this periodically or via cron)
-- REFRESH MATERIALIZED VIEW student_stats;
*/

-- ============================================
-- 5. QUERY OPTIMIZATION FUNCTIONS
-- ============================================

-- Function to get student performance summary (optimized)
CREATE OR REPLACE FUNCTION get_student_performance(p_student_id UUID)
RETURNS TABLE (
  total_exams INTEGER,
  passed_exams INTEGER,
  failed_exams INTEGER,
  average_score DECIMAL,
  highest_score DECIMAL,
  lowest_score DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::INTEGER as total_exams,
    COUNT(CASE WHEN status = 'passed' THEN 1 END)::INTEGER as passed_exams,
    COUNT(CASE WHEN status = 'failed' THEN 1 END)::INTEGER as failed_exams,
    AVG(percentage)::DECIMAL as average_score,
    MAX(percentage)::DECIMAL as highest_score,
    MIN(percentage)::DECIMAL as lowest_score
  FROM scores
  WHERE student_id = p_student_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get course statistics (optimized)
CREATE OR REPLACE FUNCTION get_course_stats(p_course_id UUID)
RETURNS TABLE (
  total_students INTEGER,
  paid_students INTEGER,
  unpaid_students INTEGER,
  total_exams INTEGER,
  average_exam_score DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(DISTINCT s.id)::INTEGER as total_students,
    COUNT(DISTINCT CASE WHEN s.payment_status = 'paid' THEN s.id END)::INTEGER as paid_students,
    COUNT(DISTINCT CASE WHEN s.payment_status = 'unpaid' THEN s.id END)::INTEGER as unpaid_students,
    COUNT(DISTINCT e.id)::INTEGER as total_exams,
    COALESCE(AVG(sc.percentage), 0)::DECIMAL as average_exam_score
  FROM courses c
  LEFT JOIN students s ON s.course_id = c.id
  LEFT JOIN exams e ON e.course_id = c.id
  LEFT JOIN scores sc ON sc.exam_id = e.id
  WHERE c.id = p_course_id
  GROUP BY c.id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 6. VACUUM AND MAINTENANCE
-- ============================================
-- Run these periodically to maintain database performance
-- (These are informational - you should run them via Supabase dashboard or cron)

-- VACUUM ANALYZE students;
-- VACUUM ANALYZE scores;
-- VACUUM ANALYZE exams;
-- VACUUM ANALYZE payments;
-- VACUUM ANALYZE certificates;

-- ============================================
-- 7. MONITORING QUERIES
-- ============================================

-- Check index usage (run this to see which indexes are being used)
-- SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch
-- FROM pg_stat_user_indexes
-- WHERE schemaname = 'public'
-- ORDER BY idx_scan DESC;

-- Find slow queries (requires pg_stat_statements extension)
-- SELECT query, calls, total_time, mean_time, max_time
-- FROM pg_stat_statements
-- ORDER BY mean_time DESC
-- LIMIT 20;

-- Check table sizes
-- SELECT 
--   schemaname,
--   tablename,
--   pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
-- FROM pg_tables
-- WHERE schemaname = 'public'
-- ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- ============================================
-- 8. CLEANUP COMPLETED ✅
-- ============================================
-- All performance optimizations have been applied
-- Monitor query performance using the queries above
