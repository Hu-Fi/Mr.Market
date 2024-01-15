import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/home');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Home/);
});

test('has balance', async ({ page }) => {
  await page.goto('/home');
});
