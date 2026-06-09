/**
 * Reusable Playwright helpers and fixtures.
 *
 * - `login(page, creds)` drives the real login form (the form submits via fetch
 *   and then redirects client-side, so we wait for the URL to leave /auth/login).
 * - The exported `test` extends Playwright's base test with an `adminPage`
 *   fixture: a page already authenticated as the seeded admin. Because
 *   `page.request` shares cookies with the browser context, that fixture can be
 *   used for authenticated API calls too.
 */
const base = require("@playwright/test");

// Matches the admin seeded by tests/e2e/server.js.
const ADMIN = { email: "admin@museum.com", password: "Admin123" };

async function login(page, creds = ADMIN) {
  await page.goto("/auth/login");
  await page.fill("#login-email", creds.email);
  await page.fill("#login-password", creds.password);
  await Promise.all([
    page.waitForURL((url) => !url.pathname.includes("/auth/login"), { timeout: 15000 }),
    page.click(".auth-submit"),
  ]);
}

const test = base.test.extend({
  adminPage: async ({ page }, use) => {
    await login(page, ADMIN);
    await use(page);
  },
});

module.exports = { test, expect: base.expect, login, ADMIN };
