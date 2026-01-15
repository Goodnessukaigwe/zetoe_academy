# Email Verification Setup Guide

This document explains the email verification system for student self-registration in the Zetoe Academy application.

## Overview

The application now supports two types of user creation:

1. **Admin-Created Users** (via `/api/auth/signup`)

   - Created by administrators through the admin panel
   - Automatically verified (`email_confirm: true`)
   - Can log in immediately without email verification

2. **Self-Registered Users** (via `/api/auth/register`)
   - Created by students through the public registration page
   - Require email verification before login
   - Receive verification email with activation link

## Architecture

### API Routes

#### 1. `/api/auth/register` - Self-Registration

- **Method**: POST
- **Purpose**: Student self-registration with email verification
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Registration successful! Please check your email to verify your account.",
    "requiresVerification": true,
    "user": {
      "id": "uuid",
      "email": "john@example.com"
    }
  }
  ```
- **Behavior**:
  - Uses regular Supabase client (not admin client)
  - Triggers automatic verification email from Supabase
  - User cannot log in until email is verified

#### 2. `/api/auth/signup` - Admin User Creation

- **Method**: POST
- **Purpose**: Admin creates student accounts (auto-verified)
- **Request Body**:
  ```json
  {
    "name": "Jane Smith",
    "email": "jane@example.com",
    "password": "TempPass123",
    "role": "student"
  }
  ```
- **Behavior**:
  - Uses admin client with `email_confirm: true`
  - User can log in immediately
  - Creates student profile in database

#### 3. `/api/auth/resend-verification` - Resend Verification Email

- **Method**: POST
- **Purpose**: Resend verification email to unverified users
- **Request Body**:
  ```json
  {
    "email": "john@example.com"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Verification email sent! Please check your inbox."
  }
  ```
- **Security**: Doesn't reveal whether email exists (same response for all cases)

#### 4. `/api/auth/signin` - Login (Updated)

- **Method**: POST
- **Purpose**: User authentication with email verification check
- **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "SecurePass123"
  }
  ```
- **Success Response** (verified user):
  ```json
  {
    "message": "Signed in successfully",
    "user": {
      /* user object */
    },
    "session": {
      /* session object */
    }
  }
  ```
- **Error Response** (unverified user):
  ```json
  {
    "error": "Please verify your email address before logging in.",
    "requiresVerification": true,
    "email": "john@example.com"
  }
  ```
- **Behavior**:
  - Checks `email_confirmed_at` field after successful password authentication
  - Immediately signs out unverified users
  - Returns 403 status for unverified accounts

### Frontend Pages

#### 1. `/register` - Registration Page

- **File**: `src/app/register/page.tsx`
- **Features**:
  - Name, email, password, and confirm password fields
  - Real-time password validation
  - Success view with "Check Your Email" message
  - Error handling with user-friendly messages
  - Link to login page

#### 2. `/login` - Login Page (Updated)

- **File**: `src/app/login/page.tsx`
- **New Features**:
  - Email verification error display
  - "Resend verification email" button
  - Success message after resending email
  - Clear instructions for unverified users

#### 3. `/auth/verify` - Email Verification Callback

- **File**: `src/app/auth/verify/page.tsx`
- **Purpose**: Handle email verification link clicks
- **Features**:
  - Extracts access token from URL hash
  - Shows loading state during verification
  - Success confirmation with redirect to login
  - Error handling for invalid/expired links
  - Auto-redirect to login after 3 seconds

## User Flow

### Self-Registration Flow

1. User visits `/register`
2. Fills out registration form (name, email, password)
3. Submits form → POST to `/api/auth/register`
4. Success page shows "Check Your Email" message
5. User receives verification email from Supabase
6. Clicks verification link in email
7. Redirected to `/auth/verify`
8. Email verified → Auto-redirect to `/login`
9. User logs in with verified account

### Failed Login Flow (Unverified)

1. Unverified user attempts to log in
2. Password authentication succeeds
3. System checks `email_confirmed_at` field
4. User immediately signed out
5. Error message displayed: "Please verify your email address"
6. "Resend verification email" button appears
7. User clicks resend → POST to `/api/auth/resend-verification`
8. New verification email sent
9. User clicks link and verifies email
10. User logs in successfully

### Admin User Creation Flow

1. Admin creates user via admin panel
2. POST to `/api/auth/signup` with `email_confirm: true`
3. User account created and auto-verified
4. Student profile created in database
5. User can log in immediately (no verification needed)

## Supabase Configuration

### Required Settings

Configure these settings in your Supabase Dashboard:

1. **Email Templates** (Authentication → Email Templates)

   - Enable email confirmations
   - Customize "Confirm signup" template
   - Set redirect URL to: `https://yourdomain.com/auth/verify`

2. **Email Auth Settings** (Authentication → Providers → Email)

   - Enable email provider
   - Enable "Confirm email"
   - Set "Confirm email" to required

3. **URL Configuration** (Authentication → URL Configuration)

   - Site URL: `https://yourdomain.com`
   - Redirect URLs: Add `https://yourdomain.com/auth/verify`

4. **Environment Variables**
   Add to your `.env.local`:
   ```bash
   NEXT_PUBLIC_APP_URL=http://localhost:3000  # Development
   # or
   NEXT_PUBLIC_APP_URL=https://yourdomain.com  # Production
   ```

### Email Template Customization

Example "Confirm signup" email template:

```html
<h2>Confirm your email</h2>
<p>Welcome to Zetoe Academy!</p>
<p>Click the link below to verify your email address:</p>
<p><a href="{{ .ConfirmationURL }}">Verify Email</a></p>
<p>If you didn't create an account, you can safely ignore this email.</p>
```

## Security Considerations

### Rate Limiting

All authentication endpoints use rate limiting:

- **Registration**: `RateLimitPresets.AUTH` (5 requests per 15 minutes)
- **Login**: `RateLimitPresets.AUTH` (5 requests per 15 minutes)
- **Resend Verification**: `RateLimitPresets.EMAIL` (3 requests per hour)

### Password Validation

Enforced password requirements:

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

### Email Validation

- RFC 5322 compliant email validation
- Sanitized input to prevent XSS
- Case-insensitive email comparison

### Security Features

1. **No User Enumeration**: Resend verification returns same response regardless of email existence
2. **Immediate Logout**: Unverified users are signed out after login attempt
3. **Token Expiration**: Verification links expire after 24 hours (Supabase default)
4. **HTTPS Only**: Verification links only work over HTTPS in production
5. **Input Sanitization**: All user inputs sanitized before storage

## Testing

### Test Self-Registration

1. Navigate to `/register`
2. Fill out form with test email
3. Check email inbox for verification link
4. Click verification link
5. Verify redirect to `/auth/verify` shows success
6. Log in with verified account

### Test Unverified Login

1. Register new account
2. Don't click verification link
3. Attempt to log in
4. Verify error message appears
5. Click "Resend verification email"
6. Check inbox for new email
7. Verify with new link
8. Log in successfully

### Test Admin Creation

1. Log in as admin
2. Create new student account
3. Log out
4. Log in as new student (no verification needed)
5. Verify immediate access

## Troubleshooting

### Verification Email Not Received

1. Check spam/junk folder
2. Verify Supabase email provider is configured
3. Check Supabase logs for email errors
4. Verify email service (SendGrid, etc.) is set up
5. Use "Resend verification email" button

### Verification Link Invalid

1. Check if link has expired (24 hours default)
2. Request new verification email
3. Verify redirect URL is correctly configured
4. Check browser console for errors

### User Can't Login After Verification

1. Verify `email_confirmed_at` is set in database
2. Check browser cookies are enabled
3. Clear browser cache and retry
4. Check Supabase Auth logs for errors

### Admin-Created Users Need Verification

1. Verify using `/api/auth/signup` endpoint (not `/api/auth/register`)
2. Check admin client is initialized correctly
3. Verify `email_confirm: true` is set

## Database Schema

### Auth Users Table (Supabase Managed)

Relevant fields:

- `id`: UUID (primary key)
- `email`: string (unique)
- `email_confirmed_at`: timestamp (null if unverified)
- `created_at`: timestamp
- `updated_at`: timestamp

### Students Table (Application Managed)

Created by admin signup endpoint:

- `id`: UUID (primary key, references auth.users)
- `name`: string
- `email`: string (unique)
- `created_at`: timestamp
- `updated_at`: timestamp

**Note**: Self-registered users don't automatically get student profiles. You may want to add a trigger or update the flow to create profiles after verification.

## Future Enhancements

Potential improvements:

1. **Profile Creation Trigger**: Auto-create student profile after email verification
2. **Welcome Email**: Send welcome email after successful verification
3. **Password Reset**: Add "Forgot Password" flow
4. **Email Change**: Allow users to change email with re-verification
5. **Social OAuth**: Add Google/Microsoft login with auto-verification
6. **Admin Override**: Allow admins to manually verify users
7. **Verification Metrics**: Track verification rates and times
8. **Custom Email Service**: Use SendGrid/Mailgun for branded emails

## Migration Guide

If you have existing users created before email verification was implemented:

```sql
-- Option 1: Verify all existing users
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email_confirmed_at IS NULL;

-- Option 2: Verify specific users
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email IN ('user1@example.com', 'user2@example.com');

-- Option 3: Send verification emails to unverified users
-- Use the resend-verification endpoint programmatically
```

## Support

For issues or questions:

1. Check Supabase Auth documentation
2. Review application logs (`logger` output)
3. Check Supabase dashboard for auth errors
4. Contact system administrator

## Related Files

- API Routes:

  - `src/app/api/auth/register/route.ts`
  - `src/app/api/auth/signup/route.ts`
  - `src/app/api/auth/signin/route.ts`
  - `src/app/api/auth/resend-verification/route.ts`

- Frontend Pages:

  - `src/app/register/page.tsx`
  - `src/app/login/page.tsx`
  - `src/app/auth/verify/page.tsx`

- Libraries:
  - `src/lib/supabase/server.ts` (Supabase client)
  - `src/lib/supabase/admin.ts` (Admin client)
  - `src/lib/validation.ts` (Email/password validation)
  - `src/lib/rate-limit.ts` (Rate limiting)
  - `src/lib/logger.ts` (Logging)
