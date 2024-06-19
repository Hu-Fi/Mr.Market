import { test } from '@playwright/test';

test.use({
  viewport: { width: 390, height: 844 },  // iPhone 14 Pro
});

test.beforeEach(async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/grow');
})

test('create just grow order', async ({ page }) => {
  await page.getByTestId('just-grow').click();
  await page.waitForURL('**/grow/just_grow');

  await page.getByTestId('create-new-just-grow').click();
  await page.getByTestId('just-grow-token-0').click();
  await page.getByTestId('amount-input-0').click();
  await page.getByTestId('amount-input-0').fill('0.000001');
  await page.locator('summary').click();
  await page.getByTestId('time-0').click();
  await page.getByTestId('confirm-btn').click();
  await page.getByTestId('confirm-order-btn').click();

  // TBD until the memo format is set
  // const pagePromise = page.waitForEvent('popup');
  // const newPage1 = await pagePromise;
  // await newPage1.waitForLoadState();
  // expect(newPage1.url()).toContain('https://mixin.one/pay');
})