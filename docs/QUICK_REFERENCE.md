# 🎯 Quick Reference - Supabase Setup

## ✅ What Was Created

### 📄 Configuration Files

```
.env.local.example          - Environment variables template
.env.local                  - Your credentials (FILL THIS IN!)
middleware.ts               - Next.js middleware for session refresh
```

### 📚 Documentation

```
README.md                   - Project overview & quick start
SUPABASE_SETUP.md          - Detailed setup instructions
WEEK_1_CHECKLIST.md        - Complete task checklist
SETUP_SUMMARY.md           - Comprehensive summary
QUICK_REFERENCE.md         - This file!
```

### 🗄️ Database Scripts (`supabase/`)

```
schema.sql                  - Main database schema (6 tables)
rls-policies.sql           - Row Level Security policies
sample-data.sql            - Test data (5 courses)
create-admin.sql           - Helper to create admin accounts
```

### 💻 Code Files (`src/`)

```
lib/
  supabase/
    client.ts              - Browser Supabase client
    server.ts              - Server Supabase client
    middleware.ts          - Session refresh helper
  auth.ts                  - Authentication functions
types/
  database.ts              - TypeScript type definitions
app/
  test-connection/
    page.tsx               - Connection test page
```

---

## 🚀 Quick Setup (5 Steps)

### 1️⃣ Create Supabase Project

```
https://supabase.com → New Project
Name: zetoe-academy
Region: Closest to you
```

### 2️⃣ Get Credentials

```
Settings → API → Copy:
- Project URL
- anon/public key
- service_role key
```

### 3️⃣ Update .env.local

```bash
# Open and edit:
nano .env.local

# Or use your editor
```

### 4️⃣ Run SQL Scripts

In Supabase SQL Editor, run in order:

```sql
1. supabase/schema.sql
2. supabase/rls-policies.sql
3. supabase/sample-data.sql (optional)
```

### 5️⃣ Test Connection

```bash
npm run dev
# Visit: http://localhost:3000/test-connection
```

---

## 📖 Common Commands

### Development

```bash
npm run dev              # Start dev server
npm run build           # Build for production
npm run lint            # Run ESLint
```

### Testing Connection

```bash
# After starting dev server:
open http://localhost:3000/test-connection
```

---

## 🔑 Authentication Functions

### Client-Side

```typescript
import { signUp, signIn, signOut } from "@/lib/auth";

// Sign up
await signUp("email@example.com", "password", { name: "User" });

// Sign in
await signIn("email@example.com", "password");

// Sign out
await signOut();
```

### Server-Side

```typescript
import { getServerUser, getUserRole } from "@/lib/auth";

// Get current user
const { user } = await getServerUser();

// Check role
const role = await getUserRole(user.id);
// Returns: 'student' | 'admin' | 'super_admin' | null
```

---

## 🗄️ Database Queries

### Fetch Courses

```typescript
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();
const { data, error } = await supabase.from("courses").select("*");
```

### Fetch Student Profile

```typescript
const { data } = await supabase
  .from("students")
  .select(
    `
    *,
    course:courses(*)
  `
  )
  .eq("user_id", userId)
  .single();
```

### Create Exam

```typescript
const { data } = await supabase
  .from('exams')
  .insert({
    course_id: courseId,
    title: 'Final Exam',
    code: 'EXAM123',
    questions: [...],
    duration_minutes: 60,
    passing_score: 70
  })
```

---

## 🎨 Database Tables

| Table      | Purpose           | Key Fields                             |
| ---------- | ----------------- | -------------------------------------- |
| `courses`  | Available courses | name, price, duration                  |
| `students` | Student profiles  | name, email, course_id, payment_status |
| `admins`   | Admin accounts    | email, role                            |
| `exams`    | Exam questions    | title, code, questions (JSON)          |
| `scores`   | Exam results      | student_id, exam_id, score, percentage |
| `payments` | Payment records   | student_id, amount, reference          |

---

## 🔐 User Roles

### Student

- Can register and enroll in courses
- Can take exams
- Can view own data only

### Admin

- All student functions
- Can manage students
- Can create/edit exams
- Can view all students

### Super Admin

- All admin functions
- Can create/delete admins
- Full system access
- Can edit anyone's data

---

## 🆘 Troubleshooting

| Problem            | Solution                              |
| ------------------ | ------------------------------------- |
| "Invalid API key"  | Check `.env.local` and restart server |
| "Table not found"  | Run `schema.sql` in Supabase          |
| "Access denied"    | Run `rls-policies.sql`                |
| "Module not found" | Run `npm install`                     |
| Connection fails   | Check Supabase project URL            |

---

## 📂 File Locations

```
Config:
  .env.local                    - Your credentials

SQL Scripts:
  supabase/schema.sql           - Database tables
  supabase/rls-policies.sql     - Security policies
  supabase/create-admin.sql     - Make admins

Code:
  src/lib/auth.ts               - Auth functions
  src/lib/supabase/client.ts    - Browser client
  src/lib/supabase/server.ts    - Server client

Docs:
  README.md                     - Start here
  SUPABASE_SETUP.md            - Detailed guide
  WEEK_1_CHECKLIST.md          - Task list
```

---

## 🎯 Next Steps After Setup

1. ✅ Verify test connection page shows green
2. ✅ Create your first admin account
3. ✅ Start building Week 2 features:
   - Landing page
   - Registration/Login forms
   - Student dashboard

---

## 📞 Quick Links

- **Supabase Dashboard**: https://app.supabase.com
- **Test Page**: http://localhost:3000/test-connection
- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs

---

**Last Updated**: October 20, 2025  
**Status**: Week 1 Complete - Ready for Frontend Development
