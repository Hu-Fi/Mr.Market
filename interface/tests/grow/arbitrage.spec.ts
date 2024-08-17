import { test, expect } from '@playwright/test';

test.use({
  viewport: { width: 390, height: 844 },  // iPhone 14 Pro
});

test.beforeEach(async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/grow');
})

test('create arbitrage', async ({ page }) => {
  await page.getByTestId('arbitrage').click();
  await page.waitForURL('**/grow/arbitrage');

  await page.getByTestId('create-new-arbitrage').click();
  await page.waitForURL('**/new/**');

  await page.getByTestId('arbitrage-first-exchange-0').click();
  await page.getByTestId('arbitrage-second-exchange-0').click();
  await page.getByTestId('arbitrage-pair-0').click();

  expect(page.getByTestId(`amount-input-0`)).toBeVisible();
  expect(page.getByTestId(`amount-input-1`)).toBeVisible();

  expect(page.getByTestId(`confirm-btn`)).toBeDisabled();

  await page.getByTestId(`amount-input-0`).fill('0.00000001');
  await page.getByTestId(`amount-input-1`).fill('0.00000001');

  expect(page.getByTestId(`confirm-btn`)).toBeEnabled();
  await page.getByTestId(`confirm-btn`).click();

  const pagePromise1 = page.waitForEvent('popup');
  await page.getByTestId('pay-btn-1').click();
  const newPage1 = await pagePromise1;
  await newPage1.waitForLoadState();
  expect(newPage1.url()).toContain('https://mixin.one/pay');

  const pagePromise2 = page.waitForEvent('popup');
  await page.getByTestId('pay-btn-2').click();

  const newPage2 = await pagePromise2;
  await newPage2.waitForLoadState();
  expect(newPage2.url()).toContain('https://mixin.one/pay');
})