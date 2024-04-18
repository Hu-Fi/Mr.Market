import { test, expect } from '@playwright/test';

test.use({
  viewport: { width: 390, height: 844 },  // iPhone 14 Pro
});

test.beforeEach(async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/grow');
})

test('create market making', async ({ page }) => {
  await page.getByTestId('market-making').click();
  await page.waitForURL('**/grow/market_making');

  await page.getByTestId('create-new-market-making').click();
  await page.waitForURL('**/new/**');

  await page.getByTestId('market-making-pair-0').click();
  await page.waitForURL('**/two');

  expect(page.getByTestId(`amount-input-0`)).toBeVisible();
  expect(page.getByTestId(`amount-input-1`)).toBeVisible();

  expect(page.getByTestId(`confirm-btn`)).toBeDisabled();

  await page.getByTestId(`amount-input-0`).fill('0.00000001');
  await page.getByTestId(`amount-input-1`).fill('0.00000001');

  expect(page.getByTestId(`confirm-btn`)).toBeEnabled();
  await page.getByTestId(`confirm-btn`).click();
})