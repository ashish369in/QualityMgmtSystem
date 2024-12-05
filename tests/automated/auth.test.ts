import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should login successfully', async ({ page }) => {
    // Select first user from dropdown (usually Quality role)
    await page.selectOption('select[name="userId"]', '1');
    await page.click('button[type="submit"]');

    // Verify redirect to dashboard
    await expect(page).toHaveURL('/');

    // Verify user info in header
    const userInfo = await page.textContent('.text-sm.text-gray-700');
    expect(userInfo).toContain('Quality');
  });

  test('should persist authentication', async ({ page }) => {
    // Login
    await page.selectOption('select[name="userId"]', '1');
    await page.click('button[type="submit"]');

    // Verify localStorage token
    const token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBeTruthy();

    // Refresh page
    await page.reload();

    // Verify still on dashboard
    await expect(page).toHaveURL('/');
  });

  test('should logout successfully', async ({ page }) => {
    // Login first
    await page.selectOption('select[name="userId"]', '1');
    await page.click('button[type="submit"]');

    // Click logout
    await page.click('button:has-text("Logout")');

    // Verify redirect to login
    await expect(page).toHaveURL('/login');

    // Verify token removed
    const token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBeNull();
  });

  test('should protect routes when not authenticated', async ({ page }) => {
    // Try accessing protected route directly
    await page.goto('/issues');

    // Should redirect to login
    await expect(page).toHaveURL('/login');
  });
});
