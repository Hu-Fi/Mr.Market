import { test, expect } from '@playwright/test';

test.use({
  viewport: { width: 390, height: 844 },
});

test.beforeEach(async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/home');
})

const EXPECT_TIME = 1000  // 1000 ms

// Impossible to fail
test.skip('bottom navigation', async ({ page, context }) => {
  for (let index = 0; index < 10; index++) {
    await page.getByTestId('bottom-nav-home').click();
    await page.waitForURL('**/home');
    const time1 = new Date().getTime();

    await page.getByTestId('bottom-nav-market').click();
    await page.waitForURL('**/market');
    const time2 = new Date().getTime();
    const Home2Market = time2 - time1
    //console.log('Home -> Market', Home2Market, 'ms')

    await page.getByTestId('bottom-nav-trade').click();
    await page.waitForURL('**/spot');
    const time3 = new Date().getTime();
    const Market2Trade = time3 - time2
    //console.log('Market -> Trade', Market2Trade, 'ms')

    await page.getByTestId('bottom-nav-grow').click();
    await page.waitForURL('**/grow');
    const time4 = new Date().getTime();
    const Trade2Grow = time4 - time3
    //console.log('Trade -> Grow', Trade2Grow, 'ms')

    await page.getByTestId('bottom-nav-wallet').click();
    await page.waitForURL('**/wallet');
    const time5 = new Date().getTime();
    const Grow2Wallet = time5 - time4
    //console.log('Grow -> Wallet', Grow2Wallet, 'ms')

    await page.getByTestId('bottom-nav-home').click();
    await page.waitForURL('**/home');
    const time6 = new Date().getTime();
    const Wallet2Home = time6 - time5
    //console.log('Wallet -> Home', Wallet2Home, 'ms')
    //console.log()

    // expect(Home2Market).toBeLessThan(EXPECT_TIMEs)
    // expect(Market2Trade).toBeLessThan(EXPECT_TIME)
    expect(Trade2Grow).toBeLessThan(EXPECT_TIME)
    expect(Grow2Wallet).toBeLessThan(EXPECT_TIME)
    expect(Wallet2Home).toBeLessThan(EXPECT_TIME)
  }
})

// Impossible to fail
test.skip('trade navigation', async ({ page, context }) => {
  for (let index = 0; index < 10; index++) {
    const time1 = new Date().getTime();
    await page.getByTestId('bottom-nav-trade').click();
    await page.waitForURL('**/spot');
    await page.getByTestId('bottom-nav-home').click();
    await page.waitForURL('**/home');
    
    const time2 = new Date().getTime();
    await page.getByTestId('bottom-nav-trade').click();
    await page.waitForURL('**/spot');
    await page.getByTestId('bottom-nav-market').click();
    await page.waitForURL('**/market/token');

    const time3 = new Date().getTime();
    await page.getByTestId('bottom-nav-trade').click();
    await page.waitForURL('**/spot');
    await page.getByTestId('bottom-nav-grow').click();
    await page.waitForURL('**/grow');

    const time4 = new Date().getTime();
    await page.getByTestId('bottom-nav-trade').click();
    await page.waitForURL('**/spot');
    await page.getByTestId('bottom-nav-wallet').click();
    await page.waitForURL('**/wallet');

    const time5 = new Date().getTime();

  }
})