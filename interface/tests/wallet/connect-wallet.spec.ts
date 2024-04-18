import { test, expect } from '@playwright/test';

test.use({
  viewport: { width: 390, height: 844 },  // iPhone 14 Pro
});

test.beforeEach(async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/wallet');
})

test('connect wallet', async ({ page }) => {
  const page14Promise = page.waitForEvent('popup');
  await page.getByRole('button', { name: 'Connect Wallet' }).click();
  const newPage = await page14Promise;
  await newPage.waitForLoadState();
  expect(newPage.url()).toContain('https://mixin.one/codes/');
})