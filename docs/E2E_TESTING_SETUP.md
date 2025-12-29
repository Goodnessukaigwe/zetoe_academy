# 🧪 E2E Testing Setup Instructions

## Prerequisites

Before running E2E tests, ensure you have:

✅ Node.js 18+ installed  
✅ Application running locally  
✅ Supabase project set up  
✅ Test users created in database

---

## Step 1: Install Playwright

```bash
# Install Playwright
npm install -D @playwright/test

# Install browsers
npx playwright install --with-deps
```

This will install:

- Playwright test runner
- Chromium, Firefox, and WebKit browsers
- System dependencies for browsers

---

## Step 2: Create Test Users

Run the SQL script in Supabase SQL Editor:

```bash
# Open Supabase dashboard
# Navigate to: SQL Editor → New Query
# Copy contents from: supabase/test-data-setup.sql
# Click "Run"
```

This creates:

- ✅ Test student: `student.test@zetoe.com` / `TestPassword123!`
- ✅ Test admin: `admin.test@zetoe.com` / `AdminPassword123!`
- ✅ Test super admin: `superadmin@zetoe.com` / `SuperAdminPassword123!`
- ✅ Test course with exam (code: `TEST123`)
- ✅ 3 test questions

---

## Step 3: Configure Environment Variables

Create `.env.local` if not exists:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Test environment
BASE_URL=http://localhost:3000
```

---

## Step 4: Run Tests

### First Test Run

```bash
# Start development server (in one terminal)
npm run dev

# Run tests (in another terminal)
npm run test:e2e
```

### Watch Tests Run (Headed Mode)

```bash
npm run test:e2e:headed
```

You'll see the browser open and tests execute.

### Interactive UI Mode

```bash
npm run test:e2e:ui
```

This opens Playwright UI where you can:

- Select which tests to run
- See test execution step-by-step
- Debug failures interactively
- View screenshots and traces

---

## Step 5: View Test Reports

After tests complete:

```bash
npm run test:e2e:report
```

This opens an HTML report with:

- ✅ Test results (pass/fail)
- ⏱️ Execution time
- 📸 Screenshots (on failure)
- 🎥 Videos (on failure)
- 🔍 Detailed traces

---

## Common Commands

| Command                    | Description      |
| -------------------------- | ---------------- |
| `npm run test:e2e`         | Run all tests    |
| `npm run test:e2e:ui`      | Interactive mode |
| `npm run test:e2e:headed`  | See browser      |
| `npm run test:e2e:debug`   | Debug mode       |
| `npm run test:e2e:report`  | View report      |
| `npm run test:e2e:codegen` | Record new tests |

---

## Running Specific Tests

### Single test file

```bash
npx playwright test e2e/tests/student-exam-flow.spec.ts
```

### Single test case

```bash
npx playwright test -g "Student can take exam"
```

### Specific browser

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project="Mobile Chrome"
```

---

## Debugging Failed Tests

### 1. Run in Debug Mode

```bash
npm run test:e2e:debug
```

This opens Playwright Inspector where you can:

- Step through test execution
- Inspect elements
- View console logs
- Check network requests

### 2. View Screenshots

Failed tests automatically capture screenshots:

```
test-results/
  └── [test-name]/
      └── test-failed-1.png
```

### 3. Watch Videos

Failed tests record videos:

```
test-results/
  └── [test-name]/
      └── video.webm
```

### 4. Inspect Traces

Open trace viewer:

```bash
npx playwright show-trace test-results/[test-name]/trace.zip
```

---

## Troubleshooting

### Issue: "Browser not found"

**Solution:**

```bash
npx playwright install --with-deps
```

### Issue: "Tests timeout"

**Solution:**

- Ensure `npm run dev` is running
- Check `BASE_URL` in `.env.local`
- Increase timeout in test:
  ```typescript
  test.setTimeout(120000); // 2 minutes
  ```

### Issue: "Test users not working"

**Solution:**

- Verify SQL script ran successfully
- Check Supabase Auth → Users
- Ensure RLS policies allow test users

### Issue: "Cannot find test data"

**Solution:**

- Verify course and exam exist in database
- Check exam code is `TEST123`
- Ensure questions were created

### Issue: "Tests are flaky"

**Solution:**

- Add explicit waits:
  ```typescript
  await page.waitForSelector("button");
  await page.waitForLoadState("networkidle");
  ```
- Use API waiting:
  ```typescript
  await waitForAPI(page, "/api/endpoint");
  ```
- Enable retries in config (already enabled for CI)

---

## CI/CD Setup

Tests run automatically on GitHub Actions:

### 1. Add Secrets

In GitHub: Settings → Secrets → Actions

Add:

- `DATABASE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### 2. Test Users in CI

Create separate test users for CI environment:

- `ci-student@zetoe.com`
- `ci-admin@zetoe.com`
- `ci-superadmin@zetoe.com`

Update `TEST_USERS` in `e2e/fixtures/helpers.ts` for CI.

### 3. View CI Results

- Go to Actions tab in GitHub
- Click on workflow run
- View test results
- Download artifacts (reports, screenshots)

---

## Writing New Tests

### 1. Use Codegen to Record

```bash
npm run test:e2e:codegen
```

This opens a browser and records your actions.

### 2. Copy Generated Code

Playwright will generate test code as you interact.

### 3. Refine the Test

Move code into test file and use Page Objects:

```typescript
test("My new test", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await test.step("Login", async () => {
    await loginPage.goto();
    await loginPage.login(email, password);
  });

  await test.step("Perform action", async () => {
    // Your test code
  });
});
```

---

## Best Practices

✅ **Use Page Objects** - Keep tests maintainable  
✅ **Add Test Steps** - Make reports readable  
✅ **Wait for API** - Ensure reliable tests  
✅ **Take Screenshots** - Document flows  
✅ **Clean Up Data** - Keep database clean  
✅ **Use Descriptive Names** - Clear test intent  
✅ **Test Edge Cases** - Not just happy path

---

## Test Coverage Checklist

Use this to verify all tests pass:

### Student Flow

- [ ] Student can login
- [ ] Student can take exam with code
- [ ] Student can submit exam
- [ ] Student can view results
- [ ] Cannot take exam twice
- [ ] Cannot submit incomplete exam
- [ ] Timer works correctly

### Admin Flow

- [ ] Admin can create student
- [ ] Admin can assign course
- [ ] Admin can set payment status
- [ ] Admin can view all students
- [ ] Admin can search students
- [ ] Admin can create exam
- [ ] Admin can view scores

### Super Admin Flow

- [ ] Super admin can create admin
- [ ] New admin can login
- [ ] Super admin can view all admins
- [ ] Super admin can delete admin
- [ ] Regular admin cannot create super admin
- [ ] Super admin has full access

### Security

- [ ] Invalid login shows error
- [ ] Empty credentials validated
- [ ] Unauthenticated redirects to login
- [ ] Student cannot access admin dashboard
- [ ] Session persists across reloads
- [ ] Logout clears session

---

## Next Steps

After tests pass locally:

1. ✅ Push to GitHub
2. ✅ Verify CI/CD runs
3. ✅ Check test reports
4. ✅ Add more test cases as needed
5. ✅ Maintain tests as app evolves

---

## Support

For help:

- 📚 Read `docs/E2E_TESTING_GUIDE.md`
- 🔍 Check Playwright docs: https://playwright.dev
- 🐛 View test reports for details
- 🎯 Run in debug mode

---

## ✅ Setup Complete!

You're ready to run E2E tests:

```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Run tests
npm run test:e2e

# View results
npm run test:e2e:report
```

🎉 Happy Testing!
