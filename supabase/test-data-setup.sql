-- SQL Script to Create Test Users for E2E Testing
-- Run this in Supabase SQL Editor
-- WARNING: Only run this in development/test environments!

-- Create test student
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin
)
VALUES (
  gen_random_uuid(),
  'student.test@zetoe.com',
  crypt('TestPassword123!', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Test Student"}',
  false
)
ON CONFLICT (email) DO NOTHING;

-- Create test admin
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin
)
VALUES (
  gen_random_uuid(),
  'admin.test@zetoe.com',
  crypt('AdminPassword123!', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"],"role":"admin"}',
  '{"full_name":"Test Admin","role":"admin"}',
  false
)
ON CONFLICT (email) DO NOTHING;

-- Create test super admin
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin
)
VALUES (
  gen_random_uuid(),
  'superadmin@zetoe.com',
  crypt('SuperAdminPassword123!', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"],"role":"super_admin"}',
  '{"full_name":"Super Admin","role":"super_admin"}',
  true
)
ON CONFLICT (email) DO NOTHING;

-- Create test course
INSERT INTO public.courses (
  id,
  title,
  description,
  price,
  duration,
  created_at,
  updated_at
)
VALUES (
  gen_random_uuid(),
  'E2E Test Course',
  'This is a test course for end-to-end testing',
  99.99,
  '30 days',
  NOW(),
  NOW()
)
ON CONFLICT DO NOTHING;

-- Create test exam
WITH course AS (
  SELECT id FROM public.courses WHERE title = 'E2E Test Course' LIMIT 1
)
INSERT INTO public.exams (
  id,
  course_id,
  title,
  description,
  duration_minutes,
  passing_score,
  exam_code,
  created_at,
  updated_at
)
SELECT
  gen_random_uuid(),
  course.id,
  'E2E Test Exam',
  'This is a test exam for end-to-end testing',
  60,
  70,
  'TEST123',
  NOW(),
  NOW()
FROM course
ON CONFLICT DO NOTHING;

-- Create test questions for the exam
WITH exam AS (
  SELECT id FROM public.exams WHERE exam_code = 'TEST123' LIMIT 1
)
INSERT INTO public.exam_questions (
  id,
  exam_id,
  question_text,
  question_type,
  options,
  correct_answer,
  points,
  created_at
)
SELECT
  gen_random_uuid(),
  exam.id,
  'What is 2 + 2?',
  'multiple_choice',
  jsonb_build_array(
    jsonb_build_object('text', '3', 'value', 'a'),
    jsonb_build_object('text', '4', 'value', 'b'),
    jsonb_build_object('text', '5', 'value', 'c'),
    jsonb_build_object('text', '6', 'value', 'd')
  ),
  'b',
  10,
  NOW()
FROM exam
UNION ALL
SELECT
  gen_random_uuid(),
  exam.id,
  'What is the capital of France?',
  'multiple_choice',
  jsonb_build_array(
    jsonb_build_object('text', 'London', 'value', 'a'),
    jsonb_build_object('text', 'Paris', 'value', 'b'),
    jsonb_build_object('text', 'Berlin', 'value', 'c'),
    jsonb_build_object('text', 'Madrid', 'value', 'd')
  ),
  'b',
  10,
  NOW()
FROM exam
UNION ALL
SELECT
  gen_random_uuid(),
  exam.id,
  'What is the largest planet in our solar system?',
  'multiple_choice',
  jsonb_build_array(
    jsonb_build_object('text', 'Earth', 'value', 'a'),
    jsonb_build_object('text', 'Mars', 'value', 'b'),
    jsonb_build_object('text', 'Jupiter', 'value', 'c'),
    jsonb_build_object('text', 'Saturn', 'value', 'd')
  ),
  'c',
  10,
  NOW()
FROM exam
ON CONFLICT DO NOTHING;

-- Grant necessary permissions (adjust based on your RLS policies)
-- This ensures test users can access the data

-- Verify test users were created
SELECT 
  email,
  email_confirmed_at IS NOT NULL as email_confirmed,
  raw_user_meta_data->>'role' as role,
  is_super_admin,
  created_at
FROM auth.users
WHERE email IN (
  'student.test@zetoe.com',
  'admin.test@zetoe.com',
  'superadmin@zetoe.com'
);

-- Verify test course and exam were created
SELECT 
  c.title as course_title,
  e.title as exam_title,
  e.exam_code,
  COUNT(q.id) as question_count
FROM public.courses c
LEFT JOIN public.exams e ON e.course_id = c.id
LEFT JOIN public.exam_questions q ON q.exam_id = e.id
WHERE c.title = 'E2E Test Course'
GROUP BY c.title, e.title, e.exam_code;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Test users and data created successfully!';
  RAISE NOTICE '📧 Student: student.test@zetoe.com / TestPassword123!';
  RAISE NOTICE '👨‍💼 Admin: admin.test@zetoe.com / AdminPassword123!';
  RAISE NOTICE '🔑 Super Admin: superadmin@zetoe.com / SuperAdminPassword123!';
  RAISE NOTICE '📚 Test course and exam with 3 questions created';
  RAISE NOTICE '🎯 Exam code: TEST123';
END $$;
