# 🎯 E2E Testing Quick Reference

## 📦 One-Time Setup

```bash
# 1. Install Playwright
npm install -D @playwright/test
npx playwright install --with-deps

# 2. Create test users in Supabase
# Run: supabase/test-data-setup.sql

# 3. Configure environment
cp .env.example .env.local
# Add Supabase credentials
```

---

## ⚡ Quick Commands

```bash
# Run all tests
npm run test:e2e

# Interactive UI
npm run test:e2e:ui

# See browser
npm run test:e2e:headed

# Debug tests
npm run test:e2e:debug

# View report
npm run test:e2e:report

# Record new test
npm run test:e2e:codegen
```

---

## 🧪 Test Users

| Role        | Email                  | Password               |
| ----------- | ---------------------- | ---------------------- |
| Student     | student.test@zetoe.com | TestPassword123!       |
| Admin       | admin.test@zetoe.com   | AdminPassword123!      |
| Super Admin | superadmin@zetoe.com   | SuperAdminPassword123! |

**Test Exam Code:** `TEST123`

---

## 📊 Test Coverage

### ✅ 22+ Tests Across 4 Suites

1. **Student Exam Flow** (4 tests)

   - Login → Take exam → Submit → View results
   - Duplicate prevention
   - Incomplete submission validation
   - Timer functionality

2. **Admin Workflow** (6 tests)

   - Create student → Assign course → Set payment
   - View/search students
   - Create exams
   - View scores

3. **Super Admin** (5 tests)

   - Create admin → Admin logs in
   - View/delete admins
   - Permission checks
   - Full access verification

4. **Authentication** (7 tests)
   - Login validation
   - Session management
   - Access control
   - Form validation

---

## 🎯 Run Specific Tests

```bash
# Single file
npx playwright test e2e/tests/student-exam-flow.spec.ts

# Single test
npx playwright test -g "Student can take exam"

# Specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project="Mobile Chrome"
```

---

## 🔍 Debugging

```bash
# Debug mode
npm run test:e2e:debug

# Show trace
npx playwright show-trace test-results/[test]/trace.zip

# Screenshots (auto on failure)
# Location: test-results/[test-name]/test-failed-1.png

# Videos (auto on failure)
# Location: test-results/[test-name]/video.webm
```

---

## 🚀 CI/CD

Tests run automatically on:

- ✅ Push to `main` / `develop`
- ✅ Pull requests
- ✅ Manual dispatch

**Workflow:** `.github/workflows/e2e-tests.yml`

View results:

- GitHub Actions → Workflow run
- Download artifacts (reports, screenshots)

---

## 📝 Writing Tests Template

```typescript
import { test, expect } from "@playwright/test";
import { LoginPage, TEST_USERS } from "../fixtures/helpers";

test.describe("My Feature", () => {
  test("should do something", async ({ page }) => {
    const loginPage = new LoginPage(page);

    await test.step("Step 1: Login", async () => {
      await loginPage.goto();
      await loginPage.login(
        TEST_USERS.student.email,
        TEST_USERS.student.password
      );
    });

    await test.step("Step 2: Action", async () => {
      // Your test code
      await page.click("button");
      await expect(page.locator("h1")).toHaveText("Expected");
    });

    await test.step("Step 3: Verify", async () => {
      // Verification code
      await expect(page).toHaveURL(/dashboard/);
    });
  });
});
```

---

## 🛠️ Page Objects Available

```typescript
// Login
const loginPage = new LoginPage(page);
await loginPage.goto();
await loginPage.login(email, password);
const isLoggedIn = await loginPage.isLoggedIn();

// Student Dashboard
const dashboard = new StudentDashboardPage(page);
await dashboard.navigateToExams();
await dashboard.navigateToCourses();
const scores = await dashboard.getScores();

// Exam
const examPage = new ExamPage(page);
await examPage.enterExamCode("TEST123");
await examPage.answerQuestion(0, 1); // Question 0, Answer 1
await examPage.submitExam();
const score = await examPage.getScore();

// Admin Dashboard
const admin = new AdminDashboardPage(page);
await admin.navigateToStudents();
await admin.createStudent({ name, email, phone });
await admin.assignCourse(studentId, courseId);
await admin.setPaymentStatus(studentId, "paid");
```

---

## 🔧 Helper Functions

```typescript
// Wait for API response
const apiPromise = waitForAPI(page, "/api/endpoint");
// Perform action
await apiPromise;

// Clean test data
await cleanupTestData(page);

// Screenshot
await takeScreenshot(page, "my-screenshot");
```

---

## 📊 Browser Support

Tests run on:

- ✅ Chromium (Chrome, Edge)
- ✅ Firefox
- ✅ WebKit (Safari)
- ✅ Mobile Chrome
- ✅ Mobile Safari

---

## 🚨 Troubleshooting

| Issue                  | Solution                                         |
| ---------------------- | ------------------------------------------------ |
| Browser not found      | `npx playwright install`                         |
| Tests timeout          | Check `npm run dev` is running                   |
| Test users not working | Run `test-data-setup.sql`                        |
| Flaky tests            | Add `await page.waitForSelector()`               |
| Cannot find element    | Use `await page.waitForLoadState('networkidle')` |

---

## 📖 Full Documentation

- **Complete Guide:** `docs/E2E_TESTING_GUIDE.md`
- **Setup Steps:** `docs/E2E_TESTING_SETUP.md`
- **Summary:** `docs/E2E_TESTING_SUMMARY.md`

---

## ✅ Pre-Flight Checklist

Before running tests:

- [ ] Playwright installed
- [ ] Test users created in database
- [ ] Test course and exam exist
- [ ] `.env.local` configured
- [ ] Development server running (`npm run dev`)
- [ ] Port 3000 available

---

## 🎯 Daily Workflow

```bash
# Morning: Run full suite
npm run test:e2e

# During dev: Run specific tests
npx playwright test -g "feature name"

# Before commit: Run all tests
npm run test:e2e

# After commit: Check CI/CD
# GitHub Actions → View workflow run
```

---

## 🏆 Best Practices

✅ **Use Page Objects** - Keep tests maintainable  
✅ **Add Test Steps** - Readable reports  
✅ **Wait for API** - Reliable tests  
✅ **Take Screenshots** - Visual documentation  
✅ **Test Edge Cases** - Not just happy path  
✅ **Clean Up Data** - Keep database clean  
✅ **Descriptive Names** - Clear intent

---

## 🎉 Quick Win

```bash
# 1. Start dev server
npm run dev

# 2. Open UI mode
npm run test:e2e:ui

# 3. Click test to run
# 4. Watch it execute
# 5. View results
```

---

**⏱️ Average Test Duration:** ~30 seconds per test  
**📊 Full Suite:** ~5-10 minutes  
**🎯 Coverage:** 22+ critical flows

---

**📞 Need Help?**

- Read: `docs/E2E_TESTING_GUIDE.md`
- Debug: `npm run test:e2e:debug`
- Report: `npm run test:e2e:report`
