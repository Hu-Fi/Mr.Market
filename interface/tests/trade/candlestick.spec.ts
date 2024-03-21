import { test } from '@playwright/test';

test.use({
  viewport: { width: 390, height: 844 },  // iPhone 14 Pro
});

test.beforeEach(async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/market/candle/okx/BTC-USDT');
})

test.skip('open/close pair selector', async ({ page, context }) => {
  
})