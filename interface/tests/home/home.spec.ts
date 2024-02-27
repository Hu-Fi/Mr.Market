import { test, expect } from '@playwright/test';

test.use({
  viewport: { width: 390, height: 844 },
});

test.beforeEach(async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/home');
})

test('bottom navigation', async ({ page, context }) => {
  await page.getByTestId('bottom-nav-home').click();
  await page.waitForURL('**/home');
  await page.getByTestId('bottom-nav-market').click();
  await page.waitForURL('**/market');
  await page.getByTestId('bottom-nav-trade').click();
  await page.waitForURL('**/spot');
  await page.getByTestId('bottom-nav-grow').click();
  await page.waitForURL('**/grow');
  await page.getByTestId('bottom-nav-wallet').click();
  await page.waitForURL('**/wallet');
})

test('search token', async ({ page, context }) => {
  // Click on search bar
  await page.getByTestId('home-search').click();

  const symbols = ['btc', 'eth', 'usdc', 'usdt', 'xrp']
  for (let i=0; i<symbols.length; i++) {
    // Fill text
    await page.getByPlaceholder('Search').fill(symbols[i]);
    // Wait
    await page.waitForTimeout(1000);
    // Click on result
    await page.getByRole('button', { name: symbols[i] }).first().click();
    // Wait page change
    await page.waitForURL('**/market/token/**');
    // Check result
    await expect(page.getByText(symbols[i], { exact: true })).toHaveText(symbols[i]);
    // Back
    await page.getByRole('banner').getByRole('button').first().click();
  }
})

test('search token history', async ({ page, context}) => {
  
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
  await page.getByTestId('home-page-app-swap').click();
  await page.waitForURL('**/swap');
  await page.getByTestId('bottom-nav-home').click();

  await page.getByTestId('home-page-app-spot').click();
  await page.waitForURL('**/spot');
  await page.getByTestId('bottom-nav-home').click();

  await page.getByTestId('home-page-app-earn').click();
  await page.waitForURL('**/grow');
  await page.getByTestId('bottom-nav-home').click();

  await page.getByTestId('home-page-app-arbitrage').click();
  await page.waitForURL('**/grow/arbitrage');
  await page.getByRole('button').first().click();
  await page.getByTestId('bottom-nav-home').click();

  await page.getByTestId('home-page-app-more').click();
  await page.waitForURL('**/home/more');
  await page.getByRole('banner').getByRole('button').first().click();
})

test('more apps', async ({ page, browserName }) => {
  test.skip(browserName === 'firefox', 'Firefox bug: https://github.com/microsoft/playwright/issues/20749');
  await page.getByTestId('home-page-app-more').click();
  await page.waitForURL('**/home/more');

  await page.locator('.btn').first().click();
  await page.getByTestId('more-app-spot').click();
  await page.waitForLoadState()
  await page.goto('/home/more');
  await page.waitForURL('**/home/more');
  await page.getByTestId('more-app-earn').first().click();
  await page.waitForLoadState()
  await page.goto('/home/more');
  await page.waitForURL('**/home/more');
  await page.getByTestId('more-app-arbitrage').click();
  await page.waitForLoadState()
  await page.goto('/home/more');
  await page.waitForURL('**/home/more');
  await page.getByTestId('more-app-market_making').click();
  await page.waitForLoadState()
  await page.goto('/home/more');
  await page.waitForURL('**/home/more');
  await page.getByTestId('more-app-coins').click();
  await page.waitForLoadState()
  await page.goto('/home/more');
  await page.waitForURL('**/home/more');
  await page.getByTestId('more-app-candle_stick').click();
  await page.waitForLoadState()
  await page.goto('/home/more');
  await page.waitForURL('**/home/more');
  await page.getByTestId('more-app-question').click();
  const page2Promise = page.waitForEvent('popup');
  await page.getByTestId('more-app-community').click();
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