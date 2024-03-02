import test, { expect } from "@playwright/test";

test.use({
  viewport: { width: 390, height: 844 },  // iPhone 14 Pro
});

test.beforeEach(async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/swap');
})

test('select from asset', async({ page }) => {
  let oldFromSymbol = await page.getByTestId('from-asset-symbol').textContent();
  // Open dialog
  await page.getByTestId('select-from-asset').click();
  expect(await page.isVisible('//*[@id="swap_input_asset_modal"]/div/div[1]/div[1]/span')).toBe(true)

  for (let i = 0; i<30; i++) {
    await page.locator('#swap_input_asset_modal').getByTestId(`swap-asset-${i}`).click();
    const newFromSymbol = await page.locator('#swap_input_asset_modal').getByTestId(`swap-asset-${i}`).textContent();
    // expect(await page.isVisible('//*[@id="swap_input_asset_modal"]/div/div[1]/div[1]/span')).toBe(false)
    expect(newFromSymbol).not.toBe(oldFromSymbol)
    oldFromSymbol = await page.getByTestId('from-asset-symbol').textContent();
    expect(newFromSymbol).toContain(oldFromSymbol)
    await page.getByTestId('select-from-asset').click();
  }
})

test('select to asset', async({ page }) => {
  let oldToSymbol = await page.getByTestId('to-asset-symbol').textContent();
  // Open dialog
  await page.getByTestId('select-to-asset').click();
  expect(await page.isVisible('//*[@id="swap_output_asset_modal"]/div/div[1]/div[1]/span')).toBe(true)

  for (let i = 0; i<30; i++) {
    await page.locator('#swap_output_asset_modal').getByTestId(`swap-asset-${i}`).click();
    const newToSymbol = await page.locator('#swap_output_asset_modal').getByTestId(`swap-asset-${i}`).textContent();
    // expect(await page.isVisible('//*[@id="swap_output_asset_modal"]/div/div[1]/div[1]/span')).toBe(false)
    expect(newToSymbol).not.toBe(oldToSymbol)
    oldToSymbol = await page.getByTestId('to-asset-symbol').textContent();
    expect(newToSymbol).toContain(oldToSymbol)
    await page.getByTestId('select-to-asset').click();
  }
})

test('select from account', async({ page }) => {
  // Open dialog
  await page.getByTestId('from-account').click()
  for (let i = 0; i<2; i++) {
    await page.locator('#swap_input_balance_modal').getByTestId(`input-account-${i}`).click();
    const acc = await page.locator('#swap_input_balance_modal').getByTestId(`input-account-${i}`).textContent();
    const newAcc = await page.getByTestId('from-account').textContent()
    expect(newAcc).toContain(acc?.split(' ')[0])
    await page.getByTestId('from-account').click()
  }
})

test('select to account', async({ page }) => {
  // Open dialog
  await page.getByTestId('to-account').click()
  for (let i = 0; i<2; i++) {
    await page.locator('#swap_output_balance_modal').getByTestId(`output-account-${i}`).click();
    const acc = await page.locator('#swap_output_balance_modal').getByTestId(`output-account-${i}`).textContent();
    const newAcc = await page.getByTestId('to-account').textContent()
    expect(newAcc).toContain(acc?.split(' ')[0])
    await page.getByTestId('to-account').click()
  }
})

test('confirm swap', async({ page }) => {
  await page.getByTestId('input-amount').fill('1.1233')
  await page.getByTestId('output-amount').fill('324.214')
  await page.getByTestId('swap-confirm-btn').click()
  expect(await page.isVisible('//*[@id="swap_confirm_modal"]/div/div[1]/div[1]/span')).toBe(true)
  await page.getByTestId('swap_confirm_order').click()
  await page.getByTestId('swap_confirm_close').click()
})