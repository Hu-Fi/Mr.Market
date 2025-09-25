import { test, expect } from '@playwright/test';

test.describe('Wallet', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://127.0.0.1:5173/wallet');
  });

  test('connect wallet', async ({ page }) => {
    const popupPromise = page.waitForEvent('popup');
    await page.getByRole('button', { name: 'Connect Wallet' }).click();

    const newPage = await popupPromise;
    await newPage.waitForLoadState();

    await expect(newPage).toHaveURL(/https:\/\/mixin\.one\/codes\//);
  });
});
