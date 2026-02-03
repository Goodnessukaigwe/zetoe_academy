# Zetoe Academy - Username-Based Authentication System

## Overview

This application uses a **username and password** authentication system for students. Email addresses are stored as informational data only, similar to phone numbers. All student accounts are created by administrators (super admins), and students cannot self-register.

---

## Authentication Flow

### For Students

1. **Account Creation** (Admin-only)
   - Super admin creates student account via Student Management page
   - System auto-generates unique username (format: `STU2026001`, `STU2026002`, etc.)
   - Admin sets initial password (minimum 6 characters, no complexity requirements)
   - Admin can optionally upload student profile photo

2. **Login**
   - Student visits `/login`
   - Enters username and password
   - System looks up student by username and authenticates
   - Redirected to student dashboard upon success

3. **Student Dashboard**
   - Displays profile photo (if uploaded) or initials
   - Shows enrolled course information
   - Access to exams and results
   - View payment status

### For Admins

- Admins use email and password to login
- Admins can create, edit, and manage students
- Admins can assign courses and set payment status
- Super admins can upload student photos

---

## Database Schema Changes

### Students Table

```sql
CREATE TABLE students (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  username TEXT UNIQUE NOT NULL,  -- Auto-generated (STU2026001, STU2026002...)
  name TEXT NOT NULL,
  email TEXT NOT NULL,  -- NOT UNIQUE (informational only)
  phone TEXT,
  course_id UUID REFERENCES courses(id),
  payment_status TEXT DEFAULT 'unpaid',
  profile_picture_url TEXT,  -- Uploaded by admin
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Key Changes

1. **username column** - Unique, auto-generated identifier for login
2. **email** - No longer unique constraint, used for information only
3. **profile_picture_url** - Functional photo upload system

---

## Setup Instructions

### 1. Run Database Migration

```bash
# In Supabase SQL Editor
# Run: supabase/migration-username-auth.sql
```

This migration will:

- Add `username` column to students table
- Remove unique constraint from email
- Create username generation function
- Add username to all existing students
- Create auto-generate trigger for new students

### 2. Configure Supabase Storage

```bash
# In Supabase SQL Editor
# Run: supabase/storage-setup.sql
```

Or manually via Dashboard:

1. Go to Storage → New Bucket
2. Name: `student-profiles`
3. Set as Public
4. File size limit: 5MB
5. Allowed types: JPG, PNG, WebP

### 3. Update Environment Variables

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

---

## Features

### ✅ Implemented

1. **Username-Based Login**
   - Students login with auto-generated username
   - No email verification required
   - Simple password requirements (min 6 characters)

2. **Admin Student Management**
   - Create students with username auto-generation
   - Set student passwords
   - Upload profile photos
   - Assign courses and set payment status

3. **Profile Photos**
   - Super admin uploads photos during student creation
   - Photos displayed on student dashboard
   - Automatic fallback to initials if no photo

4. **Simplified Course Display**
   - Courses page shows information only
   - No self-enrollment functionality
   - Students contact admin for enrollment

### ❌ Removed Features

1. **Email Verification** - Completely removed
2. **Self-Registration** - Students cannot create accounts
3. **Password Complexity** - No uppercase/lowercase/special character requirements
4. **Course Enrollment Modal** - Removed from course detail pages

---

## API Endpoints

### Authentication

| Endpoint            | Method | Description                    |
| ------------------- | ------ | ------------------------------ |
| `/api/auth/signin`  | POST   | Login with username & password |
| `/api/auth/signout` | POST   | Logout current user            |

### Student Management

| Endpoint                   | Method | Description                         | Access      |
| -------------------------- | ------ | ----------------------------------- | ----------- |
| `/api/students`            | POST   | Create student (generates username) | Admin       |
| `/api/students`            | GET    | List all students                   | Admin       |
| `/api/students/[id]`       | PUT    | Update student                      | Admin       |
| `/api/students/[id]`       | DELETE | Delete student                      | Super Admin |
| `/api/students/[id]/photo` | POST   | Upload student photo                | Admin       |
| `/api/students/[id]/photo` | DELETE | Remove student photo                | Admin       |

---

## User Roles

### Student

- Login with username and password
- View enrolled course
- Take exams
- View results and certificates
- View payment status
- **Cannot:** Register self, enroll in courses, change email

### Admin

- All student permissions
- Create and manage students
- Assign courses
- Set payment status
- Create exams
- Upload student photos
- View all student data

### Super Admin

- All admin permissions
- Create and delete admins
- System-wide access
- Delete students

---

## Common Tasks

### Creating a New Student

1. Login as admin or super admin
2. Navigate to Student Management
3. Click "Add Student"
4. Fill in:
   - Name (required)
   - Email (required, informational)
   - Password (required, min 6 characters)
   - Phone (optional)
   - Course (optional)
   - Payment Status (default: unpaid)
   - Profile Photo (optional, max 5MB)
5. Click "Add Student"
6. **Copy the generated username** and share with student

### Uploading Student Photo

Photos can be uploaded:

- During student creation (recommended)
- After creation via edit student modal

Requirements:

- Max file size: 5MB
- Formats: JPG, PNG, WebP
- Stored in Supabase Storage bucket: `student-profiles`

### Resetting Student Password

1. Navigate to Student Management
2. Find student and click Edit
3. Enter new password (min 6 characters)
4. Save changes
5. Share new password with student

---

## Username Format

Auto-generated usernames follow this format:

```
STU + YEAR + 3-DIGIT-COUNTER
```

Examples:

- `STU2026001` - First student of 2026
- `STU2026002` - Second student of 2026
- `STU2026999` - 999th student of 2026

The counter resets each year, ensuring chronological organization.

---

## Security Notes

1. **Password Requirements**
   - Minimum 6 characters
   - No complexity requirements (per client request)
   - Stored securely using Supabase Auth encryption

2. **Username Generation**
   - Usernames are unique and auto-generated
   - Prevents conflicts and ensures consistency
   - Cannot be changed after creation

3. **Photo Upload**
   - Only admins can upload photos
   - Files are scanned for valid image formats
   - Stored securely in Supabase Storage
   - Public read access (photos visible on dashboards)

4. **Email Privacy**
   - Emails are not used for authentication
   - No unique constraint allows multiple students with same email
   - Used for informational purposes only

---

## Troubleshooting

### Student Cannot Login

**Check:**

1. Username is correct (case-sensitive)
2. Password is correct
3. Student account exists in database
4. Student has `user_id` linked to auth.users

**Fix:**

- Admin can look up username in Student Management
- Admin can reset password if needed

### Username Not Generating

**Check:**

1. Migration script was run successfully
2. `generate_student_username()` function exists
3. Trigger `trigger_auto_generate_username` is active

**Fix:**

```sql
-- Manually generate username for student
UPDATE students
SET username = 'STU2026XXX'
WHERE id = 'student-uuid';
```

### Photo Upload Fails

**Check:**

1. Storage bucket `student-profiles` exists
2. Bucket is set to public
3. RLS policies are configured
4. File size < 5MB
5. File type is JPG, PNG, or WebP

**Fix:**

- Re-run `supabase/storage-setup.sql`
- Or configure manually via Supabase Dashboard

---

## Migration from Old System

If migrating from email-based authentication:

1. **Backup Database**

   ```sql
   -- Export students table
   COPY students TO '/tmp/students_backup.csv' CSV HEADER;
   ```

2. **Run Migration**

   ```bash
   # Run migration-username-auth.sql
   ```

3. **Verify Usernames Generated**

   ```sql
   SELECT id, name, email, username
   FROM students
   ORDER BY created_at DESC;
   ```

4. **Notify Students**
   - Send email with new username
   - Include login instructions
   - Provide admin contact for password reset

---

## Development

### Running Locally

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

### Environment Setup

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
```

---

## Support

For issues or questions:

- Check database logs in Supabase Dashboard
- Review API logs in Next.js terminal
- Contact system administrator

---

**Last Updated:** January 28, 2026
**Version:** 2.0.0 (Username-based Authentication)
