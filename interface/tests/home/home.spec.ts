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
  await page.getByRole('button', { name: 'Search' }).click();
  await page.getByPlaceholder('Search').fill('btc');
  await page.getByRole('button', { name: 'btc btc' }).click();
  await expect(page.getByText('btc', { exact: true })).toHaveText('btc');
  await page.getByRole('banner').getByRole('button').first().click();

  await page.getByPlaceholder('Search').fill('usdc');
  await page.getByRole('button', { name: 'usdc usdc' }).click();
  await expect(page.getByText('usdc', { exact: true })).toHaveText('usdc');
  await page.getByRole('banner').getByRole('button').first().click();

  await page.getByPlaceholder('Search').fill('usdt');
  await page.getByRole('button', { name: 'usdt usdt' }).click();
  await expect(page.getByText('usdt', { exact: true })).toHaveText('usdt');
  await page.getByRole('banner').getByRole('button').first().click();
})

test('history', async ({ page, context}) => {
  
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

  await page.locator('div:nth-child(5) > .btn').click();
  await page.waitForURL('**/home/more');
  await page.getByRole('banner').getByRole('button').first().click();
})

test('more apps', async ({ page, context }) => {
  await page.locator('div:nth-child(5) > .btn').click();
  await page.waitForURL('**/home/more');

  await page.locator('.btn').first().click();
  await page.locator('div:nth-child(2) > .btn').first().click();
  await page.goto('/home/more');
  await page.locator('div:nth-child(2) > .grid > div > .btn').first().click();
  await page.goto('/home/more');
  await page.locator('div:nth-child(2) > .grid > div:nth-child(2) > .btn').click();
  await page.goto('/home/more');
  await page.locator('div:nth-child(3) > .btn').click();
  await page.goto('/home/more');
  await page.locator('div:nth-child(3) > .grid > div > .btn').first().click();
  await page.goto('/home/more');
  await page.locator('div:nth-child(3) > .grid > div:nth-child(2) > .btn').click();
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