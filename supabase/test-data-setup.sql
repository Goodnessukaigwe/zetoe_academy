-- SQL Script to Create Test Users for E2E Testing
-- Run this in Supabase SQL Editor
-- WARNING: Only run this in development/test environments!

-- Note: For Supabase, it's recommended to create users through the Dashboard or Auth API
-- This script provides SQL for reference, but you should use Supabase Auth API for production

-- Delete existing test users if they exist (optional - comment out if you want to keep them)
-- DELETE FROM auth.users WHERE email IN ('student.test@zetoe.com', 'admin.test@zetoe.com', 'superadmin@zetoe.com');

-- Create test student
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'student.test@zetoe.com') THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      recovery_sent_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    )
    VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'student.test@zetoe.com',
      crypt('TestPassword123!', gen_salt('bf')),
      NOW(),
      NOW(),
      NOW(),
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Test Student"}',
      NOW(),
      NOW(),
      '',
      '',
      '',
      ''
    );
  END IF;
END $$;

-- Create test admin
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin.test@zetoe.com') THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      recovery_sent_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    )
    VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'admin.test@zetoe.com',
      crypt('AdminPassword123!', gen_salt('bf')),
      NOW(),
      NOW(),
      NOW(),
      '{"provider":"email","providers":["email"],"role":"admin"}',
      '{"full_name":"Test Admin","role":"admin"}',
      NOW(),
      NOW(),
      '',
      '',
      '',
      ''
    );
  END IF;
END $$;

-- Create test super admin
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'superadmin@zetoe.com') THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      recovery_sent_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token,
      is_super_admin
    )
    VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'superadmin@zetoe.com',
      crypt('SuperAdminPassword123!', gen_salt('bf')),
      NOW(),
      NOW(),
      NOW(),
      '{"provider":"email","providers":["email"],"role":"super_admin"}',
      '{"full_name":"Super Admin","role":"super_admin"}',
      NOW(),
      NOW(),
      '',
      '',
      '',
      '',
      true
    );
  END IF;
END $$;

-- Create test course
INSERT INTO public.courses (
  id,
  name,
  description,
  price,
  duration,
  created_at,
  updated_at
)
SELECT
  gen_random_uuid(),
  'E2E Test Course',
  'This is a test course for end-to-end testing',
  99.99,
  '30 days',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM public.courses WHERE name = 'E2E Test Course'
);

-- Create test exam
WITH course AS (
  SELECT id FROM public.courses WHERE name = 'E2E Test Course' LIMIT 1
)
INSERT INTO public.exams (
  id,
  course_id,
  title,
  description,
  duration_minutes,
  passing_score,
  code,
  questions,
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
  '[]'::jsonb,
  NOW(),
  NOW()
FROM course
WHERE NOT EXISTS (
  SELECT 1 FROM public.exams WHERE code = 'TEST123'
);

-- Note: Questions are stored in the exams.questions JSONB column
-- Update the exam with test questions
UPDATE public.exams
SET questions = jsonb_build_array(
  jsonb_build_object(
    'id', 1,
    'question', 'What is 2 + 2?',
    'type', 'multiple_choice',
    'options', jsonb_build_array(
      jsonb_build_object('label', 'a', 'text', '3'),
      jsonb_build_object('label', 'b', 'text', '4'),
      jsonb_build_object('label', 'c', 'text', '5'),
      jsonb_build_object('label', 'd', 'text', '6')
    ),
    'correctAnswer', 'b',
    'points', 10
  ),
  jsonb_build_object(
    'id', 2,
    'question', 'What is the capital of France?',
    'type', 'multiple_choice',
    'options', jsonb_build_array(
      jsonb_build_object('label', 'a', 'text', 'London'),
      jsonb_build_object('label', 'b', 'text', 'Paris'),
      jsonb_build_object('label', 'c', 'text', 'Berlin'),
      jsonb_build_object('label', 'd', 'text', 'Madrid')
    ),
    'correctAnswer', 'b',
    'points', 10
  ),
  jsonb_build_object(
    'id', 3,
    'question', 'What is the largest planet in our solar system?',
    'type', 'multiple_choice',
    'options', jsonb_build_array(
      jsonb_build_object('label', 'a', 'text', 'Earth'),
      jsonb_build_object('label', 'b', 'text', 'Mars'),
      jsonb_build_object('label', 'c', 'text', 'Jupiter'),
      jsonb_build_object('label', 'd', 'text', 'Saturn')
    ),
    'correctAnswer', 'c',
    'points', 10
  )
)
WHERE code = 'TEST123';

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
  c.name as course_name,
  e.title as exam_title,
  e.code as exam_code,
  jsonb_array_length(e.questions) as question_count
FROM public.courses c
LEFT JOIN public.exams e ON e.course_id = c.id
WHERE c.name = 'E2E Test Course';

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
