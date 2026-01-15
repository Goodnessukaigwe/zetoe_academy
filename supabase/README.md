# Running Test Data Setup

There are **3 methods** to load test data into your Supabase database:

## Method 1: Using the Helper Script (Recommended)

```bash
# From project root
./scripts/setup-test-data.sh
```

This will:

- Check if Supabase CLI is installed
- Prompt for confirmation
- Execute the SQL file
- Show created test accounts

## Method 2: Using Supabase CLI Directly

```bash
# Make sure you're logged in to Supabase CLI
supabase login

# Link to your project (if not already linked)
supabase link --project-ref YOUR_PROJECT_REF

# Run the SQL file
supabase db execute --file supabase/test-data-setup.sql
```

## Method 3: Using Supabase Dashboard (Manual)

1. Open [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **SQL Editor** (left sidebar)
4. Click **New Query**
5. Copy entire contents of `supabase/test-data-setup.sql`
6. Paste into editor
7. Click **Run** (or press Ctrl+Enter)

## What Gets Created

After running the script, you'll have:

### Test Users

| Email                  | Password         | Role        |
| ---------------------- | ---------------- | ----------- |
| student.test@zetoe.com | TestPassword123! | Student     |
| admin.test@zetoe.com   | TestPassword123! | Admin       |
| superadmin@zetoe.com   | TestPassword123! | Super Admin |

### Sample Courses

- Introduction to Programming
- Web Development Fundamentals

### Sample Exams

- Programming Basics Quiz (4 questions)
- HTML & CSS Fundamentals (3 questions)

## Troubleshooting

### Error: "Supabase CLI not installed"

Install it:

```bash
# Using npm
npm install -g supabase

# Using Homebrew (macOS)
brew install supabase/tap/supabase

# Using Scoop (Windows)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

### Error: "Not linked to a project"

Link your project:

```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
```

Find your project ref:

1. Go to Supabase Dashboard
2. Settings → General
3. Copy "Reference ID"

### Error: "ON CONFLICT" or column errors

The SQL file has been updated to use `DO $$ IF NOT EXISTS` blocks instead of `ON CONFLICT`. If you still see errors:

1. Make sure you're using the latest version of `supabase/test-data-setup.sql`
2. Check that your database schema is up to date (run `supabase/schema.sql` first)
3. Try the manual method (Method 3) to see specific error messages

### Error: "duplicate key value violates unique constraint"

The test data already exists. To reset:

```sql
-- Run this in SQL Editor first to clean up
DELETE FROM students WHERE email LIKE '%@zetoe.com';
DELETE FROM auth.users WHERE email LIKE '%@zetoe.com';
DELETE FROM exams WHERE id IN (SELECT id FROM exams WHERE code LIKE 'TEST%');
DELETE FROM courses WHERE id IN (SELECT id FROM courses WHERE name LIKE '%Test%');
```

Then run the test data setup again.

## Verifying Test Data

After setup, verify the data:

```sql
-- Check users
SELECT id, email, raw_user_meta_data->>'full_name' as name
FROM auth.users
WHERE email LIKE '%@zetoe.com';

-- Check courses
SELECT id, name, description FROM courses;

-- Check exams
SELECT id, code, title FROM exams;

-- Check students
SELECT * FROM students WHERE email LIKE '%@zetoe.com';
```

## Next Steps

After test data is loaded:

```bash
# Run E2E tests
npm run test:e2e

# Or run specific browser
npm run test:e2e:chromium
npm run test:e2e:firefox
npm run test:e2e:webkit
```

## Important Notes

⚠️ **Only use in development/test environments**

- Do not run this in production
- Test passwords are intentionally simple
- Test data includes sample content

🔒 **Security**

- All test users have the same password for testing
- Change passwords for any test users in production-like environments
- Delete test users before deploying to production

📧 **Email Verification**

- Test users are auto-verified (`email_confirmed_at` is set)
- This bypasses the email verification flow
- To test email verification, register a new user through `/register` page

## Cleaning Up Test Data

To remove all test data:

```sql
-- Remove test users and related data
DELETE FROM students WHERE email LIKE '%@zetoe.com';
DELETE FROM auth.users WHERE email LIKE '%@zetoe.com';

-- Remove test courses and exams
DELETE FROM exams WHERE code IN ('PROG101-Q1', 'WEB101-Q1');
DELETE FROM courses WHERE name IN ('Introduction to Programming', 'Web Development Fundamentals');
```

Or use the cleanup script:

```bash
./scripts/cleanup-test-data.sh  # (if created)
```

## Related Documentation

- **E2E Testing**: See `playwright.config.ts` and `e2e/README.md`
- **Database Schema**: See `supabase/schema.sql`
- **Email Verification**: See `docs/EMAIL_VERIFICATION.md`
