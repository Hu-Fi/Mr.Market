import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  /* Shared settings for all tests */
  use: {
    baseURL: 'http://127.0.0.1:5173',
    trace: 'on-first-retry',
    viewport: { width: 390, height: 844 }, // iPhone 14 Pro–like viewport
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Pixel 5'] }, // ✅ valid device
    },
    {
      name: 'webkit',
      use: { ...devices['iPhone 14 Pro'] }, // ✅ valid device
    },
  ],

  /* Run local dev server before tests */
  webServer: {
    command: 'yarn dev',
    url: 'http://127.0.0.1:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 240 * 1000, // 4 minutes wait for server startup
  },
});
