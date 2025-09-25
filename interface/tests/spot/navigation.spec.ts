import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/spot');
})

test('open/close pair selector', async ({ page }) => {
  let isDialogOpen = await page.locator('#select_pair_modal').evaluate(dialog => dialog.classList.contains('modal-open'));
  expect(isDialogOpen).toBeFalsy();
  // Open
  await page.getByTestId('spot_pair_selector').click();
  isDialogOpen = await page.locator('#select_pair_modal').evaluate(dialog => dialog.classList.contains('modal-open'));
  expect(isDialogOpen).toBeTruthy();

  // Close 
  await page.getByTestId('spot_pair_selector_close').click();
  isDialogOpen = await page.locator('#select_pair_modal').evaluate(dialog => dialog.classList.contains('modal-open'));
  expect(isDialogOpen).toBeFalsy();
});

test('goto candlestick', async ({ page }) => {
  await page.locator('.sticky > div > div > button').first().click();
  await page.waitForURL('**/market/candle/**');
});