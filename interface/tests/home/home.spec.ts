import { test, expect } from '@playwright/test';

test.use({
  viewport: { width: 390, height: 844 },
});

test.beforeEach(async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/home');
})

test('bottom navigation', async ({ page, context }) => {
  await page.getByRole('button', { name: 'Home' }).click();
  await page.waitForURL('**/home');
  await page.getByRole('button', { name: 'Market' }).click();
  await page.waitForURL('**/market');
  await page.getByRole('button', { name: 'Trade' }).click();
  await page.waitForURL('**/trade');
  await page.getByRole('button', { name: 'Grow' }).click();
  await page.waitForURL('**/grow');
  await page.getByRole('button', { name: 'Wallet' }).click();
  await page.waitForURL('**/wallet');
})

test('search', async ({ page, context }) => {
  // Click on search bar
  await page.getByRole('button', { name: 'Search' }).click();

  const symbols = ['btc', 'eth', 'usdc', 'usdt', 'xrp', 'sol']
  for (let i=0; i<symbols.length; i++) {
    // Fill text
    await page.getByPlaceholder('Search').fill(symbols[i]);
    // Wait
    await page.waitForTimeout(1000);
    // Click on result
    await page.getByRole('button', { name: symbols[i] }).first().click();
    // Wait page change
    await page.waitForURL('**/market/coin/**');
    // Check result
    await expect(page.getByText(symbols[i], { exact: true })).toHaveText(symbols[i]);
    // Back
    await page.getByRole('banner').getByRole('button').first().click();
  }
})

test('search history', async ({ page, context}) => {
  
})

test('news', async ({ page, context}) => {
  await page.getByRole('banner').getByRole('button').nth(2).click();
  await page.getByRole('banner').getByRole('button').first().click();
})

test('connect', async ({ page, context }) => {
  await page.getByRole('button', { name: 'Connect' }).click();
  const pagePromise = context.waitForEvent('page');
  const newPage = await pagePromise;
  await newPage.waitForLoadState();
  expect(newPage.url()).toContain('https://mixin.one/codes/');
})

test('app shortcuts', async ({ page, context }) => {
  await page.locator('.flex > .btn').first().click();
  await page.waitForURL('**/trade');
  await page.getByRole('button', { name: 'Home' }).click();

  await page.locator('.grid > div:nth-child(2) > .btn').click();
  await page.waitForURL('**/trade');
  await page.getByRole('button', { name: 'Home' }).click();

  await page.locator('div:nth-child(3) > .btn').first().click();
  await page.waitForURL('**/grow');
  await page.getByRole('button', { name: 'Home' }).click();

  await page.locator('div:nth-child(4) > .btn').click();
  await page.waitForURL('**/grow/arbitrage');
  await page.getByRole('button').first().click();
  await page.getByRole('button', { name: 'Home' }).click();

  await page.locator('div:nth-child(5) > .btn').click();
  await page.waitForURL('**/home/more');
  await page.getByRole('banner').getByRole('button').first().click();
})

test('more apps', async ({ page, browserName }) => {
  test.skip(browserName === 'firefox', 'Firefox bug: https://github.com/microsoft/playwright/issues/20749');
  await page.locator('div:nth-child(5) > .btn').click();
  await page.waitForURL('**/home/more');

  await page.locator('.btn').first().click();
  await page.locator('div:nth-child(2) > .btn').first().click();
  await page.waitForLoadState()
  await page.goto('/home/more');
  await page.locator('div:nth-child(2) > .grid > div > .btn').first().click();
  await page.waitForLoadState()
  await page.goto('/home/more');
  await page.locator('div:nth-child(2) > .grid > div:nth-child(2) > .btn').click();
  await page.waitForLoadState()
  await page.goto('/home/more');
  await page.locator('div:nth-child(3) > .btn').click();
  await page.waitForLoadState()
  await page.goto('/home/more');
  await page.locator('div:nth-child(3) > .grid > div > .btn').first().click();
  await page.waitForLoadState()
  await page.goto('/home/more');
  await page.locator('div:nth-child(3) > .grid > div:nth-child(2) > .btn').click();
  await page.waitForLoadState()
  await page.goto('/home/more');
  await page.locator('div:nth-child(4) > .grid > div > .btn').first().click();
  const page2Promise = page.waitForEvent('popup');
  await page.locator('div:nth-child(4) > .grid > div:nth-child(2) > .btn').click();
  const page2 = await page2Promise;
  await page2.waitForLoadState();
  expect(page2.url()).toContain('https://mixin.one/apps/');
})

test('sorting tokens by category', async ({ page, context }) => {
  await page.getByRole('button', { name: 'Favorites' }).click()
  await page.getByRole('button', { name: 'All', exact: true }).click();
  await page.getByRole('button', { name: 'Mainstream' }).click();
  await page.getByRole('button', { name: 'Layer 1' }).click();
  await page.getByRole('button', { name: 'Layer 2' }).click();
  await page.getByRole('button', { name: 'Inscription' }).click();
  await page.getByRole('button', { name: 'Ai', exact: true }).click();
  await page.getByRole('button', { name: 'Meme' }).click();
  await page.getByRole('button', { name: 'DeFi' }).click();
  await page.getByRole('button', { name: 'GameFi' }).click();
  await page.getByRole('button', { name: 'NFT' }).click();
})

test('sorting by name price and 24chg', async ({ page, context }) => {
  await page.getByRole('button', { name: 'Name' }).getByRole('button').click();
  await page.getByRole('button', { name: 'Name' }).getByRole('button').click();
  await page.getByRole('button', { name: 'Price' }).getByRole('button').click();
  await page.getByRole('button', { name: 'Price' }).getByRole('button').click();
  await page.getByRole('button', { name: '24h chg' }).getByRole('button').click();
  await page.getByRole('button', { name: '24h chg' }).getByRole('button').click();
  await page.getByRole('button', { name: 'Name' }).click();
  await page.getByRole('button', { name: 'Price' }).click();
  await page.getByRole('button', { name: '24h chg' }).click();
})

// test('', async ({ page, context }) => {
// })