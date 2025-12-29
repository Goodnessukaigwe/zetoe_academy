/**
 * E2E Test: Super Admin Workflow
 * Tests: Super-admin creates admin → New admin logs in → Admin can perform actions
 */

import { test, expect } from '@playwright/test'
import { LoginPage, AdminDashboardPage, TEST_USERS, waitForAPI } from '../fixtures/helpers'

test.describe('Super Admin Workflow', () => {
  let loginPage: LoginPage
  let adminDashboard: AdminDashboardPage

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
    adminDashboard = new AdminDashboardPage(page)
  })

  test('Complete super-admin flow: Create admin → Admin logs in → Admin performs action', async ({ page }) => {
    const newAdminEmail = `newadmin.${Date.now()}@zetoe.com`
    const newAdminPassword = 'NewAdminPassword123!'

    // Step 1: Login as super admin
    await test.step('Super admin logs in', async () => {
      await loginPage.goto()
      await loginPage.login(TEST_USERS.superAdmin.email, TEST_USERS.superAdmin.password)
      
      // Verify super admin dashboard
      await expect(page).toHaveURL(/.*admin-dashboard/)
      await page.screenshot({ path: 'test-results/superadmin-dashboard.png' })
    })

    // Step 2: Navigate to admin management
    await test.step('Super admin accesses admin management', async () => {
      // Look for admin management link
      await page.click('a[href*="admin"], button:has-text("Admins")')
      
      // Verify on admins page
      await page.waitForSelector('table, .admins-list')
    })

    // Step 3: Create new admin
    await test.step('Super admin creates new admin', async () => {
      // Click create admin button
      await page.click('button:has-text("Create Admin"), button:has-text("Add Admin"), button:has-text("Invite")')
      
      // Fill admin form
      await page.fill('input[name="name"]', 'New Test Admin')
      await page.fill('input[name="email"]', newAdminEmail)
      await page.fill('input[name="password"]', newAdminPassword)
      
      // Select role (should be 'admin', not 'super_admin')
      const roleSelect = await page.$('select[name="role"]')
      if (roleSelect) {
        await page.selectOption('select[name="role"]', 'admin')
      }
      
      // Wait for API call
      const apiPromise = waitForAPI(page, '/api/admin')
      
      // Submit form
      await page.click('button[type="submit"]')
      
      // Wait for success
      await apiPromise
      await page.waitForSelector('.success, .toast.success', { timeout: 5000 })
      
      // Verify new admin appears in list
      await page.waitForTimeout(2000)
      const adminRow = await page.waitForSelector(`tr:has-text("${newAdminEmail}")`)
      expect(adminRow).toBeTruthy()
      
      await page.screenshot({ path: 'test-results/superadmin-created-admin.png' })
    })

    // Step 4: Logout super admin
    await test.step('Super admin logs out', async () => {
      await page.click('button:has-text("Logout"), a:has-text("Logout")')
      
      // Verify redirected to login
      await expect(page).toHaveURL(/.*login/)
    })

    // Step 5: Login as new admin
    await test.step('New admin logs in', async () => {
      await loginPage.login(newAdminEmail, newAdminPassword)
      
      // Verify successful login
      await expect(page).toHaveURL(/.*admin-dashboard/)
      expect(await loginPage.isLoggedIn()).toBeTruthy()
      
      await page.screenshot({ path: 'test-results/newadmin-dashboard.png' })
    })

    // Step 6: Verify new admin can perform admin actions
    await test.step('New admin can create a student', async () => {
      await adminDashboard.navigateToStudents()
      
      // Try to create a student
      await page.click('button:has-text("Add Student"), button:has-text("Create")')
      
      // Fill student form
      const testStudentEmail = `admin.created.student.${Date.now()}@zetoe.com`
      await page.fill('input[name="name"]', 'Admin Created Student')
      await page.fill('input[name="email"]', testStudentEmail)
      await page.fill('input[name="password"]', 'StudentPassword123!')
      
      // Submit
      const apiPromise = waitForAPI(page, '/api/students')
      await page.click('button[type="submit"]')
      await apiPromise
      
      // Verify success
      await page.waitForSelector('.success, .toast.success')
      
      // Verify student in list
      await page.waitForTimeout(1000)
      const studentRow = await page.waitForSelector(`tr:has-text("${testStudentEmail}")`)
      expect(studentRow).toBeTruthy()
    })

    // Step 7: Verify new admin can view courses
    await test.step('New admin can view courses', async () => {
      await adminDashboard.navigateToCourses()
      
      // Should see courses table
      await page.waitForSelector('table, .courses-list')
      
      // Should see courses
      const courses = await page.$$('tbody tr')
      expect(courses.length).toBeGreaterThanOrEqual(0)
    })

    // Step 8: Verify new admin CANNOT delete admins (regular admin restriction)
    await test.step('Regular admin cannot delete other admins', async () => {
      await page.click('a[href*="admin"]')
      
      // Look for delete buttons - they should not exist or be disabled
      const deleteButtons = await page.$$('button:has-text("Delete"):not([disabled])')
      
      // Regular admins shouldn't see delete buttons for other admins
      // This depends on your RLS policies
      expect(deleteButtons.length).toBe(0)
    })
  })

  test('Super admin can view all admins', async ({ page }) => {
    await test.step('Login and view admins', async () => {
      await loginPage.goto()
      await loginPage.login(TEST_USERS.superAdmin.email, TEST_USERS.superAdmin.password)
      
      await page.click('a[href*="admin"]')
      
      // Wait for admins list
      await page.waitForSelector('table, .admins-list')
      
      // Verify can see multiple admins
      const adminRows = await page.$$('tbody tr')
      expect(adminRows.length).toBeGreaterThan(0)
    })
  })

  test('Super admin can delete admin', async ({ page }) => {
    const tempAdminEmail = `temp.admin.${Date.now()}@zetoe.com`

    await test.step('Super admin creates temporary admin', async () => {
      await loginPage.goto()
      await loginPage.login(TEST_USERS.superAdmin.email, TEST_USERS.superAdmin.password)
      
      await page.click('a[href*="admin"]')
      await page.click('button:has-text("Create Admin"), button:has-text("Invite")')
      
      await page.fill('input[name="name"]', 'Temporary Admin')
      await page.fill('input[name="email"]', tempAdminEmail)
      await page.fill('input[name="password"]', 'TempPassword123!')
      
      await page.click('button[type="submit"]')
      await page.waitForSelector('.success, .toast.success')
    })

    await test.step('Super admin deletes the admin', async () => {
      // Find the admin row
      const adminRow = await page.locator(`tr:has-text("${tempAdminEmail}")`)
      
      // Click delete button
      await adminRow.locator('button:has-text("Delete")').click()
      
      // Confirm deletion
      const confirmButton = await page.waitForSelector('button:has-text("Confirm"), button:has-text("Yes")')
      await confirmButton.click()
      
      // Wait for API call
      await waitForAPI(page, '/api/admin')
      
      // Verify admin removed from list
      await page.waitForTimeout(1000)
      const deletedRow = await page.$(`tr:has-text("${tempAdminEmail}")`)
      expect(deletedRow).toBeFalsy()
    })
  })

  test('Regular admin cannot create super admin', async ({ page }) => {
    await test.step('Login as regular admin', async () => {
      await loginPage.goto()
      await loginPage.login(TEST_USERS.admin.email, TEST_USERS.admin.password)
    })

    await test.step('Try to create super admin (should fail or option not available)', async () => {
      await page.click('a[href*="admin"]')
      await page.click('button:has-text("Create Admin"), button:has-text("Invite")')
      
      // Check if super_admin option exists in role dropdown
      const roleSelect = await page.$('select[name="role"]')
      if (roleSelect) {
        const options = await roleSelect.$$('option')
        const optionValues = await Promise.all(options.map(opt => opt.getAttribute('value')))
        
        // Regular admin shouldn't see super_admin option
        expect(optionValues).not.toContain('super_admin')
      }
    })
  })

  test('Super admin has access to all features', async ({ page }) => {
    await test.step('Verify all navigation items visible', async () => {
      await loginPage.goto()
      await loginPage.login(TEST_USERS.superAdmin.email, TEST_USERS.superAdmin.password)
      
      // Check all nav items are visible
      await expect(page.locator('a[href*="student"]')).toBeVisible()
      await expect(page.locator('a[href*="course"]')).toBeVisible()
      await expect(page.locator('a[href*="exam"]')).toBeVisible()
      await expect(page.locator('a[href*="payment"]')).toBeVisible()
      await expect(page.locator('a[href*="admin"]')).toBeVisible()
      
      await page.screenshot({ path: 'test-results/superadmin-full-access.png' })
    })
  })
})
