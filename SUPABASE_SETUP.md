# Supabase Setup Guide

## 🚀 Step-by-Step Setup Instructions

### 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" or "New Project"
3. Sign in with GitHub or email
4. Click "New Project"
5. Fill in:
   - **Project Name**: `zetoe-academy` (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your users (e.g., West Africa)
6. Click "Create new project"
7. Wait ~2 minutes for setup to complete

### 2. Get Your API Keys

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)
   - **service_role key** (starts with `eyJ...`) - Keep this SECRET!

### 3. Configure Environment Variables

1. Open `.env.local` in your project root
2. Replace the placeholder values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Set Up the Database Schema

1. Go to **SQL Editor** in your Supabase dashboard
2. Click **New Query**
3. Copy the contents of `supabase/schema.sql`
4. Paste into the query editor
5. Click **RUN** (bottom right)
6. ✅ You should see "Success. No rows returned"

### 5. Set Up Row Level Security (RLS) Policies

1. In **SQL Editor**, create another **New Query**
2. Copy the contents of `supabase/rls-policies.sql`
3. Paste and **RUN**
4. ✅ Verify success

### 6. (Optional) Add Sample Data

1. Create another **New Query**
2. Copy contents of `supabase/sample-data.sql`
3. Paste and **RUN**
4. Go to **Table Editor** → **courses** to verify data was inserted

### 7. Configure Authentication

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider (should be enabled by default)
3. Configure settings:
   - ✅ Enable email confirmations (recommended for production)
   - ✅ Enable password recovery
4. Go to **Authentication** → **URL Configuration**
5. Add your site URL:
   - Development: `http://localhost:3000`
   - Production: Your Vercel URL (add later)

### 8. Enable Storage (Optional - for profile pictures)

1. Go to **Storage** → **New Bucket**
2. Create bucket: `student-profiles`
3. Make it **Public** (or set custom policies)
4. Add policy to allow authenticated users to upload

### 9. Test the Connection

Run your Next.js app:

```bash
npm run dev
```

Open browser console and test:

```javascript
// In your browser console
const { createClient } = require("@supabase/supabase-js");
const supabase = createClient("YOUR_SUPABASE_URL", "YOUR_ANON_KEY");

// Test connection
supabase.from("courses").select("*").then(console.log);
```

### 10. Create Your First Super Admin

After you sign up through your app, manually make yourself a super admin:

1. Go to **Authentication** → **Users**
2. Find your user and copy the UUID
3. Go to **SQL Editor** → **New Query**
4. Run:

```sql
INSERT INTO admins (user_id, name, email, role)
VALUES (
  'YOUR-USER-UUID-HERE',
  'Your Name',
  'your-email@example.com',
  'super_admin'
);
```

## 🔒 Security Checklist

- ✅ Never commit `.env.local` to git (already in `.gitignore`)
- ✅ Keep `service_role` key secret (only use server-side)
- ✅ RLS policies are enabled on all tables
- ✅ Enable email confirmation for production
- ✅ Set up proper CORS in Supabase settings

## 📚 Useful Supabase Dashboard Links

- **Table Editor**: View and edit data visually
- **SQL Editor**: Run custom queries
- **Authentication**: Manage users
- **Storage**: Manage uploaded files
- **Database** → **Backups**: Schedule automatic backups
- **Logs**: View real-time logs and errors

## 🧪 Testing Authentication

### Test Signup:

```typescript
import { signUp } from "@/lib/auth";

const result = await signUp("test@example.com", "password123", {
  name: "Test User",
});
console.log(result);
```

### Test Login:

```typescript
import { signIn } from "@/lib/auth";

const result = await signIn("test@example.com", "password123");
console.log(result);
```

## 🆘 Troubleshooting

### "Invalid API key"

- Double-check your `.env.local` values
- Restart your dev server after changing env variables

### "Row Level Security policy violation"

- Check that RLS policies are properly set up
- Verify user is authenticated
- Check user role in database

### "relation does not exist"

- Make sure you ran `schema.sql` successfully
- Check Table Editor to verify tables were created

## 🎉 Next Steps

Once setup is complete:

1. ✅ Test user registration
2. ✅ Test login/logout
3. ✅ Create an admin account
4. ✅ Start building your frontend!

---

Need help? Check the [Supabase Documentation](https://supabase.com/docs) or ask in the Discord!
