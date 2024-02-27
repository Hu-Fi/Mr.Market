import test, { expect } from "@playwright/test";

test.use({
  viewport: { width: 390, height: 844 },  // iPhone 14 Pro
});

test.beforeEach(async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/spot');
})

test('order filter dialog', async({ page, context }) => {
  await page.getByTestId('manage_orders_filter').click();

  expect(await page.isVisible('//*[@id="order_filter_modal"]/div/div[1]')).toBe(true)
  await page.locator('#order_filter_modal').getByRole('button', { name: 'Limit order' }).click();

  await page.getByTestId('manage_orders_filter').click();
  await page.locator('#order_filter_modal').getByRole('button', { name: 'Market order' }).click();

  await page.getByTestId('manage_orders_filter').click();
  await page.locator('#order_filter_modal').getByRole('button', { name: 'Limit order' }).click();
})

test('switch between tabs', async({ page, context }) => {
  await page.getByTestId('manage_orders').click();
  await page.getByTestId('manage_positions').click();
  await page.getByTestId('manage_orders').click();
})

test('enter order history', async({ page, context }) => {
  await page.getByTestId('go_history').click();
  await page.waitForURL('**/spot/history**');
  await page.getByRole('button').first().click();
})

test('filter current pair', async({ page, context }) => {
  await page.getByRole('checkbox').check();
  await expect(page.getByRole('checkbox')).toBeChecked();

  // Check only include selected pair
})

