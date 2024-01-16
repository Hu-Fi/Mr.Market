import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/home');
})

test('Test bottom navigation', async ({ page, context }) => {
  await page.getByRole('button', { name: 'Home' }).click();
  await page.getByRole('button', { name: 'Market' }).click();
  await page.getByRole('button', { name: 'Trade' }).click();
  await page.getByRole('button', { name: 'Grow' }).click();
  await page.getByRole('button', { name: 'Wallet' }).click();
})

test('Test search', async ({ page, context }) => {
  await page.getByRole('button', { name: 'Search' }).click();
  await page.getByPlaceholder('Search').fill('btc');
  await page.getByRole('button', { name: 'btc btc 1 $835B $42,612.00 1.' }).click();
  await expect(page.getByText('btc', { exact: true })).toHaveText('btc');
  await page.getByRole('banner').getByRole('button').first().click();

  await page.getByPlaceholder('Search').fill('usdc');
  await page.getByRole('button', { name: 'usdc usdc 7 $25B $1.001 0.19%' }).click();
  await expect(page.getByText('usdc', { exact: true })).toHaveText('usdc');
  await page.getByRole('banner').getByRole('button').first().click();

  await page.getByPlaceholder('Search').fill('usdt');
  await page.getByRole('button', { name: 'usdt usdt 3 $95B $1.001 -0.02%' }).click();
  await expect(page.getByText('usdt', { exact: true })).toHaveText('usdt');
  await page.getByRole('banner').getByRole('button').first().click();
})

test('Test history', async ({ page, context}) => {
  
})

test('Test connect', async ({ page, context }) => {
  await page.getByRole('button', { name: 'Connect' }).click();
  const pagePromise = context.waitForEvent('page');
  const newPage = await pagePromise;
  await newPage.waitForLoadState();
  expect(newPage.url()).toContain('https://mixin.one/codes/');
})

test('Test app shortcuts', async ({ page, context }) => {
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

test('Test more apps', async ({ page, context }) => {
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

test('Test sorting tokens by category', async ({ page, context }) => {
  await page.getByRole('button', { name: 'Favorites' }).click()
  await page.getByRole('button', { name: 'All' }).click();
  await page.getByRole('button', { name: 'Mainstream' }).click();
  await page.getByRole('button', { name: 'Layer 1' }).click();
  await page.getByRole('button', { name: 'Layer 2' }).click();
  await page.getByRole('button', { name: 'Inscription' }).click();
  await page.getByRole('button', { name: 'Ai' }).click();
  await page.getByRole('button', { name: 'Meme' }).click();
  await page.getByRole('button', { name: 'DeFi' }).click();
  await page.getByRole('button', { name: 'GameFi' }).click();
  await page.getByRole('button', { name: 'NFT' }).click();
})

test('Test sorting by name price and 24chg', async ({ page, context }) => {
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