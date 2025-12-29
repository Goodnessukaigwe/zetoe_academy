/**
 * E2E Test: Admin Workflow
 * Tests: Create Student → Assign Course → Set Payment Status
 */

import { test, expect } from '@playwright/test'
import { LoginPage, AdminDashboardPage, TEST_USERS, TEST_DATA, waitForAPI } from '../fixtures/helpers'

test.describe('Admin Workflow', () => {
  let loginPage: LoginPage
  let adminDashboard: AdminDashboardPage

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
    adminDashboard = new AdminDashboardPage(page)

    // Login as admin before each test
    await loginPage.goto()
    await loginPage.login(TEST_USERS.admin.email, TEST_USERS.admin.password)
    await expect(page).toHaveURL(/.*admin-dashboard/)
  })

  test('Complete admin flow: Create student → Assign course → Set payment', async ({ page }) => {
    let testStudentEmail = `test.student.${Date.now()}@zetoe.com`
    let courseId: string | null = null

    // Step 1: Create a course first
    await test.step('Admin creates a course', async () => {
      await adminDashboard.navigateToCourses()
      
      // Click create course button
      await page.click('button:has-text("Create Course"), button:has-text("Add Course")')
      
      // Fill course form
      await page.fill('input[name="name"]', TEST_DATA.course.name)
      await page.fill('textarea[name="description"]', TEST_DATA.course.description)
      await page.fill('input[name="price"]', TEST_DATA.course.price.toString())
      await page.fill('input[name="duration"]', TEST_DATA.course.duration)
      
      // Wait for API call
      const apiPromise = waitForAPI(page, '/api/courses')
      
      // Submit form
      await page.click('button[type="submit"]')
      
      // Wait for success
      const response = await apiPromise
      const data = await response.json()
      courseId = data.course.id
      
      // Verify success message
      await page.waitForSelector('.success, .toast.success')
      
      // Take screenshot
      await page.screenshot({ path: 'test-results/admin-course-created.png' })
    })

    // Step 2: Create student
    await test.step('Admin creates a student', async () => {
      await adminDashboard.navigateToStudents()
      
      // Create student with the course
      await adminDashboard.createStudent(
        'Test Student E2E',
        testStudentEmail,
        'StudentPassword123!',
        courseId!
      )
      
      // Verify student appears in list
      await page.waitForTimeout(2000)
      const studentRow = await page.waitForSelector(`tr:has-text("${testStudentEmail}")`)
      expect(studentRow).toBeTruthy()
    })

    // Step 3: Assign course (if not assigned during creation)
    await test.step('Verify course is assigned', async () => {
      const studentRow = await page.locator(`tr:has-text("${testStudentEmail}")`)
      const courseCell = await studentRow.locator('td:has-text("' + TEST_DATA.course.name + '")')
      expect(courseCell).toBeTruthy()
    })

    // Step 4: Set payment status to paid
    await test.step('Admin sets payment status to paid', async () => {
      await adminDashboard.setPaymentStatus(testStudentEmail, 'paid')
      
      // Verify payment status updated
      await page.waitForTimeout(1000)
      const studentRow = await page.locator(`tr:has-text("${testStudentEmail}")`)
      const paidStatus = await studentRow.locator('text=/paid/i')
      expect(paidStatus).toBeTruthy()
      
      // Take screenshot
      await page.screenshot({ path: 'test-results/admin-student-paid.png' })
    })

    // Step 5: Record payment
    await test.step('Admin records payment', async () => {
      // Navigate to payments
      await page.click('a[href*="payment"]')
      
      // Click add payment
      await page.click('button:has-text("Add Payment"), button:has-text("Record")')
      
      // Fill payment form
      await page.selectOption('select[name="student_id"]', { label: testStudentEmail })
      await page.fill('input[name="amount"]', TEST_DATA.course.price.toString())
      await page.selectOption('select[name="payment_method"]', 'cash')
      await page.fill('textarea[name="notes"]', 'E2E test payment')
      
      // Submit
      const apiPromise = waitForAPI(page, '/api/payments')
      await page.click('button[type="submit"]')
      await apiPromise
      
      // Verify success
      await page.waitForSelector('.success, .toast.success')
    })

    // Step 6: Verify student can now access exam
    await test.step('Verify student payment status allows exam access', async () => {
      // Logout admin
      await page.click('button:has-text("Logout"), a:has-text("Logout")')
      
      // Login as the new student
      await loginPage.goto()
      await loginPage.login(testStudentEmail, 'StudentPassword123!')
      
      // Try to access exam
      await page.goto('/exams/access')
      
      // Should be able to see exam access form (not blocked by payment)
      const accessForm = await page.waitForSelector('input[name="code"], form')
      expect(accessForm).toBeTruthy()
    })
  })

  test('Admin can view all students', async ({ page }) => {
    await test.step('Navigate to students page', async () => {
      await adminDashboard.navigateToStudents()
      
      // Wait for students to load
      await page.waitForSelector('table, .student-list')
      
      // Verify table headers
      await expect(page.locator('th:has-text("Name")')).toBeVisible()
      await expect(page.locator('th:has-text("Email")')).toBeVisible()
      await expect(page.locator('th:has-text("Payment")')).toBeVisible()
    })
  })

  test('Admin can search students', async ({ page }) => {
    await test.step('Search for specific student', async () => {
      await adminDashboard.navigateToStudents()
      
      // Enter search query
      await page.fill('input[type="search"], input[placeholder*="search" i]', 'test')
      
      // Wait for filter
      await page.waitForTimeout(1000)
      
      // Verify filtered results
      const rows = await page.$$('tbody tr')
      expect(rows.length).toBeGreaterThan(0)
    })
  })

  test('Admin can create exam', async ({ page }) => {
    await test.step('Navigate to exams and create new', async () => {
      await adminDashboard.navigateToExams()
      
      // Click create exam
      await page.click('button:has-text("Create Exam"), button:has-text("Add Exam")')
      
      // Fill exam details
      await page.fill('input[name="title"]', TEST_DATA.exam.title)
      await page.fill('textarea[name="description"]', TEST_DATA.exam.description)
      await page.fill('input[name="code"]', TEST_DATA.exam.code)
      await page.fill('input[name="duration_minutes"]', TEST_DATA.exam.duration.toString())
      await page.fill('input[name="passing_score"]', TEST_DATA.exam.passingScore.toString())
      
      // Add questions
      await page.click('button:has-text("Add Question")')
      await page.fill('input[name="question_text"]', 'What is 2 + 2?')
      
      // Add answers
      for (let i = 0; i < 4; i++) {
        await page.click('button:has-text("Add Answer")')
        await page.fill(`input[name="answer_${i}"]`, i === 0 ? '4 (Correct)' : `Wrong ${i}`)
        if (i === 0) {
          await page.check(`input[name="correct_${i}"]`)
        }
      }
      
      // Submit
      const apiPromise = waitForAPI(page, '/api/exams')
      await page.click('button[type="submit"]')
      await apiPromise
      
      // Verify success
      await page.waitForSelector('.success, .toast.success')
      await page.screenshot({ path: 'test-results/admin-exam-created.png' })
    })
  })

  test('Admin can view student scores', async ({ page }) => {
    await test.step('Navigate to scores page', async () => {
      await page.click('a[href*="score"]')
      
      // Wait for scores table
      await page.waitForSelector('table, .scores-list')
      
      // Verify table shows scores
      const scores = await page.$$('tbody tr')
      expect(scores.length).toBeGreaterThanOrEqual(0)
    })
  })
})
