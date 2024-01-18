import { test, expect } from '@playwright/test';

test.use({
  viewport: { width: 390, height: 844 },
});

test.beforeEach(async ({ page }) => {
  await page.goto('https://hufiui.vercel.app/home');
})

const EXPECT_TIME = 400  // 400 ms

test('bottom navigation', async ({ page, context }) => {
  for (let index = 0; index < 10; index++) {
    await page.getByRole('button', { name: 'Home' }).click();
    await page.waitForURL('**/home');
    let time1 = new Date().getTime();

    await page.getByRole('button', { name: 'Market' }).click();
    await page.waitForURL('**/market');
    let time2 = new Date().getTime();
    let Home2Market = time2 - time1
    console.log('Home -> Market', Home2Market, 'ms')

    await page.getByRole('button', { name: 'Trade' }).click();
    await page.waitForURL('**/trade');
    let time3 = new Date().getTime();
    let Market2Trade = time3 - time2
    console.log('Market -> Trade', Market2Trade, 'ms')

    await page.getByRole('button', { name: 'Grow' }).click();
    await page.waitForURL('**/grow');
    let time4 = new Date().getTime();
    let Trade2Grow = time4 - time3
    console.log('Trade -> Grow', Trade2Grow, 'ms')

    await page.getByRole('button', { name: 'Wallet' }).click();
    await page.waitForURL('**/wallet');
    let time5 = new Date().getTime();
    let Grow2Wallet = time5 - time4
    console.log('Grow -> Wallet', Grow2Wallet, 'ms')

    await page.getByRole('button', { name: 'Home' }).click();
    await page.waitForURL('**/home');
    let time6 = new Date().getTime();
    let Wallet2Home = time6 - time5
    console.log('Wallet -> Home', Wallet2Home, 'ms')
    console.log()

    // expect(Home2Market).toBeLessThan(EXPECT_TIMEs)
    // expect(Market2Trade).toBeLessThan(EXPECT_TIME)
    expect(Trade2Grow).toBeLessThan(EXPECT_TIME)
    expect(Grow2Wallet).toBeLessThan(EXPECT_TIME)
    expect(Wallet2Home).toBeLessThan(EXPECT_TIME)
  }
})

test('trade navigation', async ({ page, context }) => {
  for (let index = 0; index < 10; index++) {
    let time1 = new Date().getTime();
    await page.getByRole('button', { name: 'Trade' }).click();
    await page.waitForURL('**/trade');
    await page.getByRole('button', { name: 'Home' }).click();
    await page.waitForURL('**/home');
    
    let time2 = new Date().getTime();
    await page.getByRole('button', { name: 'Trade' }).click();
    await page.waitForURL('**/trade');
    await page.getByRole('button', { name: 'Market' }).nth(3).click();
    await page.waitForURL('**/market');

    let time3 = new Date().getTime();
    await page.getByRole('button', { name: 'Trade' }).click();
    await page.waitForURL('**/trade');
    await page.getByRole('button', { name: 'Grow' }).click();
    await page.waitForURL('**/grow');

    let time4 = new Date().getTime();
    await page.getByRole('button', { name: 'Trade' }).click();
    await page.waitForURL('**/trade');
    await page.getByRole('button', { name: 'Wallet', exact: true }).click();
    await page.waitForURL('**/wallet');

    let time5 = new Date().getTime();

  }
})