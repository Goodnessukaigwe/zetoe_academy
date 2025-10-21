-- ============================================
-- QUICK ADMIN CREATION SCRIPT
-- ============================================
-- Use this after you've signed up through your app
-- This will make your account a super admin

-- STEP 1: Find your user ID
-- Go to Authentication → Users in Supabase dashboard
-- Copy your user UUID from the 'id' column

-- STEP 2: Run this query (replace YOUR-USER-ID with actual UUID)
INSERT INTO admins (user_id, name, email, role)
VALUES (
  'YOUR-USER-ID-HERE',           -- Replace with your user UUID
  'Your Name',                    -- Replace with your name
  'your-email@example.com',       -- Replace with your email
  'super_admin'                   -- Keep as 'super_admin' for full access
);

-- ============================================
-- VERIFICATION
-- ============================================
-- Check if admin was created successfully:
SELECT * FROM admins WHERE email = 'your-email@example.com';

-- ============================================
-- CREATE ADDITIONAL ADMINS
-- ============================================
-- After signing them up, run:
INSERT INTO admins (user_id, name, email, role)
VALUES (
  'user-uuid',
  'Admin Name',
  'admin@example.com',
  'admin'  -- Use 'admin' for regular admin (can't manage other admins)
);

-- ============================================
-- UPDATE ADMIN ROLE
-- ============================================
-- To promote an admin to super admin:
UPDATE admins 
SET role = 'super_admin' 
WHERE email = 'admin@example.com';

-- To demote a super admin to regular admin:
UPDATE admins 
SET role = 'admin' 
WHERE email = 'admin@example.com';

-- ============================================
-- DELETE ADMIN
-- ============================================
-- To remove admin privileges (they remain as users):
DELETE FROM admins WHERE email = 'admin@example.com';

-- ============================================
-- VIEW ALL ADMINS
-- ============================================
SELECT 
  a.name,
  a.email,
  a.role,
  a.created_at,
  u.email_confirmed_at,
  u.last_sign_in_at
FROM admins a
LEFT JOIN auth.users u ON a.user_id = u.id
ORDER BY a.created_at DESC;
