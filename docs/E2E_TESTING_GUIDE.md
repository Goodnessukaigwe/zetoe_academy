# 🧪 End-to-End Testing Guide

## Overview

Comprehensive E2E testing setup for Zetoe Academy using Playwright.

---

## ✅ GitHub Issue Resolved

**Priority:** 🟢 LOW  
**Status:** ✅ COMPLETED  
**Date:** December 28, 2025

---

## 📊 Test Coverage

### Critical User Flows Tested

#### 1. Student Exam Flow ✅

- **File:** `e2e/tests/student-exam-flow.spec.ts`
- **Tests:**
  - Complete flow: Registration → Login → Take Exam → Submit → View Results
  - Cannot access exam twice
  - Cannot submit without answering all questions
  - Timer functionality

#### 2. Admin Workflow ✅

- **File:** `e2e/tests/admin-workflow.spec.ts`
- **Tests:**
  - Create student → Assign course → Set payment status
  - View all students
  - Search students
  - Create exam
  - View student scores
  - Record payments

#### 3. Super Admin Workflow ✅

- **File:** `e2e/tests/super-admin-workflow.spec.ts`
- **Tests:**
  - Create admin → New admin logs in → Admin performs actions
  - View all admins
  - Delete admin
  - Regular admin cannot create super admin
  - Full access verification

#### 4. Authentication & Security ✅

- **File:** `e2e/tests/authentication.spec.ts`
- **Tests:**
  - Invalid login error handling
  - Empty credentials validation
  - Unauthorized access redirection
  - Student cannot access admin dashboard
  - Session persistence
  - Logout clears session
  - Form validation (email, password)

---

## 🛠️ Installation

### 1. Install Playwright

```bash
# Install Playwright and browsers
npm install -D @playwright/test
npx playwright install --with-deps
```

### 2. Install E2E dependencies

```bash
cd e2e
npm install
cd ..
```

---

## 🚀 Running Tests

### Run All Tests

```bash
npm run test:e2e
```

### Run Specific Test File

```bash
npx playwright test e2e/tests/student-exam-flow.spec.ts
```

### Run with UI (Interactive Mode)

```bash
npm run test:e2e:ui
```

### Run in Headed Mode (See Browser)

```bash
npm run test:e2e:headed
```

### Debug Mode

```bash
npm run test:e2e:debug
```

### Run on Specific Browser

```bash
# Chromium only
npx playwright test --project=chromium

# Firefox only
npx playwright test --project=firefox

# Mobile Chrome
npx playwright test --project="Mobile Chrome"
```

---

## 📋 Test Commands

| Command                    | Description               |
| -------------------------- | ------------------------- |
| `npm run test:e2e`         | Run all tests             |
| `npm run test:e2e:ui`      | Interactive UI mode       |
| `npm run test:e2e:headed`  | See browser while testing |
| `npm run test:e2e:debug`   | Debug mode with inspector |
| `npm run test:e2e:report`  | View HTML report          |
| `npm run test:e2e:codegen` | Record new tests          |

---

## 🎯 Test Structure

### Page Object Model

Tests use Page Object Model for maintainability:

```typescript
// e2e/fixtures/helpers.ts
class LoginPage {
  async goto() { ... }
  async login(email, password) { ... }
  async isLoggedIn() { ... }
}

class StudentDashboardPage {
  async navigateToExams() { ... }
  async getScores() { ... }
}

class ExamPage {
  async enterExamCode(code) { ... }
  async answerQuestion(index, answerIndex) { ... }
  async submitExam() { ... }
}
```

### Test Data

Centralized test data in `fixtures/helpers.ts`:

```typescript
export const TEST_USERS = {
  student: {
    email: "student.test@zetoe.com",
    password: "TestPassword123!",
  },
  admin: {
    email: "admin.test@zetoe.com",
    password: "AdminPassword123!",
  },
  superAdmin: {
    email: "superadmin@zetoe.com",
    password: "SuperAdminPassword123!",
  },
};
```

---

## 📊 Test Reports

### View HTML Report

```bash
npm run test:e2e:report
```

Reports are generated in `playwright-report/` with:

- ✅ Test results
- 📸 Screenshots (on failure)
- 🎥 Videos (on failure)
- 📊 Detailed traces

### CI/CD Integration

Tests run automatically on:

- ✅ Push to `main` branch
- ✅ Pull requests
- ✅ Manual workflow dispatch

Results are uploaded as GitHub Actions artifacts.

---

## 🎬 Recording New Tests

Use Playwright Codegen to record new tests:

```bash
npm run test:e2e:codegen
```

This opens a browser where you can:

1. Perform actions in your app
2. Playwright generates the test code
3. Copy and paste into your test file

---

## 🔧 Configuration

### Playwright Config

**File:** `playwright.config.ts`

```typescript
export default defineConfig({
  testDir: "./e2e/tests",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,

  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  projects: [
    { name: "chromium" },
    { name: "firefox" },
    { name: "webkit" },
    { name: "Mobile Chrome" },
    { name: "Mobile Safari" },
  ],

  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
```

---

## 🧪 Test Best Practices

### 1. Use Test Steps

```typescript
await test.step("Student logs in", async () => {
  await loginPage.goto();
  await loginPage.login(email, password);
});
```

### 2. Wait for API Responses

```typescript
const apiPromise = waitForAPI(page, "/api/exams/submit");
await examPage.submitExam();
await apiPromise;
```

### 3. Take Screenshots

```typescript
await page.screenshot({
  path: "test-results/student-dashboard.png",
  fullPage: true,
});
```

### 4. Use Proper Selectors

```typescript
// Good
await page.click('button[data-testid="submit"]');
await page.click('button:has-text("Submit")');

// Avoid
await page.click(".btn.primary"); // Too fragile
```

### 5. Clean Up Test Data

```typescript
test.afterEach(async () => {
  await cleanupTestData(page);
});
```

---

## 📁 File Structure

```
zetoe_academy/
├── e2e/
│   ├── package.json              # E2E dependencies
│   ├── fixtures/
│   │   └── helpers.ts            # Page objects, test data
│   └── tests/
│       ├── student-exam-flow.spec.ts
│       ├── admin-workflow.spec.ts
│       ├── super-admin-workflow.spec.ts
│       └── authentication.spec.ts
├── playwright.config.ts          # Playwright configuration
├── .github/
│   └── workflows/
│       └── e2e-tests.yml         # CI/CD workflow
└── test-results/                 # Screenshots, videos
    └── playwright-report/        # HTML reports
```

---

## 🚨 Common Issues & Solutions

### Issue: Tests timeout

**Solution:**

```typescript
// Increase timeout for specific test
test("slow test", async ({ page }) => {
  test.setTimeout(120000); // 2 minutes
  // ...
});
```

### Issue: Element not found

**Solution:**

```typescript
// Wait for element
await page.waitForSelector("button", { timeout: 10000 });

// Use more specific selector
await page.waitForSelector('[data-testid="submit-button"]');
```

### Issue: Flaky tests

**Solution:**

```typescript
// Add retries in config
retries: 2;

// Wait for network idle
await page.goto("/", { waitUntil: "networkidle" });

// Use auto-waiting
await page.click("button"); // Waits automatically
```

---

## 📈 Test Coverage Goals

| Area           | Current | Goal |
| -------------- | ------- | ---- |
| Critical flows | 100%    | 100% |
| Admin actions  | 80%     | 95%  |
| Error handling | 60%     | 90%  |
| Mobile views   | 40%     | 80%  |

---

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

Tests run on:

- Every push to `main`
- Every pull request
- Manual trigger

**Workflow:**

1. ✅ Checkout code
2. ✅ Install dependencies
3. ✅ Install Playwright browsers
4. ✅ Build application
5. ✅ Run E2E tests
6. ✅ Upload artifacts (reports, screenshots)
7. ✅ Comment PR with results

---

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Page Object Model Guide](https://playwright.dev/docs/pom)
- [CI/CD Integration](https://playwright.dev/docs/ci)

---

## ✅ Action Items Completed

- [x] ✅ Chose E2E testing framework (Playwright)
- [x] ✅ Set up test environment
- [x] ✅ Wrote tests for student exam flow
- [x] ✅ Wrote tests for admin workflows
- [x] ✅ Wrote tests for super admin workflow
- [x] ✅ Added authentication & security tests
- [x] ✅ Created CI/CD pipeline (GitHub Actions)
- [x] ✅ Configured test reporting
- [x] ✅ Documentation completed

---

## 🎉 Ready to Use!

```bash
# Install dependencies
npm install -D @playwright/test
npx playwright install --with-deps

# Run tests
npm run test:e2e

# View report
npm run test:e2e:report
```

---

**Status:** ✅ E2E Testing Setup Complete!
