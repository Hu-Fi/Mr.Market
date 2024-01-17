import { test, expect } from '@playwright/test';

test.use({
  viewport: { width: 390, height: 844 },  // iPhone 14 Pro
});

test.beforeEach(async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/trade');
})

test('open/close pair selector', async ({ page, context }) => {
  // Open pair selector
  await page.locator("//div/div[1]/header/div/button").click()
  expect(await page.isVisible('//*[@id="select_pair_modal"]/div/div[1]')).toBe(true)

  // Close 
  await page.locator('//*[@id="select_pair_modal"]/div/div[1]/div[1]/div/form').click()
});

test('select pair', async ({ page, context }) => {
  expect(await page.getByTitle('pair-name').innerText()).toBe('BTC/USDT')

  for (let i = 1; i < 12; i++) {
    // Open pair selector
    await page.locator("//div/div[1]/header/div/button").click()

    // Select pair
    expect(await page.isVisible('//*[@id="select_pair_modal"]/div/div[1]')).toBe(true)
    const SelectedName = (await page.locator(`//*[@id="select_pair_modal"]/div/div[2]/div[${i}]/button/div[1]/span`).textContent())
    await page.locator(`//*[@id="select_pair_modal"]/div/div[2]/div[${i}]/button`).click()
    const ShownName = (await page.locator('//div/div[1]/header/div/button/span[1]').textContent())
    expect(SelectedName).toBe(ShownName)
  }
});

test('search pair', async ({ page, context }) => {
  for (let i = 1; i < 12; i++) {
    // Open pair selector
    await page.locator("//div/div[1]/header/div/button").click()

    // Select pair
    expect(await page.isVisible('//*[@id="select_pair_modal"]/div/div[1]')).toBe(true)
    const SelectedName = (await page.locator(`//*[@id="select_pair_modal"]/div/div[2]/div[${i}]/button/div[1]/span`).textContent())
    await page.locator(`//*[@id="select_pair_modal"]/div/div[2]/div[${i}]/button`).click()
    const ShownName = (await page.locator('//div/div[1]/header/div/button/span[1]').textContent())
    expect(SelectedName).toBe(ShownName)
  }
});

test('goto candlestick', async ({ page, context }) => {
  await page.locator('.sticky > div > div > button').first().click();
  await page.waitForURL('**/market/candle/**');
});

test('switch buy and sell', async ({ page, context }) => {
  // buy
  await page.locator('//div/div[1]/main/div/div[1]/div[1]/div[1]/button[1]').click()
  let actionButtonText = await page.locator('//div/div[1]/main/div/div[1]/div[1]/div[4]/button/span').textContent()
  expect(actionButtonText?.toLocaleLowerCase()).toContain('buy')
  
  // sell
  await page.locator('//div/div[1]/main/div/div[1]/div[1]/div[1]/button[2]').click()
  actionButtonText = await page.locator('//div/div[1]/main/div/div[1]/div[1]/div[4]/button').textContent()
  expect(actionButtonText?.toLocaleLowerCase()).toContain('sell')
});

test('select limit/market order', async ({ page, context }) => {
  // Open dialog
  await page.locator("//div/div[1]/main/div/div[1]/div[1]/div[2]/button").click()
  // Select limit order
  await page.locator('//*[@id="order_type_modal"]/div/div[2]/button[1]').click()
  let actionButtonText = await page.locator('//div/div[1]/main/div/div[1]/div[1]/div[2]/button/span').textContent()
  expect(actionButtonText?.toLocaleLowerCase()).toContain('limit')

  // Open dialog
  await page.locator("//div/div[1]/main/div/div[1]/div[1]/div[2]/button").click()
  // Select market order
  await page.locator('//*[@id="order_type_modal"]/div/div[2]/button[2]').click()
  actionButtonText = await page.locator('//div/div[1]/main/div/div[1]/div[1]/div[2]/button/span').textContent()
  expect(actionButtonText?.toLocaleLowerCase()).toContain('market')
});

test('create buy/sell market order', async ({ page, context }) => {
  let amount = '1234.2346'
  // Click buy tab
  await page.locator('//div/div[1]/main/div/div[1]/div[1]/div[1]/button[1]').click()
  // Enter amount
  await page.locator("//div/div[1]/main/div/div[1]/div[1]/div[3]/div[3]/input").click()
  await page.keyboard.type(amount);
  // Click buy action
  await page.locator('//div/div[1]/main/div/div[1]/div[1]/div[4]/button/span').click()
  let payAmount = await page.locator('//*[@id="order_confirm_modal"]/div/div/div[3]/div[1]/span[2]').textContent()
  expect(payAmount).toContain(amount)
  // Confirm order
  await page.locator('//*[@id="order_confirm_modal"]/div/div/div[4]/button').click()
  

  // Close
  await page.locator('//*[@id="order_confirm_modal"]/div/div/div[1]/button').click()


  // Click sell tab
  await page.locator('//div/div[1]/main/div/div[1]/div[1]/div[1]/button[2]').click()
  // Enter amount
  await page.locator("//div/div[1]/main/div/div[1]/div[1]/div[3]/div[3]/input").click()
  await page.keyboard.type(amount);
  // Click sell action
  await page.locator('//div/div[1]/main/div/div[1]/div[1]/div[4]/button/span').click()
  payAmount = await page.locator('//*[@id="order_confirm_modal"]/div/div/div[2]/span[2]').textContent()
  expect(payAmount).toContain(amount)
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

test('create buy limit order', async ({ page, context }) => {
  let price = '10000'; let recvAmount = '10'; let estimatedPay = Number(price)*Number(recvAmount)

  // Open dialog
  await page.locator("//div/div[1]/main/div/div[1]/div[1]/div[2]/button").click()
  // Select limit order
  await page.locator('//*[@id="order_type_modal"]/div/div[2]/button[1]').click()

  // Click on limit price
  await page.locator('//div/div[1]/main/div/div[1]/div[1]/div[3]/div[1]/input').click()
  await page.keyboard.press('Control+a');
  await page.keyboard.press('Backspace');
  await page.keyboard.type(price);
  
  // Click on pay amount
  await page.locator('//div/div[1]/main/div/div[1]/div[1]/div[3]/div[3]/input').click()
  await page.keyboard.type(recvAmount);

  // Check estimated amount
  let expectedReceive = await page.locator('//div/div[1]/main/div/div[1]/div[1]/div[3]/div[5]/input').inputValue()
  expect(expectedReceive).toBe(`${estimatedPay}`)

  // Click buy action
  await page.locator('//div/div[1]/main/div/div[1]/div[1]/div[4]/button/span').click()

  // Check Recv amount
  let recvAmountX = await page.locator('//*[@id="order_confirm_modal"]/div/div/div[2]/span[2]').textContent()
  expect(recvAmountX).toContain(recvAmount)

  // Check Pay amount
  let estimatedPayX = await page.locator('//*[@id="order_confirm_modal"]/div/div/div[3]/div[1]/span[2]').textContent()
  expect(estimatedPayX).toContain(estimatedPay.toString())

  // Confirm order
  await page.locator('//*[@id="order_confirm_modal"]/div/div/div[4]/button').click()
});


test('create sell limit order', async ({ page, context }) => {
  let price = '10000'; let payAmount = '10'; let estimatedRecv = Number(price)*Number(payAmount)

  // Open dialog
  await page.locator("//div/div[1]/main/div/div[1]/div[1]/div[2]/button").click()
  // Select limit order
  await page.locator('//*[@id="order_type_modal"]/div/div[2]/button[1]').click()
  
  // Click sell tab
  await page.locator('//div/div[1]/main/div/div[1]/div[1]/div[1]/button[2]').click()

  // Click on limit price
  await page.locator('//div/div[1]/main/div/div[1]/div[1]/div[3]/div[1]/input').click()
  await page.keyboard.press('Control+a');
  await page.keyboard.press('Backspace');
  await page.keyboard.type(price);
  
  // Click on pay amount
  await page.locator('//div/div[1]/main/div/div[1]/div[1]/div[3]/div[3]/input').click()
  await page.keyboard.type(payAmount);

  // Check estimated amount
  let expectedReceive = await page.locator('//div/div[1]/main/div/div[1]/div[1]/div[3]/div[5]/input').inputValue()
  expect(expectedReceive).toBe(`${estimatedRecv}`)

  // Click buy action
  await page.locator('//div/div[1]/main/div/div[1]/div[1]/div[4]/button/span').click()

  // Check Recv amount
  let estimatedRecvX = await page.locator('//*[@id="order_confirm_modal"]/div/div/div[2]/span[2]').textContent()
  expect(estimatedRecvX).toContain(estimatedRecv.toString())

  // Check Pay amount
  let payAmountX = await page.locator('//*[@id="order_confirm_modal"]/div/div/div[3]/div[1]/span[2]').textContent()
  expect(payAmountX).toContain(payAmountX)

  // Confirm order
  await page.locator('//*[@id="order_confirm_modal"]/div/div/div[4]/button').click()
});


test('click order book to set limit price', async({ page, context }) => {
  // Open dialog
  await page.locator("//div/div[1]/main/div/div[1]/div[1]/div[2]/button").click()
  // Select limit order
  await page.locator('//*[@id="order_type_modal"]/div/div[2]/button[1]').click()
  
  for (let index = 1; index < 7; index++) {
    const price = await page.locator(`//div/div[1]/main/div/div[1]/div[2]/div/div[2]/div[1]/button[${index}]/div[1]/span`).textContent()
    await page.locator(`//div/div[1]/main/div/div[1]/div[2]/div/div[2]/div[1]/button[${index}]`).click() 
    const currentInput = await page.locator('//div/div[1]/main/div/div[1]/div[1]/div[3]/div[1]/input').inputValue()
    expect(price?.replace(',','')).toContain(currentInput)
  }

  await page.locator('//div/div[1]/main/div/div[1]/div[2]/div/div[2]/div[2]/button').click()
  const currentPrice = await page.locator('//div/div[1]/main/div/div[1]/div[2]/div/div[2]/div[2]/button/span').textContent()
  let currentInput = await page.locator('//div/div[1]/main/div/div[1]/div[1]/div[3]/div[1]/input').inputValue()
  expect(currentPrice?.replace(',','')).toContain(currentInput)


  for (let index = 1; index < 7; index++) {
    const price = await page.locator(`//div/div[1]/main/div/div[1]/div[2]/div/div[2]/div[3]/button[${index}]/div[1]/span`).textContent()
    await page.locator(`//div/div[1]/main/div/div[1]/div[2]/div/div[2]/div[3]/button[${index}]`).click() 
    const currentInput = await page.locator('//div/div[1]/main/div/div[1]/div[1]/div[3]/div[1]/input').inputValue()
    expect(price?.replace(',','')).toContain(currentInput)
  }
})

// test('click', async({ page, context }) => {
// })