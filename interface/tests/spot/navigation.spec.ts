import { test } from '@playwright/test';

test.use({
  viewport: { width: 390, height: 844 },  // iPhone 14 Pro
});

test.beforeEach(async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/spot');
})

test('open/close pair selector', async ({ page }) => {
  // Open
  await page.getByTestId('spot_pair_selector').click();

  // Close 
  await page.getByTestId('spot_pair_selector_close').click();
});

test('goto candlestick', async ({ page }) => {
  await page.locator('.sticky > div > div > button').first().click();
  await page.waitForURL('**/market/candle/**');
});