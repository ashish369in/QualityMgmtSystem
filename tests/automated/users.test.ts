import { test, expect } from '@playwright/test';
import type { User } from '../../frontend/src/types/api';

test.describe('User Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login as Quality user
    await page.goto('/login');
    await page.selectOption('select[name="userId"]', '1'); // Quality role
    await page.click('button[type="submit"]');
    await page.goto('/users');
  });

  test('should display users list for Quality role', async ({ page }) => {
    // Verify users page is accessible
    await expect(page).toHaveURL('/users');

    // Verify user list is visible
    await expect(page.locator('table')).toBeVisible();

    // Verify user details are displayed
    await expect(page.locator('td:has-text("Quality")')).toBeVisible();
  });

  test('should restrict access for non-Quality users', async ({ page }) => {
    // Logout
    await page.click('button:has-text("Logout")');

    // Login as non-Quality user
    await page.selectOption('select[name="userId"]', '2'); // LineSide role
    await page.click('button[type="submit"]');

    // Verify Users menu not visible
    await expect(page.locator('text=Users')).not.toBeVisible();

    // Try accessing users page directly
    await page.goto('/users');

    // Should redirect to dashboard
    await expect(page).toHaveURL('/');
  });

  test('should handle network errors gracefully', async ({ page, context }) => {
    // Fail all API requests
    await context.route('**/api/users**', (route) => {
      route.abort();
    });

    // Refresh page
    await page.reload();

    // Verify error message
    await expect(page.locator('text=Failed to load users')).toBeVisible();
  });

  test('should validate user form inputs', async ({ page }) => {
    // Click create user button
    await page.click('button:has-text("Create User")');

    // Submit empty form
    await page.click('button[type="submit"]');

    // Verify validation messages
    await expect(page.locator('text=Username is required')).toBeVisible();
    await expect(page.locator('text=Email is required')).toBeVisible();
    await expect(page.locator('text=User group is required')).toBeVisible();
  });

  test('should create user successfully', async ({ page }) => {
    // Click create user button
    await page.click('button:has-text("Create User")');

    // Fill form
    await page.fill('input[name="username"]', 'testuser');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.selectOption('select[name="userGroup"]', 'LineSide');

    // Submit form
    await page.click('button[type="submit"]');

    // Verify success toast
    await expect(page.locator('div[role="status"]')).toContainText('Success');

    // Verify user appears in list
    await expect(page.locator('td:has-text("testuser")')).toBeVisible();
  });

  test('should update user successfully', async ({ page }) => {
    // Click edit on first user
    await page.click('button:has-text("Edit") >> nth=0');

    // Update fields
    await page.fill('input[name="email"]', 'updated@example.com');
    await page.selectOption('select[name="userGroup"]', 'Others');

    // Submit changes
    await page.click('button[type="submit"]');

    // Verify success toast
    await expect(page.locator('div[role="status"]')).toContainText('Success');

    // Verify changes reflected
    await expect(page.locator('td:has-text("updated@example.com")')).toBeVisible();
    await expect(page.locator('td:has-text("Others")')).toBeVisible();
  });

  test('should delete user successfully', async ({ page }) => {
    // Store username of first user
    const username = await page.textContent('td >> nth=0');

    // Click delete on first user
    await page.click('button:has-text("Delete") >> nth=0');

    // Confirm deletion
    await page.click('button:has-text("Yes")');

    // Verify success toast
    await expect(page.locator('div[role="status"]')).toContainText('Success');

    // Verify user removed from list
    await expect(page.locator(`td:has-text("${username}")`)).not.toBeVisible();
  });
});
