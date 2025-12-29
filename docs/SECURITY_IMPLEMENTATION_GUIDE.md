# 🔧 Security Fixes Implementation Guide

This guide provides step-by-step instructions for implementing the security fixes identified in the production readiness audit.

---

## 📋 Quick Start

### Priority 1: Critical Security Fixes (Must Implement First)

1. **Password & Email Validation**
2. **Rate Limiting on Auth Routes**
3. **Security Headers** ✅ Already implemented in `next.config.ts`
4. **Replace console.log with logger**

---

## 🛠️ Step-by-Step Implementation

### Step 1: Update Signup Route

**File:** `/src/app/api/auth/signup/route.ts`

Add these imports at the top:

```typescript
import {
  validateEmail,
  validatePassword,
  sanitizeString,
} from "@/lib/validation";
import {
  rateLimit,
  RateLimitPresets,
  createRateLimitResponse,
} from "@/lib/rate-limit";
import { logger } from "@/lib/logger";
```

Add rate limiting at the start of the POST function (after try {):

```typescript
// Apply rate limiting
const rateLimitResult = rateLimit(request, RateLimitPresets.AUTH);

if (rateLimitResult.limited) {
  logger.warn("Rate limit exceeded for signup attempt");
  return createRateLimitResponse(rateLimitResult);
}
```

Replace email validation:

```typescript
// OLD CODE (line ~15):
if (!email || !password || !name) {
  return NextResponse.json(
    { error: "Email, password, and name are required" },
    { status: 400 }
  );
}

// NEW CODE:
const emailValidation = validateEmail(email);
if (!emailValidation.valid) {
  return NextResponse.json({ error: emailValidation.error }, { status: 400 });
}

const passwordValidation = validatePassword(password);
if (!passwordValidation.valid) {
  return NextResponse.json(
    { error: passwordValidation.error },
    { status: 400 }
  );
}

if (!name || name.trim().length === 0) {
  return NextResponse.json({ error: "Name is required" }, { status: 400 });
}

if (name.length > 100) {
  return NextResponse.json(
    { error: "Name must be less than 100 characters" },
    { status: 400 }
  );
}

const sanitizedName = sanitizeString(name, 100);
```

Update auth user creation to use sanitizedName:

```typescript
// Line ~28
const { data: authData, error: authError } =
  await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      name: sanitizedName, // Changed from 'name' to 'sanitizedName'
    },
  });
```

Update student profile insertion:

```typescript
// Line ~50
const { error: profileError } = await adminClient.from("students").insert({
  user_id: authData.user.id,
  name: sanitizedName, // Changed from 'name' to 'sanitizedName'
  email,
  payment_status: "unpaid",
});
```

Replace console.error with logger:

```typescript
// OLD: console.error('Student profile creation error:', profileError)
// NEW:
logger.error("Student profile creation error", profileError);

// OLD: console.error('Signup error:', error)
// NEW:
logger.error("Signup error", error);
```

---

### Step 2: Update Signin Route

**File:** `/src/app/api/auth/signin/route.ts`

Add these imports:

```typescript
import { validateEmail } from "@/lib/validation";
import {
  rateLimit,
  RateLimitPresets,
  createRateLimitResponse,
} from "@/lib/rate-limit";
import { logger } from "@/lib/logger";
```

Add rate limiting:

```typescript
// After try {
const rateLimitResult = rateLimit(request, RateLimitPresets.AUTH);

if (rateLimitResult.limited) {
  logger.warn("Rate limit exceeded for signin attempt");
  return createRateLimitResponse(rateLimitResult);
}
```

Add email validation:

```typescript
// After getting email and password
const emailValidation = validateEmail(email);
if (!emailValidation.valid) {
  return NextResponse.json({ error: emailValidation.error }, { status: 400 });
}

if (!password) {
  return NextResponse.json({ error: "Password is required" }, { status: 400 });
}
```

Replace console.error:

```typescript
// OLD: console.error('Signin error:', error)
// NEW:
logger.error("Signin error", error);
```

---

### Step 3: Update Exam Routes

**File:** `/src/app/api/exams/[id]/route.ts`

Replace console.error:

```typescript
// Add import
import { logger } from "@/lib/logger";

// Replace
// OLD: console.error('Get exam error:', error)
// NEW:
logger.error("Get exam error", error);
```

**File:** `/src/app/api/exams/submit/route.ts`

Replace console.error:

```typescript
// Add import
import { logger } from "@/lib/logger";

// Replace
// OLD: console.error('Submit exam error:', error)
// NEW:
logger.error("Submit exam error", error);
```

---

### Step 4: Update Frontend Files

**File:** `/src/app/login/page.tsx`

Replace console.log and console.error:

```typescript
// Add import at top
import { logger } from "@/lib/logger";

// Replace
// OLD: console.log('Login response:', data)
// NEW:
logger.log("Login response", { context: { success: res.ok } });

// OLD: console.error('Login error:', err)
// NEW:
logger.error("Login error", err);
```

**File:** `/src/app/dashboard/page.tsx`

```typescript
// Add import
import { logger } from "@/lib/logger";

// Replace all console.log and console.error
// OLD: console.log('Me endpoint response:', meData)
// NEW:
logger.log("Me endpoint response", { context: { role: meData.role } });

// OLD: console.error('Auth check failed:', meData)
// NEW:
logger.error("Auth check failed", new Error(meData.error));

// OLD: console.error('Error fetching data:', err)
// NEW:
logger.error("Error fetching data", err);
```

**File:** `/src/app/exam/[id]/page.tsx`

```typescript
// Add import
import { logger } from "@/lib/logger";

// Replace
// OLD: console.error('Error verifying code:', err)
// NEW:
logger.error("Error verifying access code", err);

// OLD: console.error('Error fetching exam:', err)
// NEW:
logger.error("Error fetching exam", err);

// OLD: console.error('Error submitting exam:', err)
// NEW:
logger.error("Error submitting exam", err);
```

---

### Step 5: Update All Other API Routes

For each API route file in `/src/app/api/`:

1. Add logger import:

```typescript
import { logger } from "@/lib/logger";
```

2. Replace all console.error with logger.error:

```typescript
// OLD:
console.error("Some error:", error);

// NEW:
logger.error("Some error", error);
```

3. Consider adding rate limiting to sensitive endpoints:

```typescript
import {
  rateLimit,
  RateLimitPresets,
  createRateLimitResponse,
} from "@/lib/rate-limit";

// At start of handler
const rateLimitResult = rateLimit(request, RateLimitPresets.API);
if (rateLimitResult.limited) {
  return createRateLimitResponse(rateLimitResult);
}
```

---

### Step 6: Remove Debug Logs from Production

**File:** `/src/lib/auth.ts`

Remove or comment out these debug logs:

```typescript
// Lines 146, 155, 168, 174
// DELETE or wrap in logger.debug():
// console.log('Getting role for user:', userId)
// console.log('Admin check:', { adminData, adminError })
// console.log('Student check:', { studentData, studentError })
// console.log('No role found for user:', userId)
```

---

## 🧪 Testing Your Changes

### Test Password Validation

1. Try to register with weak password: `"123"` → Should fail
2. Try to register with no uppercase: `"password123"` → Should fail
3. Try to register with valid password: `"Test1234"` → Should succeed

### Test Email Validation

1. Try to register with invalid email: `"notanemail"` → Should fail
2. Try to register with valid email: `"test@example.com"` → Should succeed

### Test Rate Limiting

1. Make 6 rapid signin requests → 6th should be rate limited (429 error)
2. Wait 1 minute → Should be able to login again

### Test Logger

1. Start dev server: `npm run dev`
   - Console logs should appear
2. Build and start production: `npm run build && npm start`
   - Console logs should NOT appear (except errors/warnings)

---

## 📊 Verification Checklist

After implementing all fixes, verify:

- [ ] Password validation works (min 8 chars, uppercase, lowercase, numbers)
- [ ] Email validation works (proper email format)
- [ ] Rate limiting works on signin/signup (5 attempts per minute)
- [ ] Security headers are present (check browser devtools → Network)
- [ ] No console.log in production build
- [ ] Errors are logged to console in development
- [ ] Input sanitization works (test with `<script>alert('xss')</script>` in name field)

---

## 🚀 Additional Recommendations

### 1. Add Environment Variable Validation

Create `/src/lib/env-check.ts`:

```typescript
export function validateEnv() {
  const required = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }
}
```

Call it in your root layout or a server component.

### 2. Add Request Timeouts to Frontend

```typescript
// Create utility function
export async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout = 10000
) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

// Use instead of fetch
const res = await fetchWithTimeout("/api/auth/signin", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});
```

### 3. Monitor Error Rates

Set up error monitoring:

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

---

## ❓ FAQ

**Q: Will rate limiting affect legitimate users?**  
A: No. The limits are generous (5 login attempts per minute). Normal users won't hit this.

**Q: Does password validation apply to existing users?**  
A: No. Only new signups. Consider adding password strength meter and encouraging existing users to update.

**Q: Will sanitization break special characters in names?**  
A: No. It only escapes HTML characters. Names like "O'Brien" will work fine.

**Q: Do I need Redis for rate limiting?**  
A: Not for small-medium apps. In-memory is fine. For large scale, use Redis or Upstash.

---

## 📞 Support

If you encounter issues:

1. Check error messages in development console
2. Verify all imports are correct
3. Restart dev server after adding new files
4. Check TypeScript errors: `npm run build`

**Reference Files:**

- See `EXAMPLE_SECURE_SIGNIN_ROUTE.ts` for complete signin implementation
- See `EXAMPLE_SECURE_SIGNUP_ROUTE.ts` for complete signup implementation
- See `PRODUCTION_READINESS_AUDIT.md` for detailed security analysis

---

Last Updated: November 24, 2025
