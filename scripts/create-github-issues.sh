#!/bin/bash

# Script to create GitHub issues from GITHUB_ISSUES.md
# Usage: ./scripts/create-github-issues.sh

# Requires GitHub CLI (gh) to be installed and authenticated
# Install: https://cli.github.com/
# Authenticate: gh auth login

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  Creating GitHub Issues for Zetoe Academy${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Check if gh is installed
if ! command -v gh &> /dev/null; then
    echo -e "${RED}❌ GitHub CLI (gh) is not installed.${NC}"
    echo ""
    echo "Please install it first:"
    echo "  macOS:   brew install gh"
    echo "  Linux:   https://cli.github.com/"
    echo "  Windows: winget install --id GitHub.cli"
    exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo -e "${RED}❌ Not authenticated with GitHub CLI.${NC}"
    echo ""
    echo "Please authenticate first:"
    echo "  gh auth login"
    exit 1
fi

# Confirm before creating issues
echo -e "${YELLOW}This will create 22 GitHub issues in the repository.${NC}"
echo ""
read -p "Do you want to continue? (y/N): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Cancelled.${NC}"
    exit 0
fi

echo ""
echo -e "${BLUE}Creating issues...${NC}"
echo ""

# Create labels if they don't exist
echo -e "${YELLOW}Ensuring labels exist...${NC}"
labels=("security" "critical" "bug" "database" "enhancement" "ui/ux" "mobile" "performance" "code-quality" "testing" "documentation" "typescript" "observability" "feature" "deployment" "cleanup" "quality")

for label in "${labels[@]}"; do
    gh label create "$label" --force 2>/dev/null || true
done
echo -e "${GREEN}✓ Labels ready${NC}"
echo ""

# Function to create issue
create_issue() {
    local title="$1"
    local body="$2"
    local labels="$3"
    
    echo -e "${YELLOW}Creating:${NC} $title"
    
    # Try to create issue, capture output
    if output=$(gh issue create --title "$title" --body "$body" --label "$labels" 2>&1); then
        issue_num=$(echo "$output" | grep -oP 'issues/\K\d+' | tail -1)
        echo -e "${GREEN}✓ Created #$issue_num${NC}"
    else
        echo -e "${RED}✗ Failed: $output${NC}"
    fi
    
    # Small delay to avoid rate limiting
    sleep 1
}

# ============================================
# CRITICAL ISSUES
# ============================================

create_issue \
  "🔴 Security: Environment Variables Exposed in Repository" \
  "**Priority:** 🔴 CRITICAL  

**Description:**
The \`.env.local\` file containing sensitive credentials (Supabase service role key) may have been committed to the repository.

**Steps to Reproduce:**
1. Check git history for \`.env.local\`
2. Search for exposed API keys

**Expected Behavior:**
- \`.env.local\` should never be committed
- Credentials should be rotated if exposed
- \`.gitignore\` should prevent this

**Action Items:**
- [ ] Check if \`.env.local\` is in git history
- [ ] Rotate Supabase service role key if exposed
- [ ] Verify .gitignore includes \`.env.local\`
- [ ] Add environment variable validation on startup
- [ ] Document environment setup in README

**Resources:**
- [Supabase Dashboard](https://app.supabase.com/project/rveanmxnevtzcehcggxz/settings/api)
- Rotate keys in Settings → API

See \`GITHUB_ISSUES.md\` for full details." \
  "security,critical"

create_issue \
  "🔴 Infinite Recursion in Admin RLS Policies" \
  "**Priority:** 🔴 CRITICAL  

**Description:**
The \`admins\` table RLS policies cause infinite recursion when querying, resulting in error: \"infinite recursion detected in policy for relation 'admins'\"

**Current Behavior:**
\`\`\`sql
-- This causes recursion:
EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid())
\`\`\`

**Expected Behavior:**
- Admins should be able to query without recursion errors
- Policies should use direct user_id checks

**Solution:**
Apply the fix in \`supabase/fix-rls-policies.sql\`

**Action Items:**
- [ ] Run \`supabase/fix-rls-policies.sql\` in Supabase SQL Editor
- [ ] Test admin login after applying fix
- [ ] Verify super-admin dashboard loads correctly
- [ ] Document RLS policy patterns for future tables

**Files:**
- \`supabase/fix-rls-policies.sql\`
- \`FIXING_RLS_POLICIES.md\`

See \`GITHUB_ISSUES.md\` for full details." \
  "bug,database,security,critical"

# ============================================
# HIGH PRIORITY ISSUES
# ============================================

create_issue \
  "🟠 Mobile Responsiveness: Admin Dashboards" \
  "**Priority:** 🟠 HIGH  

**Description:**
Admin and Super-Admin dashboards are not optimized for mobile devices. Tables overflow, sidebar doesn't collapse, and forms are cramped on small screens.

**Affected Pages:**
- \`/admin-dashboard\`
- \`/super-admin-dashboard\`
- \`/student-management\`

**Current Issues:**
- ❌ Tables require horizontal scroll on mobile
- ❌ Sidebar navigation not responsive
- ❌ Stats cards don't stack properly
- ❌ Action buttons overlap on small screens

**Expected Behavior:**
- Tables should be horizontally scrollable with clear indicators
- Sidebar should collapse to hamburger menu on mobile
- Stats cards should stack vertically on mobile (\`grid-cols-1 md:grid-cols-2 lg:grid-cols-4\`)
- Buttons should stack or reduce size appropriately

**Action Items:**
- [ ] Add responsive breakpoints to admin dashboard layout
- [ ] Implement collapsible sidebar for mobile
- [ ] Make tables scrollable with overflow indicators
- [ ] Test on mobile devices (iPhone, Android)
- [ ] Add responsive grid to stats cards

See \`GITHUB_ISSUES.md\` for full details." \
  "enhancement,ui/ux,mobile"

create_issue \
  "🟠 Mobile Responsiveness: Landing & Marketing Pages" \
  "**Priority:** 🟠 HIGH  

**Description:**
Landing page, About page, and Contact page lack responsive design breakpoints.

**Affected Pages:**
- \`/\` (Landing page)
- \`/about\`
- \`/contact\`

**Current Issues:**
- ❌ No \`sm:\`, \`md:\`, \`lg:\` Tailwind breakpoints
- ❌ Images not optimized (using \`<img>\` instead of \`<Image />\`)
- ❌ Fixed layouts break on mobile
- ❌ Text may overflow on small screens

**Expected Behavior:**
- Hero sections should stack on mobile
- Images should be responsive and optimized
- Navigation should collapse to hamburger menu
- Text should be readable on all screen sizes

**Action Items:**
- [ ] Add Tailwind responsive breakpoints
- [ ] Replace \`<img>\` with Next.js \`<Image />\`
- [ ] Implement responsive navigation
- [ ] Test on mobile/tablet/desktop
- [ ] Optimize image sizes

See \`GITHUB_ISSUES.md\` for full details." \
  "enhancement,ui/ux,mobile"

create_issue \
  "🟠 Image Optimization: Replace <img> with Next.js <Image />" \
  "**Priority:** 🟠 HIGH  

**Description:**
The app uses native \`<img>\` tags instead of Next.js \`<Image />\` component, resulting in slower loading times and higher bandwidth usage.

**Affected Files:**
- \`src/app/page.tsx\` (2 instances)
- \`src/app/about/page.tsx\` (4 instances)
- \`src/app/contact/page.tsx\` (4 instances)
- \`src/app/courses/[id]/page.tsx\` (5 instances)
- \`src/component/HeroSlider.tsx\` (1 instance)
- Others...

**Benefits of Using \`<Image />\`:**
- ✅ Automatic image optimization
- ✅ Lazy loading
- ✅ Responsive images
- ✅ Better Core Web Vitals (LCP)
- ✅ Automatic WebP conversion

**Example:**
\`\`\`typescript
// Before
<img src=\"/images/hero.jpg\" alt=\"Hero\" />

// After
import Image from 'next/image'
<Image src=\"/images/hero.jpg\" alt=\"Hero\" width={1200} height={600} priority />
\`\`\`

**Action Items:**
- [ ] Replace all \`<img>\` with \`<Image />\` from \`next/image\`
- [ ] Add \`width\` and \`height\` props
- [ ] Use \`priority\` for above-the-fold images
- [ ] Test image loading performance
- [ ] Configure \`next.config.ts\` for external images if needed

See \`GITHUB_ISSUES.md\` for implementation details." \
  "performance,enhancement"

create_issue \
  "🟠 Build Errors: Missing Icon Imports and Invalid Links" \
  "**Priority:** 🟠 HIGH  

**Description:**
Vercel deployment fails due to ESLint errors in production build.

**Errors:**
1. **\`src/app/register/page.tsx\`**: Missing \`Eye\` and \`EyeOff\` imports from lucide-react
2. **\`src/app/page.tsx\`**: Using \`<a href=\"/\">\` instead of \`<Link />\` for internal navigation
3. **\`src/app/courses/[id]/page.tsx\`**: Using \`<a href=\"/courses/id\">\` instead of \`<Link />\`

**Action Items:**
- [x] Import Eye and EyeOff icons in register page
- [x] Replace \`<a>\` tags with Next.js \`<Link />\` or use \`#\` for placeholder links
- [ ] Run \`npm run build\` locally to verify fixes
- [ ] Test deployment on Vercel

**Status:** ✅ FIXED - Changes have been committed." \
  "bug,deployment,critical"

# ============================================
# MEDIUM PRIORITY ISSUES
# ============================================

create_issue \
  "🟡 React Hooks: Missing Dependencies in useEffect" \
  "**Priority:** 🟡 MEDIUM  

**Description:**
Multiple components have \`useEffect\` hooks with missing dependencies, which can cause stale closures and unexpected behavior.

**Affected Files:**
- \`src/app/admin-dashboard/page.tsx\` (line 26)
- \`src/app/dashboard/page.tsx\` (line 50)
- \`src/app/exam/[id]/page.tsx\` (lines 51, 109)
- \`src/app/exam/[id]/results/page.tsx\` (line 35)
- \`src/app/student-management/page.tsx\` (line 22)
- Others...

**Solutions:**
See \`GITHUB_ISSUES.md\` for three solution patterns:
1. Add dependency
2. Use useCallback
3. Move function inside useEffect

**Action Items:**
- [ ] Review all \`useEffect\` warnings
- [ ] Choose appropriate solution for each case
- [ ] Test that data fetching still works correctly
- [ ] Add ESLint rule enforcement" \
  "bug,code-quality"

create_issue \
  "🟡 Code Cleanup: Remove Unused Variables and Imports" \
  "**Priority:** 🟡 MEDIUM  

**Description:**
Multiple files have unused variables and imports that should be removed to improve code quality.

**Affected Files:**
- \`src/app/SuperAdminDashboard/sidebar.tsx\` - \`Menu\` unused
- \`src/app/api/auth/signup/route.ts\` - \`supabase\` unused
- \`src/app/api/exams/route.ts\` - \`getUserRole\` unused
- \`src/app/api/scores/route.ts\` - \`isAdmin\` unused
- \`src/app/courses/[id]/page.tsx\` - \`router\` unused
- \`src/app/dashboard/page.tsx\` - \`LogOut\`, \`handleLogout\` unused
- \`src/lib/auth.ts\` - \`adminError\`, \`studentError\` unused
- \`src/lib/logger.ts\` - \`level\`, \`message\`, \`context\` unused
- Others...

**Action Items:**
- [ ] Remove unused imports
- [ ] Remove unused variables
- [ ] Run ESLint and fix all warnings
- [ ] Configure IDE to highlight unused code
- [ ] Consider enabling \`\"noUnusedLocals\": true\` in \`tsconfig.json\`

See \`GITHUB_ISSUES.md\` for full list." \
  "code-quality,cleanup"

create_issue \
  "🟡 Security: Server-Side Exam Timer Validation" \
  "**Priority:** 🟡 MEDIUM  

**Description:**
The exam timer is client-side only, which means students can manipulate the timer by pausing JavaScript, editing browser storage, or using dev tools.

**Security Risk:**
Students could extend exam time by:
- Pausing browser execution
- Editing localStorage
- Using browser dev tools
- Refreshing the page

**Proposed Solution:**
1. Create \`exam_sessions\` table
2. Record start time on server when student begins exam
3. Validate submission time server-side
4. Reject submissions after deadline

**API Changes Needed:**
- \`POST /api/exams/start\` - Record exam start time
- \`POST /api/exams/submit\` - Validate time before accepting

**Action Items:**
- [ ] Create \`exam_sessions\` table in database
- [ ] Add \`/api/exams/start\` endpoint
- [ ] Update exam page to record start time
- [ ] Add server-side time validation in submit endpoint
- [ ] Handle edge cases (network issues, browser crashes)
- [ ] Add grace period (e.g., 30 seconds) for submission

See \`GITHUB_ISSUES.md\` for database schema and implementation details." \
  "security,enhancement"

create_issue \
  "🟡 Observability: Error Monitoring and Logging" \
  "**Priority:** 🟡 MEDIUM  

**Description:**
While the app has a logger utility, there's no error monitoring service configured for production.

**Current State:**
- \`src/lib/logger.ts\` exists but doesn't send to monitoring service
- \`sendToMonitoring()\` function is empty
- No way to track production errors

**Recommended Solutions:**
- **Sentry** (Most Popular): \`npm install @sentry/nextjs\`
- **LogRocket**: \`npm install logrocket\`
- **Datadog**: \`npm install @datadog/browser-rum\`

**Action Items:**
- [ ] Choose error monitoring service
- [ ] Set up account and get API keys
- [ ] Implement \`sendToMonitoring()\` in logger
- [ ] Add source maps for better error tracking
- [ ] Configure error filtering (exclude 404s, etc.)
- [ ] Set up alerts for critical errors
- [ ] Test error reporting in production

See \`GITHUB_ISSUES.md\` for implementation examples." \
  "enhancement,observability"

# ============================================
# LOW PRIORITY ISSUES
# ============================================

create_issue \
  "🟢 TypeScript: Avoid 'any' Types" \
  "**Priority:** 🟢 LOW  

**Description:**
Several files use \`any\` type which defeats the purpose of TypeScript's type safety.

**Affected Patterns:**
\`\`\`typescript
catch (error: any)  // Should be: catch (error: unknown)
res: any           // Should be: res: Response
\`\`\`

**Better Pattern:**
\`\`\`typescript
try {
  // ...
} catch (error) {
  if (error instanceof Error) {
    logger.error('Message', error)
  } else {
    logger.error('Message', new Error(String(error)))
  }
}
\`\`\`

**Action Items:**
- [ ] Replace \`any\` with proper types
- [ ] Use \`unknown\` for catch blocks
- [ ] Add type guards where needed
- [ ] Enable \`\"noImplicitAny\": true\` in tsconfig
- [ ] Run type checker and fix all issues" \
  "code-quality,typescript"

create_issue \
  "🟢 UX: Add Breadcrumb Navigation" \
  "**Priority:** 🟢 LOW  

**Description:**
Many pages lack breadcrumb navigation, making it harder for users to understand their location in the app hierarchy.

**Expected Behavior:**
\`\`\`
Home > Courses > HTML Basics > Exam
Dashboard > Student Management > Edit Student
\`\`\`

**Action Items:**
- [ ] Create reusable Breadcrumb component
- [ ] Add to exam pages
- [ ] Add to admin dashboard pages
- [ ] Add to course pages
- [ ] Style with Tailwind
- [ ] Make breadcrumbs clickable links" \
  "enhancement,ui/ux"

create_issue \
  "🟢 UX: Improve Loading States" \
  "**Priority:** 🟢 LOW  

**Description:**
Some pages show basic \"Loading...\" text instead of skeleton loaders or spinners.

**Better UX:**
- Skeleton loaders (shimmer effect)
- Animated spinners
- Progressive loading (show partial content)

**Action Items:**
- [ ] Create reusable skeleton components
- [ ] Replace text loading with skeletons
- [ ] Add loading spinners for buttons
- [ ] Implement optimistic UI updates
- [ ] Add loading progress bars for file uploads" \
  "enhancement,ui/ux"

create_issue \
  "🟢 Documentation: Improve README" \
  "**Priority:** 🟢 LOW  

**Description:**
The README should include comprehensive setup and deployment instructions.

**Missing Sections:**
- Project overview and features
- Prerequisites
- Local development setup
- Environment variables explanation
- Deployment instructions
- API documentation link
- Contributing guidelines
- License information

**Action Items:**
- [ ] Add project description
- [ ] List all features
- [ ] Document setup steps
- [ ] Add screenshots
- [ ] Explain environment variables
- [ ] Add deployment guide (Vercel)
- [ ] Link to API documentation
- [ ] Add troubleshooting section" \
  "documentation"

create_issue \
  "🟢 Documentation: Update API Documentation" \
  "**Priority:** 🟢 LOW  

**Description:**
While \`docs/API_DOCUMENTATION.md\` exists, it may need updates after recent changes.

**Action Items:**
- [ ] Review all API endpoints
- [ ] Update request/response examples
- [ ] Document authentication requirements
- [ ] Add rate limiting information
- [ ] Document error codes
- [ ] Add Postman collection
- [ ] Include cURL examples" \
  "documentation"

create_issue \
  "🟢 Feature: Email Verification for New Users" \
  "**Priority:** 🟢 LOW  

**Description:**
Currently, users are auto-confirmed when created by admins. Consider requiring email verification for student self-registration.

**Proposed Behavior:**
- Admin-created users: Auto-confirmed (current behavior)
- Self-registered users: Require email verification
- Send verification email with link
- Block login until verified

**Action Items:**
- [ ] Create separate registration flow for self-registration
- [ ] Configure Supabase email templates
- [ ] Add email verification check at login
- [ ] Show \"Please verify your email\" message
- [ ] Add \"Resend verification email\" option" \
  "enhancement,security,feature"

create_issue \
  "🟢 Feature: Student Profile Page" \
  "**Priority:** 🟢 LOW  

**Description:**
Students don't have a dedicated profile page to view/edit their information.

**Proposed Features:**
- View personal information
- Edit name, phone number
- Change password
- View enrolled course
- View exam history with scores
- Download score certificates

**Action Items:**
- [ ] Create \`/profile\` page
- [ ] Add profile link to student dashboard
- [ ] Implement edit profile form
- [ ] Add change password functionality
- [ ] Show exam history
- [ ] Design and implement score certificates" \
  "feature,enhancement"

create_issue \
  "🟢 Feature: Bulk Student Import via CSV" \
  "**Priority:** 🟢 LOW  

**Description:**
Admins should be able to import multiple students at once via CSV upload instead of adding them one by one.

**Proposed Feature:**
- Upload CSV file with student data
- Preview import data before confirming
- Validate email formats
- Handle duplicate emails
- Show import progress
- Download error report if some fail

**CSV Format:**
\`\`\`csv
name,email,phone,course_id,payment_status
John Doe,john@example.com,1234567890,course-uuid,paid
Jane Smith,jane@example.com,0987654321,course-uuid,unpaid
\`\`\`

**Action Items:**
- [ ] Create CSV upload component
- [ ] Add CSV parsing library (\`papaparse\`)
- [ ] Create bulk import API endpoint
- [ ] Add data validation
- [ ] Show preview table
- [ ] Implement error handling
- [ ] Add progress indicator" \
  "feature,enhancement"

create_issue \
  "🟢 Testing: Add Unit Tests" \
  "**Priority:** 🟢 LOW  

**Description:**
The project lacks unit tests. Critical business logic should be tested.

**Priority Test Areas:**
1. Authentication logic (\`src/lib/auth.ts\`)
2. Validation functions (\`src/lib/validation.ts\`)
3. Exam grading logic (\`src/app/api/exams/submit/route.ts\`)
4. Rate limiting (\`src/lib/rate-limit.ts\`)

**Action Items:**
- [ ] Set up Jest and React Testing Library
- [ ] Write tests for auth helpers
- [ ] Write tests for validation
- [ ] Write tests for exam grading
- [ ] Write tests for rate limiting
- [ ] Add to CI/CD pipeline
- [ ] Aim for 70%+ coverage on critical paths

See \`GITHUB_ISSUES.md\` for test examples." \
  "testing,quality"

create_issue \
  "🟢 Testing: Add E2E Tests" \
  "**Priority:** 🟢 LOW  

**Description:**
End-to-end tests would ensure critical user flows work correctly.

**Critical Flows to Test:**
1. Student registration → login → take exam → view results
2. Admin create student → assign course → set payment status
3. Super-admin create admin → admin logs in

**Recommended Tool:** Playwright or Cypress

**Action Items:**
- [ ] Choose E2E testing framework
- [ ] Set up test environment
- [ ] Write tests for student exam flow
- [ ] Write tests for admin workflows
- [ ] Add to CI/CD pipeline
- [ ] Run before deployment" \
  "testing,quality"

create_issue \
  "🟢 Performance: Implement Request Caching" \
  "**Priority:** 🟢 LOW  

**Description:**
API requests could be cached to reduce database load and improve response times.

**Opportunities:**
- Course list (rarely changes)
- Student dashboard data (cache for 1 minute)
- Exam results (permanent, never changes)

**Solutions:**
- Use Next.js \`revalidate\` option
- Implement Redis caching
- Use SWR or React Query for client-side caching

**Action Items:**
- [ ] Identify cacheable endpoints
- [ ] Add \`revalidate\` to static data
- [ ] Consider Redis for frequently accessed data
- [ ] Implement client-side caching with SWR
- [ ] Monitor cache hit rates" \
  "performance,enhancement"

create_issue \
  "🟢 Performance: Database Query Optimization" \
  "**Priority:** 🟢 LOW  

**Description:**
Some database queries could be optimized with proper indexing and query structure.

**Areas to Review:**
- Student lookups by email (add index)
- Exam queries by course_id (add index)
- Score queries by student_id (add index)

**Action Items:**
- [ ] Review slow query logs in Supabase
- [ ] Add database indexes where needed
- [ ] Use \`select\` to limit returned columns
- [ ] Implement pagination for large datasets
- [ ] Monitor query performance" \
  "performance,database"

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Successfully created 22 GitHub issues!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "View them at: https://github.com/Goodnessukaigwe/zetoe_academy/issues"
echo ""
echo "Next steps:"
echo "  1. Review and prioritize the issues"
echo "  2. Assign issues to team members"
echo "  3. Create a project board to track progress"
echo ""
