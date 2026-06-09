// @ts-check
const { defineConfig, devices } = require("@playwright/test");

/**
 * Playwright configuration for end-to-end tests.
 *
 * The `webServer` block launches a fully self-contained test server
 * (tests/e2e/server.js) which:
 *   1. boots an in-memory MongoDB instance,
 *   2. points the real Express app at it,
 *   3. seeds a known admin user + sample catalogue data,
 *   4. listens on PORT 3100.
 *
 * Playwright waits for that URL to respond before running the specs, so no
 * external MongoDB or pre-running server is required. Browsers are installed
 * with `npx playwright install` (see README in /tests).
 */
const PORT = process.env.E2E_PORT || 3100;
const baseURL = `http://127.0.0.1:${PORT}`;

module.exports = defineConfig({
  testDir: "./tests/e2e",
  testMatch: "**/*.spec.js",
  // Generous timeouts: the very first run may download a MongoDB binary.
  timeout: 30000,
  expect: { timeout: 10000 },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-report" }]],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "node tests/e2e/server.js",
    url: baseURL,
    timeout: 120000,
    reuseExistingServer: !process.env.CI,
    stdout: "pipe",
    stderr: "pipe",
  },
});
