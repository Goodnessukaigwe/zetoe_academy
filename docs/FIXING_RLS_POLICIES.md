# Fixing Infinite Recursion Error in Admins Table

## Problem

The RLS policies for the `admins` table were causing infinite recursion because they were querying the same table they were protecting.

## Solution

Run the SQL script in `/supabase/fix-rls-policies.sql` in your Supabase SQL Editor.

## How to Apply the Fix

1. **Go to your Supabase Dashboard**

   - Navigate to: https://supabase.com/dashboard
   - Select your project

2. **Open the SQL Editor**

   - Click on "SQL Editor" in the left sidebar

3. **Run the fix script**
   - Copy the entire contents of `/supabase/fix-rls-policies.sql`
   - Paste it into the SQL Editor
   - Click "Run" to execute

## What Changed

### Before (Caused Recursion):

```sql
CREATE POLICY "Admins can view all admins"
  ON admins FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admins  -- This queries admins while applying policy on admins!
      WHERE user_id = auth.uid()
    )
  );
```

### After (No Recursion):

```sql
-- Admins can only view their own record
CREATE POLICY "Admins can view own record"
  ON admins FOR SELECT
  USING (user_id = auth.uid());  -- Direct column check, no subquery to admins table
```

## Important Notes

1. **Admin Management Pages**: The super-admin dashboard's admin management page should use the `adminClient` (service role) which bypasses RLS entirely. This is already implemented in `/src/app/api/admins/route.ts`.

2. **Two SELECT Policies**:

   - One allows admins to view their own record
   - Another allows viewing pending invites (where `user_id IS NULL`)

3. **No More Infinite Recursion**: The INSERT/UPDATE/DELETE policies now use `LIMIT 1` to prevent recursion and only check the current user's own admin record.

## Verification

After running the fix, test that:

- ✅ Super-admins can view the admin management page
- ✅ Super-admins can create new admin invites
- ✅ Admins can view their own profile
- ✅ No "infinite recursion" errors in the console
