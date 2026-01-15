# Email Verification - Quick Setup Guide

## 🎯 What This Does

**Before**: All users (admin-created and self-registered) could login immediately without email verification.

**After**:

- **Admin-created users** → Can login immediately (no verification)
- **Self-registered users** → Must verify email before login

---

## 🚀 Quick Start (3 Steps)

### Step 1: Configure Supabase (5 minutes)

1. Open your Supabase project dashboard
2. Go to **Authentication** → **Email Templates**
3. Find **"Confirm signup"** template
4. Click **Edit**
5. Set **Redirect URL** to:
   - Development: `http://localhost:3000/auth/verify`
   - Production: `https://yourdomain.com/auth/verify`
6. Go to **Authentication** → **URL Configuration**
7. Add the redirect URL to **Redirect URLs** list
8. Click **Save**

### Step 2: Add Environment Variable

Add to your `.env.local` file:

```bash
# Development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Production (when deploying)
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### Step 3: Test It

```bash
# Start your dev server
npm run dev

# Open browser
# 1. Go to http://localhost:3000/register
# 2. Create an account
# 3. Check your email
# 4. Click verification link
# 5. Login!
```

---

## 📋 What Changed

### New Files Created

```
✨ src/app/api/auth/register/route.ts          (Self-registration endpoint)
✨ src/app/api/auth/resend-verification/route.ts (Resend email endpoint)
✨ src/app/auth/verify/page.tsx                 (Verification success page)
✨ docs/EMAIL_VERIFICATION.md                   (Full documentation)
```

### Existing Files Modified

```
📝 src/app/api/auth/signin/route.ts   (Added email verification check)
📝 src/app/api/auth/signup/route.ts   (Updated documentation)
📝 src/app/register/page.tsx          (Uses new registration endpoint)
📝 src/app/login/page.tsx             (Shows verification errors)
```

---

## 🧪 Testing Scenarios

### ✅ Test 1: Self-Registration (New Flow)

```
1. Navigate to /register
2. Fill: Name, Email, Password
3. Submit form
4. See "Check Your Email" message
5. Open email inbox
6. Click verification link
7. Redirected to /auth/verify
8. See success message
9. Auto-redirect to /login
10. Login with verified account ✓
```

### ✅ Test 2: Unverified Login

```
1. Register new account
2. DON'T click verification link
3. Try to login at /login
4. See error: "Please verify your email address"
5. See yellow box with "Resend verification email" button
6. Click "Resend verification email"
7. Check inbox for new email
8. Click new verification link
9. Login successfully ✓
```

### ✅ Test 3: Admin Creation (Existing Flow - Unchanged)

```
1. Login as admin
2. Create new student account via admin panel
3. Logout
4. Login as new student
5. Login immediately successful (no verification needed) ✓
```

---

## 🔑 Key Endpoints

### For Frontend Developers

| Endpoint                        | Method | Purpose                     | Verified?                |
| ------------------------------- | ------ | --------------------------- | ------------------------ |
| `/api/auth/register`            | POST   | Student self-registration   | ❌ Requires verification |
| `/api/auth/signup`              | POST   | Admin creates student       | ✅ Auto-verified         |
| `/api/auth/signin`              | POST   | Login (checks verification) | Checks status            |
| `/api/auth/resend-verification` | POST   | Resend verification email   | N/A                      |

### Request/Response Examples

**Self-Registration**

```typescript
// Request
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}

// Response (201 Created)
{
  "message": "Registration successful! Please check your email...",
  "requiresVerification": true,
  "user": {
    "id": "uuid",
    "email": "john@example.com"
  }
}
```

**Login (Unverified User)**

```typescript
// Request
POST /api/auth/signin
{
  "email": "john@example.com",
  "password": "SecurePass123"
}

// Response (403 Forbidden)
{
  "error": "Please verify your email address before logging in.",
  "requiresVerification": true,
  "email": "john@example.com"
}
```

**Resend Verification**

```typescript
// Request
POST /api/auth/resend-verification
{
  "email": "john@example.com"
}

// Response (200 OK)
{
  "message": "Verification email sent! Please check your inbox."
}
```

---

## 🐛 Troubleshooting

### Problem: Verification email not received

**Solutions:**

1. Check spam/junk folder
2. Verify Supabase email settings are configured
3. Check Supabase Dashboard → Logs for email errors
4. Click "Resend verification email" button on login page

### Problem: Verification link says "Invalid"

**Solutions:**

1. Link expires after 24 hours - request a new one
2. Verify redirect URL is configured correctly in Supabase
3. Check that `NEXT_PUBLIC_APP_URL` environment variable is set

### Problem: Admin-created users need to verify email

**Solutions:**

1. Make sure you're using `/api/auth/signup` endpoint (not `/api/auth/register`)
2. Verify the request is going through the admin panel
3. Check that `email_confirm: true` is being passed

### Problem: Still getting verification emails for admin-created users

**Solutions:**

1. Admin panel should use `/api/auth/signup` endpoint
2. Check that admin client is being used (not regular client)
3. Verify `email_confirm: true` flag is present

---

## 🔒 Security Features

- ✅ Rate limiting on all endpoints
- ✅ Strong password validation (8+ chars, uppercase, lowercase, number)
- ✅ Email validation (RFC 5322)
- ✅ No user enumeration (resend returns same response)
- ✅ Immediate logout for unverified users
- ✅ Input sanitization
- ✅ HTTPS only in production

---

## 📚 Full Documentation

For detailed information, see:

- **Complete Guide**: `docs/EMAIL_VERIFICATION.md`
- **Implementation Summary**: `docs/IMPLEMENTATION_SUMMARY.md`
- **Supabase Docs**: https://supabase.com/docs/guides/auth

---

## ✨ What's Next?

### Optional Enhancements

- [ ] Auto-create student profile after email verification
- [ ] Send welcome email after successful verification
- [ ] Add password reset flow
- [ ] Add social login (Google, Microsoft) with auto-verification
- [ ] Admin dashboard to manually verify users
- [ ] Track verification metrics

### Before Production Deployment

- [ ] Configure Supabase email templates for production
- [ ] Set production `NEXT_PUBLIC_APP_URL` environment variable
- [ ] Add production redirect URLs to Supabase
- [ ] Test email delivery in production environment
- [ ] Migrate existing users (auto-verify if needed)
- [ ] Set up email monitoring/alerts

---

## 💬 Questions?

Check the full documentation or contact your system administrator.

**Files to reference:**

- Detailed setup: `docs/EMAIL_VERIFICATION.md`
- API changes: `docs/IMPLEMENTATION_SUMMARY.md`
- Supabase auth: https://supabase.com/docs/guides/auth/auth-email

---

**Status**: ✅ Ready to configure and test
**Next Step**: Configure Supabase email settings (Step 1 above)
