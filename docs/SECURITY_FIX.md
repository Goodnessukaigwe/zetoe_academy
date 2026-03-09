# 🔐 SECURITY: Fixing Exposed Supabase Credentials

## Issue

Supabase service role keys were hardcoded in JavaScript files and committed to GitHub.

## ✅ Fixed Files

- `scripts/check-and-fix-database.js`
- `scripts/apply-fix.js`
- `scripts/check-students.js`

All now use environment variables instead of hardcoded credentials.

## 📋 Setup Instructions

### 1. Install dotenv (if not already installed)

```bash
npm install dotenv
```

### 2. Create `.env.local` file

Create a file called `.env.local` in the root directory with your NEW rotated credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://rveanmxnevtzcehcggxz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-new-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-new-service-role-key
```

### 3. CRITICAL: Rotate Your Credentials

⚠️ **DO THIS IMMEDIATELY:**

1. Go to [Supabase Dashboard](https://app.supabase.com/project/rveanmxnevtzcehcggxz/settings/api)
2. Click "Reset service_role key"
3. Update your `.env.local` file with the new key

### 4. Clean Git History

The old credentials are still in your Git history. Remove them:

#### Option A: BFG Repo-Cleaner (Recommended)

```bash
# Install BFG
# On macOS: brew install bfg
# On Linux: Download from https://rtyley.github.io/bfg-repo-cleaner/

# Clone a fresh copy (if needed)
git clone --mirror https://github.com/YOUR_USERNAME/zetoe_academy.git

# Replace secrets
bfg --replace-text passwords.txt zetoe_academy.git
cd zetoe_academy.git
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Force push
git push --force
```

Create `passwords.txt` with:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2ZWFubXhuZXZ0emNlaGNnZ3h6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDk4MTk2OSwiZXhwIjoyMDc2NTU3OTY5fQ.9BzQRuVj7HVs0k7Wu7aKm9GuVMsGhzmDpgukOoQqVwY
```

#### Option B: git-filter-repo

```bash
# Install git-filter-repo
pip install git-filter-repo

# Remove sensitive data
git filter-repo --replace-text <(echo 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2ZWFubXhuZXZ0emNlaGNnZ3h6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDk4MTk2OSwiZXhwIjoyMDc2NTU3OTY5fQ.9BzQRuVj7HVs0k7Wu7aKm9GuVMsGhzmDpgukOoQqVwY==>[REDACTED]')

# Force push
git push origin --force --all
```

### 5. Verify `.gitignore`

Already configured ✅ - `.env*` is in `.gitignore`

### 6. Update Team Members

If others work on this project:

```bash
# They need to pull the cleaned history
git fetch origin
git reset --hard origin/main

# And create their own .env.local file
```

## 🛡️ Security Best Practices

### Never Commit:

- ❌ `.env`, `.env.local`, `.env.production`
- ❌ Any file with API keys, passwords, or tokens
- ❌ Service role keys (full database access)

### Always Use:

- ✅ Environment variables
- ✅ `.env.example` template files (without actual secrets)
- ✅ `.gitignore` for all environment files

### For Scripts:

```javascript
require("dotenv").config({ path: ".env.local" });
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
```

### For Next.js Client:

```javascript
// Only NEXT_PUBLIC_* variables are exposed to the browser
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
```

### For Server Components/API Routes:

```javascript
// Can use non-public variables
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
```

## 🔍 GitHub Secret Scanning

GitHub likely detected your exposed secret. After rotating:

1. Go to your repo → Security → Secret scanning alerts
2. Mark the alert as "Revoked" (since you rotated the key)

## 📚 Additional Tools

### Pre-commit Hook (Prevent Future Leaks)

```bash
# Install gitleaks
brew install gitleaks  # macOS
# or download from: https://github.com/gitleaks/gitleaks

# Add to .git/hooks/pre-commit
#!/bin/sh
gitleaks protect --staged --verbose
```

### Environment Variable Validation

Add to your scripts:

```javascript
function validateEnv() {
  const required = ["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.error("❌ Missing environment variables:", missing.join(", "));
    process.exit(1);
  }
}
```

## ⚠️ What Was Exposed

- **Service Role Key**: Full database access (read, write, delete)
- **Supabase URL**: Your project identifier
- **Project ID**: `rveanmxnevtzcehcggxz`

## ✅ Checklist

- [ ] Rotate service_role key in Supabase dashboard
- [ ] Update `.env.local` with new credentials
- [ ] Install `dotenv`: `npm install dotenv`
- [ ] Commit fixed scripts to Git
- [ ] Clean Git history with BFG or git-filter-repo
- [ ] Force push cleaned history
- [ ] Mark GitHub security alert as "Revoked"
- [ ] Notify team members to pull fresh history
- [ ] Consider adding pre-commit hooks

## 📖 Resources

- [Supabase Security Best Practices](https://supabase.com/docs/guides/auth/managing-user-data)
- [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/)
- [GitHub: Removing sensitive data](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
- [Gitleaks - Secret Scanner](https://github.com/gitleaks/gitleaks)
