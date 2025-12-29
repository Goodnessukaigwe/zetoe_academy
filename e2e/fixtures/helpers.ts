/**
 * Test Fixtures and Helper Functions
 * Shared utilities for E2E tests
 */

import { Page } from '@playwright/test'

/**
 * Test credentials
 */
export const TEST_USERS = {
  student: {
    email: 'student.test@zetoe.com',
    password: 'TestPassword123!',
    name: 'Test Student',
    phone: '+2348012345678',
  },
  admin: {
    email: 'admin.test@zetoe.com',
    password: 'AdminPassword123!',
    name: 'Test Admin',
  },
  superAdmin: {
    email: 'superadmin@zetoe.com',
    password: 'SuperAdminPassword123!',
    name: 'Super Admin',
  },
}

/**
 * Test data
 */
export const TEST_DATA = {
  course: {
    name: 'E2E Test Course',
    description: 'Course created by E2E test',
    price: 50000,
    duration: '4 weeks',
  },
  exam: {
    title: 'E2E Test Exam',
    description: 'Exam created by E2E test',
    code: `TEST-${Date.now()}`,
    duration: 30,
    passingScore: 70,
  },
}

/**
 * Page Object Model - Login Page
 */
export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/login')
  }

  async login(email: string, password: string) {
    await this.page.fill('input[type="email"]', email)
    await this.page.fill('input[type="password"]', password)
    await this.page.click('button[type="submit"]')
    
    // Wait for navigation
    await this.page.waitForURL('**/dashboard', { timeout: 10000 })
  }

  async isLoggedIn() {
    // Check if we're on a dashboard page
    const url = this.page.url()
    return url.includes('/dashboard') || url.includes('/admin-dashboard')
  }
}

/**
 * Page Object Model - Student Dashboard
 */
export class StudentDashboardPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/dashboard')
  }

  async getStudentName() {
    return await this.page.textContent('h1, h2, .student-name')
  }

  async navigateToExams() {
    await this.page.click('a[href*="exam"], button:has-text("Take Exam")')
  }

  async getScores() {
    // Wait for scores to load
    await this.page.waitForSelector('.score, [data-testid="score"]', { timeout: 5000 })
    return await this.page.$$('.score, [data-testid="score"]')
  }
}

/**
 * Page Object Model - Exam Page
 */
export class ExamPage {
  constructor(private page: Page) {}

  async enterExamCode(code: string) {
    await this.page.fill('input[name="code"], input[placeholder*="code"]', code)
    await this.page.click('button:has-text("Start"), button:has-text("Access")')
    
    // Wait for exam to load
    await this.page.waitForSelector('.question, [data-testid="question"]', { timeout: 10000 })
  }

  async answerQuestion(questionIndex: number, answerIndex: number) {
    const questions = await this.page.$$('.question, [data-testid="question"]')
    const question = questions[questionIndex]
    const answers = await question.$$('input[type="radio"], button.answer')
    await answers[answerIndex].click()
  }

  async submitExam() {
    await this.page.click('button:has-text("Submit")')
    
    // Confirm submission if there's a modal
    const confirmButton = await this.page.$('button:has-text("Confirm"), button:has-text("Yes")')
    if (confirmButton) {
      await confirmButton.click()
    }
    
    // Wait for results page
    await this.page.waitForURL('**/result', { timeout: 10000 })
  }

  async getScore() {
    await this.page.waitForSelector('.score, [data-testid="score"]')
    const scoreText = await this.page.textContent('.score, [data-testid="score"]')
    return parseInt(scoreText?.match(/\d+/)?.[0] || '0')
  }
}

/**
 * Page Object Model - Admin Dashboard
 */
export class AdminDashboardPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/admin-dashboard')
  }

  async navigateToStudents() {
    await this.page.click('a[href*="student"]')
  }

  async navigateToCourses() {
    await this.page.click('a[href*="course"]')
  }

  async navigateToExams() {
    await this.page.click('a[href*="exam"]')
  }

  async createStudent(name: string, email: string, password: string, courseId?: string) {
    // Navigate to create student
    await this.page.click('button:has-text("Add Student"), a:has-text("Create")')
    
    // Fill form
    await this.page.fill('input[name="name"]', name)
    await this.page.fill('input[name="email"]', email)
    await this.page.fill('input[name="password"]', password)
    
    if (courseId) {
      await this.page.selectOption('select[name="course_id"]', courseId)
    }
    
    // Submit
    await this.page.click('button[type="submit"]')
    
    // Wait for success message
    await this.page.waitForSelector('.success, .toast, [role="alert"]', { timeout: 5000 })
  }

  async setPaymentStatus(studentEmail: string, status: 'paid' | 'unpaid') {
    // Find student row
    const row = await this.page.locator(`tr:has-text("${studentEmail}")`)
    
    // Click edit or status dropdown
    await row.locator('button:has-text("Edit"), select').first().click()
    
    // Select payment status
    await this.page.selectOption('select[name="payment_status"]', status)
    
    // Save
    await this.page.click('button:has-text("Save"), button[type="submit"]')
  }
}

/**
 * Helper: Wait for API response
 */
export async function waitForAPI(page: Page, endpoint: string) {
  return await page.waitForResponse(
    (response) => response.url().includes(endpoint) && response.status() === 200,
    { timeout: 10000 }
  )
}

/**
 * Helper: Clear test data (run after tests)
 */
export async function cleanupTestData(page: Page) {
  // This would call cleanup endpoints or directly clean database
  // Implementation depends on your test environment setup
  console.log('Cleaning up test data...')
}

/**
 * Helper: Take screenshot with timestamp
 */
export async function takeScreenshot(page: Page, name: string) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  await page.screenshot({ path: `test-results/screenshots/${name}-${timestamp}.png`, fullPage: true })
}
