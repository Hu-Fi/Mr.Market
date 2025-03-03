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
  let actionButtonText = await page.getByTestId('buy_button_text').textContent()
  expect(actionButtonText?.toLocaleLowerCase()).toContain('buy')
  
  // sell
  await page.getByTestId('type_sell').click()
  actionButtonText = await page.getByTestId('sell_button_text').textContent()
  expect(actionButtonText?.toLocaleLowerCase()).toContain('sell')
});

test('select limit/market order', async ({ page }) => {
  // Open dialog
  await page.getByTestId('order_type_selector').click()
  // Select limit order
  await page.getByTestId('limit_order_btn').click()
  let actionButtonText = await page.getByTestId('limit_order_btn-text').textContent()
  expect(actionButtonText?.toLocaleLowerCase()).toContain('limit')

  // Open dialog
  await page.getByTestId('order_type_selector').click()

  // Select market order
  await page.getByTestId('market-order-btn').click()
  actionButtonText = await page.getByTestId('market-order-btn-text').textContent()
  expect(actionButtonText?.toLocaleLowerCase()).toContain('market')
});

test('create buy/sell market order', async ({ page }) => {
  let isDialogOpen = await page.locator('#order_confirm_modal').evaluate(dialog => dialog.classList.contains('modal-open'));
  expect(isDialogOpen).toBeFalsy();

  const amount = '1234.2346'
  // Click buy tab
  await page.getByTestId('type_buy').click()
  // Enter amount
  await page.getByTestId('total_input').click()
  await page.keyboard.type(amount);
  
  // Click buy action
  await page.getByTestId('confirm_order').click()
  let payAmount = await page.getByTestId('order_confirm_pay_amount').textContent()
  let actualAmount = await page.getByTestId('total_input').textContent()
  expect(payAmount).toContain(actualAmount)
  // Confirm order
  await page.getByTestId('confirm_order_button').click()

  // Close
  await page.getByTestId('close_order_modal').click()
  await page.getByTestId('total_input').fill('')

  // Click sell tab
  await page.getByTestId('type_sell').click()
  // Enter amount
  await page.getByTestId('total_input').click()
  await page.keyboard.type(amount);
  // Click sell action
  await page.getByTestId('confirm_order').click()
  payAmount = await page.getByTestId('order_confirm_pay_amount').textContent()
  actualAmount = await page.getByTestId('total_input').textContent()
  expect(payAmount).toContain(actualAmount)
  
  // Check if confirm button is disabled
  const isConfirmButtonDisabled = await page.getByTestId('confirm_order_button').isDisabled();

  if (!isConfirmButtonDisabled) {
    // Confirm order
    await page.waitForSelector('[data-testid="confirm_order_button"]', { state: 'visible' });
    await page.getByTestId('confirm_order_button').click()
  }

  // Close
  await page.getByTestId('close_order_modal').click()
  isDialogOpen = await page.locator('#order_confirm_modal').evaluate(dialog => dialog.classList.contains('modal-open'));
  expect(isDialogOpen).toBeFalsy();
});

test('connect wallet', async({ page, context }) => {
  await page.getByRole('button', { name: 'Connect Wallet' }).first().click();
  const pagePromise = context.waitForEvent('page');
  const newPage = await pagePromise;
  await newPage.waitForLoadState();
  expect(newPage.url()).toContain('https://mixin.one/codes/');
})

test('create buy limit order', async ({ page }) => {
  const price = '10000'; 
  const amount = '10'; 
  const estimatedTotal = Number(price) * Number(amount);

  // Open dialog
  await page.getByTestId('order_type_selector').click();

  // Select limit order
  await page.getByTestId('limit_order_btn').click();

  // Click buy tab
  await page.getByTestId('type_buy').click();

  // Enter limit price
  await page.getByTestId('limit_price_input').click();
  await page.getByTestId('limit_price_input').fill(price);
  
  // Enter amount
  await page.getByTestId('amount_input').click();
  await page.keyboard.type(amount);

  // Click confirm order button
  await page.getByTestId('confirm_order').click();
  
  // Verify order details in confirmation modal
  const payAmount = await page.getByTestId('order_confirm_pay_amount').textContent();
  expect(payAmount).toContain(estimatedTotal.toString());
  
  // Check estimated receive value - don't check exact value due to fees
  const estimatedReceive = await page.getByTestId('estimated_receive_value').textContent();
  expect(estimatedReceive).toBeTruthy();
  expect(estimatedReceive).toContain('BTC');

  // Check if confirm button is disabled
  const isConfirmButtonDisabled = await page.getByTestId('confirm_order_button').isDisabled();

  if (!isConfirmButtonDisabled) {
    // Confirm order
    await page.waitForSelector('[data-testid="confirm_order_button"]', { state: 'visible' });
    await page.getByTestId('confirm_order_button').click();
  }

  // Close
  await page.getByTestId('close_order_modal').click();
});

test('create sell limit order', async ({ page }) => {
  const price = '10000'; 
  const amount = '10'; 
  const estimatedTotal = Number(price) * Number(amount);

  // Open dialog
  await page.getByTestId('order_type_selector').click();

  // Select limit order
  await page.getByTestId('limit_order_btn').click();
  
  // Click sell tab
  await page.getByTestId('type_sell').click();

  // Enter limit price
  await page.getByTestId('limit_price_input').click();
  await page.getByTestId('limit_price_input').fill(price);
  
  // Enter amount
  await page.getByTestId('amount_input').click();
  await page.keyboard.type(amount);

  // Click confirm order button
  await page.getByTestId('confirm_order').click();
  
  // Verify order details in confirmation modal
  const payAmount = await page.getByTestId('order_confirm_pay_amount').textContent();
  expect(payAmount).toContain(amount);
  
  // Check estimated receive value - don't check exact value due to fees
  const estimatedReceive = await page.getByTestId('estimated_receive_value').textContent();
  expect(estimatedReceive).toBeTruthy();
  expect(estimatedReceive).toContain('USDT');

  // Check if confirm button is disabled
  const isConfirmButtonDisabled = await page.getByTestId('confirm_order_button').isDisabled();

  if (!isConfirmButtonDisabled) {
    // Confirm order
    await page.waitForSelector('[data-testid="confirm_order_button"]', { state: 'visible' });
    await page.getByTestId('confirm_order_button').click();
  }

  // Close
  await page.getByTestId('close_order_modal').click();
});

test('verify order confirmation modal displays correct information', async ({ page }) => {
  // Open dialog
  await page.getByTestId('order_type_selector').click();
  
  // Select market order
  await page.getByTestId('market-order-btn').click();
  
  // Click buy tab
  await page.getByTestId('type_buy').click();
  
  // Enter amount
  const amount = '500';
  await page.getByTestId('total_input').click();
  await page.getByTestId('total_input').fill(amount);
  
  // Click confirm order button
  await page.getByTestId('confirm_order').click();
  
  // Verify modal is open
  const isDialogOpen = await page.locator('#order_confirm_modal').evaluate(dialog => dialog.classList.contains('modal-open'));
  expect(isDialogOpen).toBeTruthy();
  
  // Verify payment amount
  const payAmount = await page.getByTestId('order_confirm_pay_amount').textContent();
  expect(payAmount).toContain(amount);
  
  // Verify recipient
  const recipient = await page.getByTestId('order_confirm_recipient').textContent();
  expect(recipient?.toLowerCase()).toContain('mixin wallet');
  
  // Close modal
  await page.getByTestId('close_order_modal').click();
  
  // Verify modal is closed
  const isDialogClosed = await page.locator('#order_confirm_modal').evaluate(dialog => !dialog.classList.contains('modal-open'));
  expect(isDialogClosed).toBeTruthy();
});

test('test switching between market and limit affects input fields', async ({ page }) => {
  // Start with market order
  await page.getByTestId('order_type_selector').click();
  await page.getByTestId('market-order-btn').click();
  
  // Verify market input is visible
  const marketInputVisible = await page.getByTestId('total_input').isVisible();
  expect(marketInputVisible).toBeTruthy();
  
  // Switch to limit order
  await page.getByTestId('order_type_selector').click();
  await page.getByTestId('limit_order_btn').click();
  
  // Verify limit price input is visible
  const limitPriceVisible = await page.getByTestId('limit_price_input').isVisible();
  expect(limitPriceVisible).toBeTruthy();
  
  // Verify amount input is visible
  const amountInputVisible = await page.getByTestId('amount_input').isVisible();
  expect(amountInputVisible).toBeTruthy();
});

test('verify exchange rate display in confirmation modal', async ({ page }) => {
  // Open dialog
  await page.getByTestId('order_type_selector').click();
  
  // Select limit order
  await page.getByTestId('limit_order_btn').click();
  
  // Click buy tab
  await page.getByTestId('type_buy').click();
  
  // Enter price
  const price = '5000';
  await page.getByTestId('limit_price_input').click();
  await page.getByTestId('limit_price_input').fill(price);
  
  // Enter amount
  const amount = '2';
  await page.getByTestId('amount_input').click();
  await page.getByTestId('amount_input').fill(amount);
  
  // Open confirmation modal
  await page.getByTestId('confirm_order').click();

  // Check exchange price display
  const exchangePrice = await page.getByTestId('order_confirm_pay_amount').textContent();
  expect(exchangePrice).toContain('10000');

  // Close modal
  await page.getByTestId('close_order_modal').click();
});