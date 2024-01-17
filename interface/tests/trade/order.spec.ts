import test, { expect } from "@playwright/test";

test.use({
  viewport: { width: 390, height: 844 },  // iPhone 14 Pro
});

test.beforeEach(async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/trade');
})

test('order filter', async({ page, context }) => {
  await page.locator("//div/div[1]/main/div/div[2]/div/div[1]/div/div/button[2]").click()
  expect(await page.isVisible('//*[@id="order_filter_modal"]/div/div[1]')).toBe(true)

  // await page.locator('#order_filter_modal').getByRole('button', { name: 'Limit order' }).click();
  // await page.locator('.mt-4 > div > div > div > div > button:nth-child(2)').first().click();

  // await page.locator('#order_filter_modal').getByRole('button', { name: 'Market order' }).click();
  // await page.locator('.mt-4 > div > div > div > div > button:nth-child(2)').click();

  //div/div[1]/main/div/div[2]/div/div[3]
  console.log(await page.locator("//div/div[1]/main/div/div[2]/div/div[3]"))
})