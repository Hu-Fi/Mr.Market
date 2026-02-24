import { test, expect } from '@playwright/test';

test.describe('Spot trading', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://127.0.0.1:5173/spot');
  });

  test('switch buy and sell', async ({ page }) => {
    // buy
    await page.getByTestId('type_buy').click();
    let actionButtonText = await page.getByTestId('buy_button_text').textContent();
    expect(actionButtonText?.toLocaleLowerCase()).toContain('buy');

    // sell
    await page.getByTestId('type_sell').click();
    actionButtonText = await page.getByTestId('sell_button_text').textContent();
    expect(actionButtonText?.toLocaleLowerCase()).toContain('sell');
  });

  test('select limit/market order', async ({ page }) => {
    // Open dialog
    await page.getByTestId('order_type_selector').click();
    // Select limit order
    await page.getByTestId('limit_order_btn').click();
    let actionButtonText = await page.getByTestId('limit_order_btn-text').textContent();
    expect(actionButtonText?.toLocaleLowerCase()).toContain('limit');

    // Open dialog
    await page.getByTestId('order_type_selector').click();

    // Select market order
    await page.getByTestId('market-order-btn').click();
    actionButtonText = await page.getByTestId('market-order-btn-text').textContent();
    expect(actionButtonText?.toLocaleLowerCase()).toContain('market');
  });

  test('create buy/sell market order', async ({ page }) => {
    let isDialogOpen = await page
      .locator('#order_confirm_modal')
      .evaluate((dialog) => dialog.classList.contains('modal-open'));
    expect(isDialogOpen).toBeFalsy();

    const amount = '1234.2346';
    // Click buy tab
    await page.getByTestId('type_buy').click();
    // Enter amount
    await page.getByTestId('total_input').click();
    await page.keyboard.type(amount);

    // Click buy action
    await page.getByTestId('confirm_order').click();
    let payAmount = await page.getByTestId('order_confirm_pay_amount').textContent();
    let actualAmount = await page.getByTestId('total_input').textContent();
    expect(payAmount).toContain(actualAmount);

    // Confirm order
    await page.getByTestId('confirm_order_button').click();

    // Close
    await page.getByTestId('close_order_modal').click();
    await page.getByTestId('total_input').fill('');

    // Click sell tab
    await page.getByTestId('type_sell').click();
    // Enter amount
    await page.getByTestId('total_input').click();
    await page.keyboard.type(amount);

    // Click sell action
    await page.getByTestId('confirm_order').click();
    payAmount = await page.getByTestId('order_confirm_pay_amount').textContent();
    actualAmount = await page.getByTestId('total_input').textContent();
    expect(payAmount).toContain(actualAmount);

    // Check if confirm button is disabled
    const isConfirmButtonDisabled = await page.getByTestId('confirm_order_button').isDisabled();

    if (!isConfirmButtonDisabled) {
      await page.waitForSelector('[data-testid="confirm_order_button"]', { state: 'visible' });
      await page.getByTestId('confirm_order_button').click();
    }

    // Close
    await page.getByTestId('close_order_modal').click();
    isDialogOpen = await page
      .locator('#order_confirm_modal')
      .evaluate((dialog) => dialog.classList.contains('modal-open'));
    expect(isDialogOpen).toBeFalsy();
  });

  test('connect wallet', async ({ page, context }) => {
    const popupPromise = context.waitForEvent('page');
    await page.getByRole('button', { name: 'Connect Wallet' }).first().click();
    const newPage = await popupPromise;
    await newPage.waitForLoadState();
    await expect(newPage).toHaveURL(/https:\/\/mixin\.one\/codes\//);
  });

});

// test('create buy limit order', async ({ page }) => {
//   const price = '10000'; const recvAmount = '10'; const estimatedPay = Number(price)*Number(recvAmount)

//   // Open dialog
//     await page.getByTestId('order_type_selector').click()

//   // Select limit order
//   await page.getByTestId('limit_order_btn').click()

//   // Click on limit price
//   await page.getByTestId('limit_price_input').click()
//   await page.getByTestId('limit_price_input').fill(price)
  
//   // Click on pay amount
//   await page.getByTestId('amount_input').click()
//   await page.keyboard.type(recvAmount);

//   // Check estimated amount
//   const expectedReceive = page.getByTestId('estimated_receive_value').textContent()
//   expect(expectedReceive).toContain(`${estimatedPay}`)

//   // Click buy action
//   // await page.getByTestId('type_buy').click()

//   // Check Recv amount
//   const recvAmountX = await page.getByTestId('order_confirm_recv_amount').textContent()
//   expect(recvAmountX).toContain(recvAmount)

//   // Check Pay amount
//   const estimatedPayX = await page.getByTestId('order_confirm_pay_amount').textContent()
//   expect(estimatedPayX).toContain(estimatedPay.toString())

//   // Check if confirm button is disabled
//   const isConfirmButtonDisabled = await page.getByTestId('confirm_order_button').isDisabled();

//   if (!isConfirmButtonDisabled) {
//     // Confirm order
//     await page.waitForSelector('[data-testid="confirm_order_button"]', { state: 'visible' });
//     await page.getByTestId('confirm_order_button').click();
//   }

//   // Close
//   await page.getByTestId('close_order_modal').click();
// });

// test.skip('create sell limit order', async ({ page }) => {
//   const price = '10000'; const payAmount = '10'; const estimatedRecv = Number(price)*Number(payAmount)

//   // Open dialog
//     await page.getByTestId('order_type_selector').click()

//   // Select limit order
//   await page.getByTestId('limit_order_btn').click()
  
//   // Click sell tab
//   await page.getByTestId('sell_tab').click()

//   // Click on limit price
//   await page.getByTestId('limit_price_input').click()
//   await page.getByTestId('limit_price_input').fill(price)
  
//   // Click on pay amount
//   await page.getByTestId('amount_input').click()
//   await page.keyboard.type(payAmount);
  
//   // Check estimated amount
//   const expectedReceive = page.getByTestId('estimated_receive_input')
//   expect(expectedReceive).toHaveValue(`${estimatedRecv}`, {timeout: 2000})  

//   // Click sell action
//   await page.getByTestId('type_sell').click()

//   // Check Recv amount
//   const estimatedRecvX = await page.getByTestId('order_confirm_recv_amount').textContent()
//   expect(estimatedRecvX).toContain(estimatedRecv.toString())

//   // Check Pay amount
//   const payAmountX = await page.getByTestId('order_confirm_pay_amount').textContent()
//   expect(payAmountX).toContain(payAmount)

//   // Check if confirm button is disabled
//   const isConfirmButtonDisabled = await page.getByTestId('confirm_order_button').isDisabled();

//   if (!isConfirmButtonDisabled) {
//     // Confirm order
//     await page.waitForSelector('[data-testid="confirm_order_button"]', { state: 'visible' });
//     await page.getByTestId('confirm_order_button').click();
//   }

//   // Close
//   await page.getByTestId('close_order_modal').click();
// });