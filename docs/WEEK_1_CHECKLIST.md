# 📋 Week 1 Checklist - Supabase Setup

## ✅ Completed Tasks

### 1. Project Dependencies

- [x] Installed `@supabase/supabase-js`
- [x] Installed `@supabase/ssr`

### 2. Environment Configuration

- [x] Created `.env.local.example` template
- [x] Created `.env.local` file (needs your credentials)
- [x] Added to `.gitignore` (already configured)

### 3. Supabase Client Setup

- [x] Created browser client (`src/lib/supabase/client.ts`)
- [x] Created server client (`src/lib/supabase/server.ts`)
- [x] Created middleware helper (`src/lib/supabase/middleware.ts`)
- [x] Created Next.js middleware (`middleware.ts`)

### 4. Database Schema

- [x] Created SQL schema (`supabase/schema.sql`)
  - Tables: courses, students, admins, exams, scores, payments
  - Indexes for performance
  - Triggers for updated_at columns
- [x] Created RLS policies (`supabase/rls-policies.sql`)
- [x] Created sample data (`supabase/sample-data.sql`)

### 5. Authentication Utilities

- [x] Created auth helper functions (`src/lib/auth.ts`)
  - signUp, signIn, signOut
  - getCurrentUser, resetPassword
  - Role checking: isStudent, isAdmin
  - Profile fetching

### 6. TypeScript Types

- [x] Created database type definitions (`src/types/database.ts`)
  - All table interfaces
  - Enums for statuses and roles

### 7. Documentation

- [x] Created `SUPABASE_SETUP.md` (detailed setup guide)
- [x] Updated `README.md` (project overview)
- [x] Created this checklist

### 8. Testing

- [x] Created test connection page (`src/app/test-connection/page.tsx`)

---

## 🔄 Your Next Steps (Action Required)

### Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up/login
3. Click "New Project"
4. Fill in:
   - Name: `zetoe-academy`
   - Database Password: (create strong password)
   - Region: Choose closest to you
5. Wait ~2 minutes for setup

### Step 2: Get Your Credentials

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL**
   - **anon/public key**
   - **service_role key**

### Step 3: Update .env.local

Open `.env.local` and replace:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...your-key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...your-service-key
```

### Step 4: Run Database Scripts

In Supabase SQL Editor, run these in order:

1. Copy + paste + run `supabase/schema.sql`
2. Copy + paste + run `supabase/rls-policies.sql`
3. (Optional) Copy + paste + run `supabase/sample-data.sql`

### Step 5: Enable Authentication

1. In Supabase dashboard: **Authentication** → **Providers**
2. Ensure **Email** is enabled
3. Configure:
   - ✅ Enable email confirmations (for production)
   - ✅ Enable password recovery

### Step 6: Test the Setup

```bash
npm run dev
```

Then visit: [http://localhost:3000/test-connection](http://localhost:3000/test-connection)

You should see:

- ✅ Environment variables check
- ✅ Database connection test
- ✅ List of courses (if you ran sample-data.sql)

---

## 📝 Week 1 Deliverables Status

| Deliverable                      | Status     |
| -------------------------------- | ---------- |
| Project initialized with Next.js | ✅ Done    |
| Supabase client installed        | ✅ Done    |
| Environment variables template   | ✅ Done    |
| Database schema created          | ✅ Done    |
| RLS policies defined             | ✅ Done    |
| Authentication helpers           | ✅ Done    |
| TypeScript types                 | ✅ Done    |
| Documentation                    | ✅ Done    |
| Connection test page             | ✅ Done    |
| **You: Create Supabase project** | ⏳ Pending |
| **You: Configure .env.local**    | ⏳ Pending |
| **You: Run SQL scripts**         | ⏳ Pending |
| **You: Test connection**         | ⏳ Pending |

---

## 🎯 After Supabase Setup is Complete

Once you've completed the steps above and the test page shows ✅, you're ready for:

### Week 2: Frontend Development

- Build landing page (hero, courses section)
- Create registration & login pages
- Build student dashboard
- Implement exam access with codes

---

## 🆘 Troubleshooting

### "Module not found: @supabase/ssr"

```bash
npm install @supabase/ssr
```

### "Invalid API key"

- Double-check `.env.local` values
- Restart dev server: `Ctrl+C` then `npm run dev`

### "relation does not exist"

- Run `supabase/schema.sql` in Supabase SQL Editor
- Check Table Editor to verify tables were created

### "Row Level Security policy violation"

- Run `supabase/rls-policies.sql`
- Make sure user is authenticated for protected operations

---

## 📚 Helpful Resources

- [Supabase Setup Guide](./SUPABASE_SETUP.md) - Detailed walkthrough
- [README.md](./README.md) - Project overview
- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)

---

**Need help?** Check the documentation or open an issue on GitHub.

Last updated: October 20, 2025
