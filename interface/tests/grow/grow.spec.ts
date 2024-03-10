import { test } from '@playwright/test';

test.use({
  viewport: { width: 390, height: 844 },  // iPhone 14 Pro
});

test.beforeEach(async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/grow');
})

// Too slow to run
test.skip('navigation', async ({ page }) => {
  await page.getByRole('button', { name: 'Arbitrage' }).first().click();
  await page.waitForURL('**/grow/arbitrage');
  await page.getByRole('button', { name: 'What\'s arbitrage?' }).click();
  await page.waitForURL('**/grow/arbitrage/intro');
  await page.getByRole('button').first().click();
  await page.getByRole('button', { name: 'Create new arbitrage' }).click();
  await page.waitForURL('**/grow/arbitrage/new');
  await page.getByRole('button').first().click();
  await page.getByRole('button').first().click();

  await page.getByRole('button', { name: 'Market making' }).first().click();
  await page.waitForURL('**/grow/market_making');
  await page.getByRole('button', { name: 'What\'s market making?' }).click();
  await page.waitForURL('**/grow/market_making/intro');
  await page.getByRole('button').first().click();
  await page.getByRole('button', { name: 'Start market making' }).click();
  await page.waitForURL('**/grow/market_making/new');
  await page.getByRole('button').first().click();
  await page.getByRole('button').first().click();

  await page.getByRole('button', { name: 'Auto invest', exact: true }).click();
  await page.waitForURL('**/grow/auto_invest');
  await page.getByRole('button').first().click();
})

// Test arbitrage and market making creation