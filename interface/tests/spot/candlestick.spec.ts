import { expect, test } from '@playwright/test';

test.use({
  viewport: { width: 390, height: 844 },  // iPhone 14 Pro
});

test.beforeEach(async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/market/candle/okx/BTC-USDT');
})

test('open/close pair selector', async ({ page }) => {
  // Open
  await page.getByTestId('candlestick_pair_selector').click();
  expect(await page.isVisible('//*[@id="candle_select_pair_modal"]/div/div[1]')).toBe(true)

  // Close 
  await page.getByTestId('candlestick_pair_selector_close').click();
});