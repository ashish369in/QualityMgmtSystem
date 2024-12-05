import { test, expect } from '@playwright/test';
import type { Issue } from '../../frontend/src/types/api';

test.describe('Issue Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login as Quality user
    await page.goto('/login');
    await page.selectOption('select[name="userId"]', '1');
    await page.click('button[type="submit"]');
    await page.goto('/issues');
  });

  test('should create issue successfully', async ({ page }) => {
    // Click create issue button
    await page.click('button:has-text("Create Issue")');

    // Fill form
    await page.fill('input[name="title"]', 'Test Issue');
    await page.fill('textarea[name="description"]', 'Test Description');

    // Select a defect if available
    const defectCheckbox = await page.$('input[type="checkbox"]');
    if (defectCheckbox) {
      await defectCheckbox.click();
    }

    // Submit form
    await page.click('button[type="submit"]:has-text("Create Issue")');

    // Verify success toast
    await expect(page.locator('div[role="status"]')).toContainText('Success');

    // Verify issue appears in list
    await expect(page.locator('td:has-text("Test Issue")')).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    // Click create issue button
    await page.click('button:has-text("Create Issue")');

    // Submit empty form
    await page.click('button[type="submit"]:has-text("Create Issue")');

    // Verify validation messages
    await expect(page.locator('text=Title is required')).toBeVisible();
    await expect(page.locator('text=Description is required')).toBeVisible();
  });

  test('should edit issue successfully', async ({ page }) => {
    // Create test issue first
    await page.click('button:has-text("Create Issue")');
    await page.fill('input[name="title"]', 'Issue to Edit');
    await page.fill('textarea[name="description"]', 'Original Description');
    await page.click('button[type="submit"]:has-text("Create Issue")');

    // Click on created issue
    await page.click('td:has-text("Issue to Edit")');

    // Click edit button
    await page.click('button:has-text("Edit")');

    // Update fields
    await page.fill('input[name="title"]', 'Updated Issue');
    await page.fill('textarea[name="description"]', 'Updated Description');
    await page.selectOption('select[name="status"]', 'InProgress');

    // Submit changes
    await page.click('button[type="submit"]:has-text("Update Issue")');

    // Verify success toast
    await expect(page.locator('div[role="status"]')).toContainText('Success');

    // Verify changes reflected
    await expect(page.locator('text=Updated Issue')).toBeVisible();
    await expect(page.locator('text=InProgress')).toBeVisible();
  });

  test('should create task in issue', async ({ page }) => {
    // Navigate to first issue
    await page.click('td >> nth=0');

    // Click create task button
    await page.click('button:has-text("Create Task")');

    // Fill task form
    await page.fill('input[name="title"]', 'Test Task');
    await page.fill('textarea[name="description"]', 'Task Description');
    await page.selectOption('select[name="assigneeId"]', '2'); // Assign to second user

    // Submit task
    await page.click('button[type="submit"]:has-text("Create Task")');

    // Verify success toast
    await expect(page.locator('div[role="status"]')).toContainText('Success');

    // Verify task appears in list
    await expect(page.locator('text=Test Task')).toBeVisible();
  });
});
