-- ============================================
-- SUPABASE STORAGE: STUDENT PROFILE PHOTOS
-- ============================================
-- Run this SQL in your Supabase SQL Editor to set up storage

-- This will create the storage bucket and configure RLS policies
-- You can also do this via Supabase Dashboard:
-- Storage → Create bucket → Name: "student-profiles" → Public: Yes

-- ============================================
-- 1. CREATE STORAGE BUCKET (Via Dashboard)
-- ============================================
-- Go to: Storage → New Bucket
-- Name: student-profiles
-- Public: Yes (allow public access to read photos)
-- File size limit: 5MB
-- Allowed MIME types: image/jpeg, image/png, image/webp

-- ============================================
-- 2. STORAGE POLICIES (RLS)
-- ============================================

-- Allow authenticated admins to upload
CREATE POLICY "Admins can upload student photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'student-profiles' AND
  EXISTS (
    SELECT 1 FROM admins
    WHERE admins.user_id = auth.uid()
  )
);

-- Allow authenticated admins to update/replace photos
CREATE POLICY "Admins can update student photos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'student-profiles' AND
  EXISTS (
    SELECT 1 FROM admins
    WHERE admins.user_id = auth.uid()
  )
);

-- Allow authenticated admins to delete photos
CREATE POLICY "Admins can delete student photos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'student-profiles' AND
  EXISTS (
    SELECT 1 FROM admins
    WHERE admins.user_id = auth.uid()
  )
);

-- Allow anyone to view/download photos (public bucket)
CREATE POLICY "Anyone can view student photos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'student-profiles');

-- ============================================
-- 3. VERIFICATION QUERIES
-- ============================================

-- Check if bucket exists
-- SELECT * FROM storage.buckets WHERE id = 'student-profiles';

-- Check policies
-- SELECT * FROM pg_policies WHERE tablename = 'objects' AND policyname LIKE '%student%';

-- List all files in bucket
-- SELECT * FROM storage.objects WHERE bucket_id = 'student-profiles';

-- ============================================
-- 4. MANUAL SETUP VIA DASHBOARD (ALTERNATIVE)
-- ============================================

/**
 * If SQL approach doesn't work, set up manually via dashboard:
 * 
 * 1. Go to Storage in Supabase Dashboard
 * 2. Click "New Bucket"
 * 3. Set name: student-profiles
 * 4. Set as Public: Yes
 * 5. Set file size limit: 5242880 (5MB)
 * 6. Add allowed MIME types:
 *    - image/jpeg
 *    - image/jpg
 *    - image/png
 *    - image/webp
 * 7. Click "Create bucket"
 * 
 * 8. Go to Policies tab
 * 9. Create policies using the SQL above or use the policy builder
 */

-- ============================================
-- 5. FOLDER STRUCTURE
-- ============================================

/**
 * Photos will be organized by student ID:
 * 
 * student-profiles/
 * ├── {student-uuid-1}/
 * │   └── {timestamp}.jpg
 * ├── {student-uuid-2}/
 * │   └── {timestamp}.png
 * └── ...
 * 
 * Example:
 * student-profiles/123e4567-e89b-12d3-a456-426614174000/1738022400000.jpg
 */

-- ============================================
-- SETUP COMPLETE
-- ============================================
