-- ============================================
-- CREATE SUPERADMIN DIRECTLY WITH PASSWORD
-- ============================================
-- This creates a superadmin account directly in the database
-- without going through the normal signup process

-- IMPORTANT: Replace these values before running:
-- 1. 'superadmin@example.com' - The superadmin's email
-- 2. 'YourSecurePassword123!' - The desired password
-- 3. 'Super Admin Name' - The superadmin's name

-- ============================================
-- METHOD 1: Using Supabase Auth Admin API (RECOMMENDED)
-- ============================================
-- This is the safest method. Run this in your Supabase SQL Editor:

DO $$
DECLARE
  new_user_id UUID;
BEGIN
  -- This will be filled by the insert below
  new_user_id := gen_random_uuid();
  
  -- Note: You should use Supabase Dashboard or Admin API to create users
  -- Go to: Authentication -> Users -> Add User
  -- Then use the user_id from there in the next step
  
  RAISE NOTICE 'Please create user via Supabase Dashboard first, then use their ID below';
END $$;

-- ============================================
-- METHOD 2: After Creating User in Dashboard
-- ============================================
-- Step 1: Go to Supabase Dashboard → Authentication → Users → "Add User"
-- Step 2: Fill in:
--         - Email: superadmin@example.com
--         - Password: YourSecurePassword123!
--         - Auto Confirm User: YES (check this box)
-- Step 3: Copy the generated user ID
-- Step 4: Run this query with the user ID:

INSERT INTO admins (user_id, name, email, role)
VALUES (
  'USER-ID-FROM-DASHBOARD',        -- Paste the user ID here
  'Super Admin Name',               -- Replace with actual name
  'superadmin@example.com',         -- Must match the email used above
  'super_admin'
);

-- ============================================
-- VERIFICATION
-- ============================================
-- Check if superadmin was created successfully:
SELECT 
  a.name,
  a.email,
  a.role,
  a.created_at,
  u.email,
  u.email_confirmed_at,
  u.encrypted_password IS NOT NULL as has_password
FROM admins a
JOIN auth.users u ON a.user_id = u.id
WHERE a.role = 'super_admin'
ORDER BY a.created_at DESC;

-- ============================================
-- ALTERNATIVE: Create Multiple Superadmins
-- ============================================
-- Repeat Method 2 for each superadmin you want to create

-- Example for second superadmin:
-- INSERT INTO admins (user_id, name, email, role)
-- VALUES (
--   'ANOTHER-USER-ID',
--   'Second Admin Name',
--   'admin2@example.com',
--   'super_admin'
-- );
