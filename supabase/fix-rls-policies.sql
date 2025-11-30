-- ============================================
-- FIX FOR INFINITE RECURSION IN ADMINS POLICIES
-- ============================================
-- Run this to fix the infinite recursion issue

-- First, drop all existing admin policies
DROP POLICY IF EXISTS "Admins can view all admins" ON admins;
DROP POLICY IF EXISTS "Super admins can insert admins" ON admins;
DROP POLICY IF EXISTS "Super admins can update admins" ON admins;
DROP POLICY IF EXISTS "Super admins can delete admins" ON admins;

-- Drop helper functions if they exist
DROP FUNCTION IF EXISTS is_admin();
DROP FUNCTION IF EXISTS is_super_admin();

-- ============================================
-- NEW ADMINS POLICIES (No Recursion)
-- ============================================

-- Admins can only view their own record
-- For admin management features, use service role key which bypasses RLS
CREATE POLICY "Admins can view own record"
  ON admins FOR SELECT
  USING (user_id = auth.uid());

-- Allow viewing by email for invite process (when user_id is null)
CREATE POLICY "Allow viewing pending invites"
  ON admins FOR SELECT
  USING (user_id IS NULL);

-- Super admins can insert new admin invites
-- This is safe because we're checking a simple column value, not doing a recursive query
CREATE POLICY "Super admins can insert admins"
  ON admins FOR INSERT
  WITH CHECK (
    -- The inserting user must be a super admin
    -- We check this by looking at their own record only
    EXISTS (
      SELECT 1 FROM admins
      WHERE user_id = auth.uid() 
      AND role = 'super_admin'
      LIMIT 1
    )
  );

-- Super admins can update admin records
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

-- Super admins can delete admin records
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
-- IMPORTANT NOTES:
-- ============================================
-- 1. The SELECT policy only allows admins to view their own record
-- 2. For features like the admin management page in super-admin dashboard,
--    the API should use the service role client (adminClient) which bypasses RLS
-- 3. This prevents the infinite recursion while maintaining security
