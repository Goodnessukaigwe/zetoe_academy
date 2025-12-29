# 🎓 Certificate Verification System - Setup Guide

## Overview

This system allows admins to upload certificates and provides a public verification page where anyone can verify the authenticity of certificates using a unique code.

## ✅ What Was Implemented

### 1. Database Schema
- **Table**: `certificates` with all necessary fields
- **Function**: `generate_certificate_code()` for auto-generating unique codes
- **Indexes**: For fast searching and filtering
- **RLS Policies**: Public can verify, admins can manage

### 2. API Endpoints
- `POST /api/certificates/upload` - Upload certificate with file
- `GET /api/certificates/verify?code=XXX` - Public verification
- `GET /api/certificates` - List all certificates (admin only)
- `GET /api/certificates/generate-code` - Generate unique code

### 3. Admin Pages
- `/admin-dashboard/certificates` - List and manage all certificates
- `/admin-dashboard/certificates/upload` - Upload new certificate

### 4. Public Page
- `/verify-certificate` - Public verification page (no login required)

### 5. UI Updates
- Added "Certificates" menu item to admin sidebar

---

## 🚀 Setup Instructions

### Step 1: Run Database Migration

1. Open Supabase Dashboard → SQL Editor
2. Open the file: `supabase/certificates-schema.sql`
3. Copy all content and paste into SQL Editor
4. Click **RUN**
5. ✅ You should see success messages

### Step 2: Create Storage Bucket

1. Go to **Storage** in Supabase Dashboard
2. Click **Create Bucket**
3. Settings:
   - **Name**: `certificates`
   - **Public**: ❌ **No** (Keep it private)
   - **File Size Limit**: 5MB (recommended)
   - **Allowed MIME types**: `application/pdf,image/png,image/jpeg`
4. Click **Create Bucket**

### Step 3: Set Storage Policies

The SQL migration already created storage policies, but verify them:

1. Go to **Storage** → **certificates** bucket → **Policies**
2. You should see:
   - ✅ "Admins can upload certificates"
   - ✅ "Admins can view certificates"
   - ✅ "Authenticated users can view certificates with URL"

If missing, run these SQL commands:

```sql
-- Allow admins to upload
CREATE POLICY "Admins can upload certificates"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'certificates' 
    AND EXISTS (
      SELECT 1 FROM admins WHERE user_id = auth.uid()
    )
  );

-- Allow authenticated users to view
CREATE POLICY "Authenticated users can view certificates with URL"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'certificates');
```

### Step 4: Test Certificate Code Generation

In Supabase SQL Editor, run:

```sql
SELECT generate_certificate_code();
```

Expected output: `CERT-2025-001` (or similar with current year)

### Step 5: Restart Dev Server

```bash
npm run dev
```

---

## 📖 How to Use

### For Admins: Upload Certificate

1. **Login** as admin/super-admin
2. Go to **Certificates** in sidebar
3. Click **Upload Certificate**
4. Fill in the form:
   - Click "Generate" to auto-generate certificate code
   - Select student from dropdown
   - Choose grade (Distinction, Merit, Pass, Credit)
   - Set issue date (defaults to today)
   - (Optional) Set expiry date
   - Upload certificate file (PDF, PNG, or JPEG)
   - (Optional) Add admin notes
5. Click **Upload Certificate**
6. ✅ Success! Certificate is now verifiable

### For Public: Verify Certificate

1. Go to: `http://localhost:3000/verify-certificate` (or your production URL)
2. Enter certificate code (e.g., `CERT-2025-001`)
3. Click **Verify Certificate**
4. View certificate details:
   - Student name and email
   - Course name
   - Grade and score
   - Issue/expiry dates
   - Validity status
5. Click **View/Download Certificate** to see the actual file

---

## 🎨 Features

### Certificate Management (Admin)
✅ Auto-generate unique certificate codes  
✅ Upload certificates with student linking  
✅ Support for PDF and images  
✅ Grade assignment (Distinction, Merit, Pass, Credit)  
✅ Issue and expiry date tracking  
✅ Admin notes for internal reference  
✅ List all certificates with search  
✅ View certificate statistics  
✅ Quick actions (view, download)  

### Public Verification
✅ Search by certificate code  
✅ Public access (no login required)  
✅ Display student and course information  
✅ Show validity status (Valid, Expired, Invalid)  
✅ View/download original certificate  
✅ Verification timestamp  
✅ Security notice and authenticity badge  

### Security
✅ Row Level Security (RLS) policies  
✅ Public can only verify, not modify  
✅ Only admins can upload certificates  
✅ File storage with access control  
✅ Unique certificate codes prevent duplication  
✅ Expiry date validation  

---

## 🗂️ File Structure

```
supabase/
  └── certificates-schema.sql          # Database migration

src/app/
  ├── api/
  │   └── certificates/
  │       ├── route.ts                 # List certificates (admin)
  │       ├── upload/route.ts          # Upload certificate
  │       ├── verify/route.ts          # Public verification
  │       └── generate-code/route.ts   # Generate unique code
  │
  ├── admin-dashboard/
  │   ├── sidebar.tsx                  # Added Certificates menu
  │   └── certificates/
  │       ├── page.tsx                 # List/manage certificates
  │       └── upload/page.tsx          # Upload form
  │
  └── verify-certificate/
      └── page.tsx                     # Public verification page
```

---

## 🧪 Testing Checklist

### Admin Upload Flow
- [ ] Navigate to Admin Dashboard → Certificates
- [ ] Click "Upload Certificate"
- [ ] Click "Generate" button - should create code like `CERT-2025-001`
- [ ] Select a student from dropdown
- [ ] Student info should display below
- [ ] Choose a grade
- [ ] Upload a PDF or image file
- [ ] Submit form
- [ ] Should see success message
- [ ] Should redirect to certificates list
- [ ] New certificate should appear in the table

### Public Verification Flow
- [ ] Go to `/verify-certificate` (as guest, no login)
- [ ] Enter certificate code from admin upload
- [ ] Click "Verify Certificate"
- [ ] Should show green "Valid Certificate" banner
- [ ] Student name and email should match
- [ ] Course name should match
- [ ] Grade should be displayed
- [ ] Issue date should be correct
- [ ] "View/Download Certificate" button should work
- [ ] Clicking button should open certificate file

### Invalid Certificate Test
- [ ] Enter fake code like `CERT-9999-999`
- [ ] Should show "Certificate not found" error
- [ ] Red error banner should appear

---

## 🔧 Customization

### Change Certificate Code Format

Edit the function in `certificates-schema.sql`:

```sql
-- Current format: CERT-2025-001
-- Change to: ZA-2025-001
new_code := 'ZA-' || current_year || '-' || next_number;

-- Change to: CERT2025001 (no dashes)
new_code := 'CERT' || current_year || next_number;
```

Then run:
```sql
CREATE OR REPLACE FUNCTION generate_certificate_code()
RETURNS TEXT AS $$
-- paste modified function here
$$ LANGUAGE plpgsql;
```

### Add More Grade Options

Edit `/admin-dashboard/certificates/upload/page.tsx`:

```tsx
<select ...>
  <option value="Distinction">Distinction (90%+)</option>
  <option value="Merit">Merit (80-89%)</option>
  <option value="Pass">Pass (70-79%)</option>
  <option value="Credit">Credit (60-69%)</option>
  {/* Add your grades */}
  <option value="First Class">First Class</option>
  <option value="Second Class">Second Class</option>
</select>
```

### Change File Size Limit

Edit `/api/certificates/upload/route.ts`:

```typescript
// Current: 5MB
if (selectedFile.size > 5 * 1024 * 1024) {

// Change to: 10MB
if (selectedFile.size > 10 * 1024 * 1024) {
```

---

## 🚨 Troubleshooting

### "Failed to upload certificate file"
**Problem**: Storage bucket doesn't exist or wrong permissions  
**Solution**:
1. Go to Supabase → Storage
2. Verify `certificates` bucket exists
3. Check storage policies are applied
4. Make sure bucket is NOT public

### "Certificate not found"
**Problem**: Certificate code doesn't exist or is inactive  
**Solution**:
1. Check code spelling (case-sensitive)
2. Verify certificate is active in admin panel
3. Check if certificate was actually uploaded

### "Not authorized"
**Problem**: User is not admin  
**Solution**:
1. Verify user has admin or super_admin role
2. Check `admins` table in Supabase

### Certificate file not loading
**Problem**: Storage URL not accessible  
**Solution**:
1. Check storage policies allow SELECT
2. Verify file was uploaded successfully
3. Try regenerating public URL

---

## 🎯 Next Steps

### Enhancements You Can Add

1. **Email Notifications**
   - Send email to student when certificate is issued
   - Include verification link

2. **Bulk Upload**
   - CSV import for multiple certificates
   - Batch processing

3. **Certificate Templates**
   - Generate certificates from templates
   - Auto-fill student information

4. **QR Code Generation**
   - Add QR code to certificates
   - QR code links to verification page

5. **Certificate Revocation**
   - Add reason for deactivation
   - Show revocation history

6. **Analytics Dashboard**
   - Track verification attempts
   - Most verified certificates
   - Monthly statistics

---

## 📞 Support

If you encounter any issues:

1. Check Supabase logs for API errors
2. Check browser console for frontend errors
3. Verify all migration scripts ran successfully
4. Ensure storage bucket is properly configured

---

## ✅ Setup Complete!

Your certificate verification system is ready to use! 

**Admin Access**: `/admin-dashboard/certificates`  
**Public Verification**: `/verify-certificate`

Happy certifying! 🎓✨
