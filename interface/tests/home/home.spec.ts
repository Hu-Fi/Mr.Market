import { test, expect } from '@playwright/test';

test.use({
  viewport: { width: 390, height: 844 },
});

test.beforeEach(async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/home');
})

// Too slow to run
test.skip('bottom navigation', async ({ page }) => {
  await page.getByTestId('bottom-nav-market').click();
  await page.waitForURL('**/market/token');

  await page.getByTestId('bottom-nav-trade').click();
  await page.waitForURL('**/spot');

  await page.getByTestId('bottom-nav-grow').click();
  await page.waitForURL('**/grow');

  await page.getByTestId('bottom-nav-wallet').click();
  await page.waitForURL('**/wallet');
})

// Failed because of backend
test.skip('search token', async ({ page }) => {
  // Click on search bar
  await page.getByTestId('home-search').click();

  const symbols = ['btc', 'eth', 'usdc', 'usdt', 'xrp']
  for (let i=0; i<symbols.length; i++) {
    // Fill text
    await page.getByPlaceholder('Search').fill(symbols[i]);
    
    await page.getByPlaceholder('Search').waitFor({ state: "visible" })
    // Click on result
    await page.getByRole('button', { name: symbols[i] }).first().click();
    // Wait page change
    await page.waitForURL('**/market/token/**');
    // Check result (Set timeout due to webkit action is slow)
    await expect(page.getByText(symbols[i], { exact: true })).toHaveText(symbols[i], {timeout:10000});
    // Back
    await page.getByRole('banner').getByRole('button').first().click();
  }
})

test.skip('search token history', async ({ page }) => {
  
})

test.skip('news', async ({ page}) => {
  await page.getByTestId('home-news').click();
  await page.waitForURL('**/home/news')
})

test.skip('connect', async ({ page, context }) => {
  await page.getByRole('button', { name: 'Connect' }).click();
  const pagePromise = context.waitForEvent('page');
  const newPage = await pagePromise;
  await newPage.waitForLoadState();
  expect(newPage.url()).toContain('https://mixin.one/codes/');
})

// Too slow to run
test.skip('app shortcuts', async ({ page }) => {
  await page.getByTestId('home-page-app-swap').click();
  await page.waitForURL('**/swap');
  await page.goto('/home');
  await page.waitForURL('**/home');

  await page.getByTestId('home-page-app-spot').click();
  // Increase timeout due to slow webkit action
  await page.waitForURL('**/spot/**', {timeout: 10000});
  await page.goto('/home')
  await page.waitForURL('**/home');

  await page.getByTestId('home-page-app-earn').click();
  // Increase timeout due to slow webkit action
  await page.waitForURL('**/grow', {timeout: 10000});
  await page.goto('/home');
  await page.waitForURL('**/home');

  await page.getByTestId('home-page-app-arbitrage').click();
  await page.waitForURL('**/grow/arbitrage', {timeout: 10000});
  await page.getByRole('button').first().click();
  await page.goto('/home');
  await page.waitForURL('**/home');

  await page.getByTestId('home-page-app-more').click();
  await page.waitForURL('**/home/more', {timeout: 10000});
  await page.getByRole('banner').getByRole('button').first().click();
})

test.skip('more apps', async ({ page, browserName }) => {
  test.skip(browserName === 'firefox', 'Firefox bug: https://github.com/microsoft/playwright/issues/20749');
  await page.getByTestId('home-page-app-more').click();
  await page.waitForURL('**/home/more');

  await page.getByTestId('more-app-swap').click();
  await page.waitForLoadState();
  await page.waitForURL('**/swap');
  await page.goto('/home/more');
  await page.getByTestId('more-app-spot').click();
  await page.waitForLoadState()
  await page.waitForURL('**/spot');
  await page.goto('/home/more');
  await page.waitForURL('**/home/more');
  await page.getByTestId('more-app-earn').click();
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
  await page.getByTestId('more-app-token').click();
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

// Will be updated when these parts are accomplished
test.skip('sorting tokens by category', async ({ page }) => {
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

// Will be updated when these parts are accomplished
test.skip('sorting by name price and 24chg', async ({ page }) => {
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

// test('', async ({ page }) => {
// })
