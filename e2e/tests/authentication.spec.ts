/**
 * E2E Test: Authentication & Security
 * Tests: Login validation, Session handling, Unauthorized access
 */

import { test, expect } from '@playwright/test'
import { LoginPage, TEST_USERS } from '../fixtures/helpers'

test.describe('Authentication & Security', () => {
  let loginPage: LoginPage

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
  })

  test('Invalid login shows error message', async ({ page }) => {
    await loginPage.goto()
    
    await page.fill('input[type="email"]', 'invalid@email.com')
    await page.fill('input[type="password"]', 'wrongpassword')
    await page.click('button[type="submit"]')
    
    // Should show error message
    const error = await page.waitForSelector('.error, .toast.error, [role="alert"]')
    expect(error).toBeTruthy()
    
    // Should still be on login page
    await expect(page).toHaveURL(/.*login/)
  })

  test('Empty credentials show validation error', async ({ page }) => {
    await loginPage.goto()
    
    await page.click('button[type="submit"]')
    
    // Should show validation errors
    const errors = await page.$$('.error, .validation-error')
    expect(errors.length).toBeGreaterThan(0)
  })

  test('Unauthenticated user redirected to login', async ({ page }) => {
    // Try to access protected route
    await page.goto('/dashboard')
    
    // Should redirect to login
    await page.waitForURL(/.*login/, { timeout: 5000 })
    expect(page.url()).toContain('login')
  })

  test('Student cannot access admin dashboard', async ({ page }) => {
    // Login as student
    await loginPage.goto()
    await loginPage.login(TEST_USERS.student.email, TEST_USERS.student.password)
    
    // Try to access admin dashboard
    await page.goto('/admin-dashboard')
    
    // Should redirect or show error
    await page.waitForTimeout(2000)
    const url = page.url()
    expect(url).not.toContain('admin-dashboard')
  })

  test('Successful login persists across page reloads', async ({ page }) => {
    await loginPage.goto()
    await loginPage.login(TEST_USERS.student.email, TEST_USERS.student.password)
    
    // Reload page
    await page.reload()
    
    // Should still be logged in
    await page.waitForTimeout(1000)
    const url = page.url()
    expect(url).toContain('dashboard')
  })

  test('Logout clears session', async ({ page }) => {
    await loginPage.goto()
    await loginPage.login(TEST_USERS.student.email, TEST_USERS.student.password)
    
    // Logout
    await page.click('button:has-text("Logout"), a:has-text("Logout")')
    
    // Try to access dashboard
    await page.goto('/dashboard')
    
    // Should redirect to login
    await page.waitForURL(/.*login/)
  })
})

test.describe('Form Validation', () => {
  test('Email field validates format', async ({ page }) => {
    await page.goto('/login')
    
    // Enter invalid email
    await page.fill('input[type="email"]', 'notanemail')
    await page.fill('input[type="password"]', 'password')
    await page.click('button[type="submit"]')
    
    // Should show validation error
    const validation = await page.$('.validation-error, input:invalid')
    expect(validation).toBeTruthy()
  })

  test('Password field enforces minimum length', async ({ page }) => {
    await page.goto('/signup')
    
    // Enter short password
    await page.fill('input[name="password"]', '12')
    await page.blur('input[name="password"]')
    
    // Should show error
    const error = await page.waitForSelector('.error, .validation-error')
    expect(error).toBeTruthy()
  })
})
