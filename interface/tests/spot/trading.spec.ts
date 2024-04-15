import { test, expect } from '@playwright/test';

test.use({
  viewport: { width: 390, height: 844 },  // iPhone 14 Pro
});

test.beforeEach(async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/spot');
})

test('switch buy and sell', async ({ page }) => {
  // buy
  await page.getByTestId('type_buy').click()
  let actionButtonText = await page.locator('//div/div[1]/main/div/div[1]/div[1]/div[4]/button/span').textContent()
  expect(actionButtonText?.toLocaleLowerCase()).toContain('buy')
  
  // sell
  await page.getByTestId('type_sell').click()
  actionButtonText = await page.locator('//div/div[1]/main/div/div[1]/div[1]/div[4]/button').textContent()
  expect(actionButtonText?.toLocaleLowerCase()).toContain('sell')
});

test('select limit/market order', async ({ page }) => {
  // Open dialog
  await page.getByTestId('order_type_selector').click()
  // Select limit order
  await page.locator('//*[@id="order_type_modal"]/div/div[2]/button[1]').click()
  let actionButtonText = await page.locator('//div/div[1]/main/div/div[1]/div[1]/div[2]/button/span').textContent()
  expect(actionButtonText?.toLocaleLowerCase()).toContain('limit')

  // Open dialog
    await page.getByTestId('order_type_selector').click()

  // Select market order
  await page.locator('//*[@id="order_type_modal"]/div/div[2]/button[2]').click()
  actionButtonText = await page.locator('//div/div[1]/main/div/div[1]/div[1]/div[2]/button/span').textContent()
  expect(actionButtonText?.toLocaleLowerCase()).toContain('market')
});

test('create buy/sell market order', async ({ page }) => {
  const amount = '1234.2346'
  // Click buy tab
  await page.getByTestId('type_buy').click()
  // Enter amount
  await page.locator("//div/div[1]/main/div/div[1]/div[1]/div[3]/div[3]/input").click()
  await page.keyboard.type(amount);
  // Click buy action
  await page.getByTestId('confirm_order').click()
  let payAmount = await page.locator('//*[@id="order_confirm_modal"]/div/div/div[3]/div[1]/span[2]').textContent()
  let actualAmount = await page.locator("//div/div[1]/main/div/div[1]/div[1]/div[3]/div[3]/input").textContent()
  expect(payAmount).toContain(actualAmount)
  // Confirm order
  await page.locator('//*[@id="order_confirm_modal"]/div/div/div[4]/button').click()
  

  // Close
  await page.locator('//*[@id="order_confirm_modal"]/div/div/div[1]/button').click()
  await page.locator("//div/div[1]/main/div/div[1]/div[1]/div[3]/div[3]/input").fill('')

  // Click sell tab
  await page.getByTestId('type_sell').click()
  // Enter amount
  await page.locator("//div/div[1]/main/div/div[1]/div[1]/div[3]/div[3]/input").click()
  await page.keyboard.type(amount);
  // Click sell action
  await page.getByTestId('confirm_order').click()
  payAmount = await page.locator('//*[@id="order_confirm_modal"]/div/div/div[2]/span[2]').textContent()
  actualAmount = await page.locator("//div/div[1]/main/div/div[1]/div[1]/div[3]/div[3]/input").textContent()
  expect(payAmount).toContain(actualAmount)
  // Confirm order
  await page.locator('//*[@id="order_confirm_modal"]/div/div/div[4]/button').click()
});

test('connect wallet', async({ page, context }) => {
  await page.getByRole('button', { name: 'Connect Wallet' }).first().click();
  const pagePromise = context.waitForEvent('page');
  const newPage = await pagePromise;
  await newPage.waitForLoadState();
  expect(newPage.url()).toContain('https://mixin.one/codes/');
})

test('create buy limit order', async ({ page }) => {
  const price = '10000'; const recvAmount = '10'; const estimatedPay = Number(price)*Number(recvAmount)

  // Open dialog
    await page.getByTestId('order_type_selector').click()

  // Select limit order
  await page.locator('//*[@id="order_type_modal"]/div/div[2]/button[1]').click()

  // Click on limit price
  await page.locator('//div/div[1]/main/div/div[1]/div[1]/div[3]/div[1]/input').click()
  await page.locator('//div/div[1]/main/div/div[1]/div[1]/div[3]/div[1]/input').fill(price)
  
  // Click on pay amount
  await page.locator('//div/div[1]/main/div/div[1]/div[1]/div[3]/div[3]/input').click()
  await page.keyboard.type(recvAmount);

  // Check estimated amount
  const expectedReceive = page.locator('//div/div[1]/main/div/div[1]/div[1]/div[3]/div[5]/input')
  expect(expectedReceive).toHaveValue(`${estimatedPay}`, {timeout: 2000})  

  // Click buy action
  await page.locator('//div/div[1]/main/div/div[1]/div[1]/div[4]/button/span').click()

  // Check Recv amount
  const recvAmountX = await page.locator('//*[@id="order_confirm_modal"]/div/div/div[2]/span[2]').textContent()
  expect(recvAmountX).toContain(recvAmount)

  // Check Pay amount
  const estimatedPayX = await page.locator('//*[@id="order_confirm_modal"]/div/div/div[3]/div[1]/span[2]').textContent()
  expect(estimatedPayX).toContain(estimatedPay.toString())

  // Confirm order
  await page.locator('//*[@id="order_confirm_modal"]/div/div/div[4]/button').click()
});


test.skip('create sell limit order', async ({ page }) => {
  const price = '10000'; const payAmount = '10'; const estimatedRecv = Number(price)*Number(payAmount)

  // Open dialog
    await page.getByTestId('order_type_selector').click()

  // Select limit order
  await page.locator('//*[@id="order_type_modal"]/div/div[2]/button[1]').click()
  
  // Click sell tab
  await page.locator('//div/div[1]/main/div/div[1]/div[1]/div[1]/button[2]').click()

  // Click on limit price
  await page.locator('//div/div[1]/main/div/div[1]/div[1]/div[3]/div[1]/input').click()
  await page.locator('//div/div[1]/main/div/div[1]/div[1]/div[3]/div[1]/input').fill(price)
  
  // Click on pay amount
  await page.locator('//div/div[1]/main/div/div[1]/div[1]/div[3]/div[3]/input').click()
  await page.keyboard.type(payAmount);
  
  // Check estimated amount
  const expectedReceive = page.locator('//div/div[1]/main/div/div[1]/div[1]/div[3]/div[5]/input')
  expect(expectedReceive).toHaveValue(`${estimatedRecv}`, {timeout: 2000})  

  // Click buy action
  await page.locator('//div/div[1]/main/div/div[1]/div[1]/div[4]/button/span').click()

  // Check Recv amount
  const estimatedRecvX = await page.locator('//*[@id="order_confirm_modal"]/div/div/div[2]/span[2]').textContent()
  expect(estimatedRecvX).toContain(estimatedRecv.toString())

  // Check Pay amount
  const payAmountX = await page.locator('//*[@id="order_confirm_modal"]/div/div/div[3]/div[1]/span[2]').textContent()
  expect(payAmountX).toContain(payAmountX)

  // Confirm order
  await page.locator('//*[@id="order_confirm_modal"]/div/div/div[4]/button').click()
});

