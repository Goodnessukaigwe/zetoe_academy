/**
 * E2E Test: Student Exam Flow
 * Tests: Registration → Login → Take Exam → View Results
 */

import { test, expect } from '@playwright/test'
import { LoginPage, StudentDashboardPage, ExamPage, TEST_USERS, waitForAPI } from '../fixtures/helpers'

test.describe('Student Exam Flow', () => {
  let loginPage: LoginPage
  let dashboardPage: StudentDashboardPage
  let examPage: ExamPage

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
    dashboardPage = new StudentDashboardPage(page)
    examPage = new ExamPage(page)
  })

  test('Complete flow: Login → Access Exam → Submit → View Results', async ({ page }) => {
    // Step 1: Login as student
    await test.step('Student logs in', async () => {
      await loginPage.goto()
      await loginPage.login(TEST_USERS.student.email, TEST_USERS.student.password)
      
      // Verify login successful
      expect(await loginPage.isLoggedIn()).toBeTruthy()
      await expect(page).toHaveURL(/.*dashboard/)
    })

    // Step 2: Navigate to dashboard
    await test.step('Student sees dashboard', async () => {
      await dashboardPage.goto()
      
      // Verify student name is displayed
      const name = await dashboardPage.getStudentName()
      expect(name).toContain('Test Student')
    })

    // Step 3: Access exam with code
    await test.step('Student enters exam code', async () => {
      // Navigate to exam access page
      await page.goto('/exams/access')
      
      // Enter exam code (this should be a valid test exam code)
      await examPage.enterExamCode('TEST-EXAM-001')
      
      // Verify exam page loaded
      await expect(page).toHaveURL(/.*exam.*/)
      
      // Check if questions are visible
      const questions = await page.$$('.question, [data-testid="question"]')
      expect(questions.length).toBeGreaterThan(0)
    })

    // Step 4: Answer questions
    await test.step('Student answers all questions', async () => {
      const questions = await page.$$('.question, [data-testid="question"]')
      
      // Answer each question (select first option)
      for (let i = 0; i < questions.length; i++) {
        await examPage.answerQuestion(i, 0)
        
        // Wait a bit between answers
        await page.waitForTimeout(500)
      }
      
      // Verify all questions answered
      const unanswered = await page.$$('.question.unanswered, .question:not(.answered)')
      expect(unanswered.length).toBe(0)
    })

    // Step 5: Submit exam
    await test.step('Student submits exam', async () => {
      // Wait for submit API call
      const apiPromise = waitForAPI(page, '/api/exams/submit')
      
      await examPage.submitExam()
      
      // Wait for API response
      await apiPromise
      
      // Verify on results page
      await expect(page).toHaveURL(/.*result/)
    })

    // Step 6: View results
    await test.step('Student views exam results', async () => {
      // Check if score is displayed
      const score = await examPage.getScore()
      expect(score).toBeGreaterThanOrEqual(0)
      expect(score).toBeLessThanOrEqual(100)
      
      // Check if pass/fail status is shown
      const statusElement = await page.$('.status, [data-testid="status"]')
      expect(statusElement).toBeTruthy()
      
      // Take screenshot of results
      await page.screenshot({ path: 'test-results/student-exam-results.png' })
    })

    // Step 7: Return to dashboard and verify score is saved
    await test.step('Verify score appears in dashboard', async () => {
      await dashboardPage.goto()
      
      // Wait for scores to load
      await page.waitForTimeout(2000)
      
      const scores = await dashboardPage.getScores()
      expect(scores.length).toBeGreaterThan(0)
    })
  })

  test('Student cannot access exam twice', async ({ page }) => {
    await test.step('Student logs in', async () => {
      await loginPage.goto()
      await loginPage.login(TEST_USERS.student.email, TEST_USERS.student.password)
    })

    await test.step('Try to access already taken exam', async () => {
      await page.goto('/exams/access')
      await page.fill('input[name="code"]', 'TEST-EXAM-001')
      await page.click('button:has-text("Start")')
      
      // Should show error message
      const errorMessage = await page.waitForSelector('.error, .toast.error, [role="alert"]')
      expect(errorMessage).toBeTruthy()
      
      const errorText = await errorMessage.textContent()
      expect(errorText).toMatch(/already taken|completed|submitted/i)
    })
  })

  test('Student cannot submit without answering all questions', async ({ page }) => {
    await test.step('Student logs in and accesses exam', async () => {
      await loginPage.goto()
      await loginPage.login(TEST_USERS.student.email, TEST_USERS.student.password)
      
      await page.goto('/exams/access')
      await examPage.enterExamCode('TEST-EXAM-002')
    })

    await test.step('Try to submit without answering all', async () => {
      // Answer only first question
      await examPage.answerQuestion(0, 0)
      
      // Try to submit
      await page.click('button:has-text("Submit")')
      
      // Should show validation error
      const validation = await page.waitForSelector('.validation-error, .toast.error')
      expect(validation).toBeTruthy()
    })
  })

  test('Exam timer works correctly', async ({ page }) => {
    await test.step('Student starts timed exam', async () => {
      await loginPage.goto()
      await loginPage.login(TEST_USERS.student.email, TEST_USERS.student.password)
      
      await page.goto('/exams/access')
      await examPage.enterExamCode('TEST-EXAM-TIMED')
      
      // Check if timer is visible
      const timer = await page.waitForSelector('.timer, [data-testid="timer"]')
      expect(timer).toBeTruthy()
      
      // Get initial time
      const initialTime = await timer.textContent()
      
      // Wait 5 seconds
      await page.waitForTimeout(5000)
      
      // Check time has decreased
      const currentTime = await timer.textContent()
      expect(currentTime).not.toBe(initialTime)
    })
  })
})
