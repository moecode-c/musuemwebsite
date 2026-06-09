/**
 * END-TO-END TESTS — real browser (Playwright/Chromium) driving the real app.
 *
 * These are the highest-fidelity tests: a headless browser loads pages, runs the
 * site's client-side JavaScript, and interacts like a user. They run against a
 * fully seeded, self-contained server started automatically by Playwright's
 * `webServer` config (tests/e2e/server.js boots an in-memory MongoDB, seeds an
 * admin + catalogue, and listens on http://127.0.0.1:3100).
 *
 * `test`, `expect`, and `login` come from ./helpers. `test` is Playwright's
 * runner extended with an `adminPage` fixture (a page already logged in as the
 * seeded admin). Playwright auto-waits on its assertions, so we rarely add
 * manual waits.
 */
const { test, expect, login } = require("./helpers");

test.describe("public browsing", () => {
  // Verifies the most important public pages actually load in a browser and that
  // navigation between them works. We check the document <title> on home and the
  // resulting URL + a visible <body> on each destination (a lightweight "the
  // page rendered without crashing" assertion).
  test("home page loads and navigation reaches key pages", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Egyptian Museum/i); // title = "Home | Egyptian Museum"

    // Exhibits page renders from the seeded data.
    await page.goto("/exhibits");
    await expect(page).toHaveURL(/\/exhibits/);
    await expect(page.locator("body")).toBeVisible();

    // Shop page renders too.
    await page.goto("/shop");
    await expect(page).toHaveURL(/\/shop/);
    await expect(page.locator("body")).toBeVisible();
  });
});

test.describe("authentication", () => {
  // Full login -> logout journey through the real UI and session.
  test("a user can log in and then log out", async ({ page }) => {
    // login() fills #login-email/#login-password and submits the form. The form
    // posts via fetch then redirects client-side, so the helper waits for the URL
    // to leave /auth/login. As admin, that redirect lands on /admin/dashboard.
    await login(page);
    await expect(page).toHaveURL(/\/admin\/dashboard/);

    // On a public page the navbar now shows the logged-in account control, which
    // contains a logout <form>. That control lives inside a hover-only dropdown,
    // so instead of clicking a hidden button we submit the form programmatically.
    await page.goto("/");
    await expect(page.locator('form[action="/auth/logout"]').first()).toBeAttached();
    await page.evaluate(() => document.querySelector('form[action="/auth/logout"]').submit());

    // Logging out destroys the session and redirects home, where the guest
    // "Login" link reappears. toBeAttached auto-waits for that navigation +
    // re-render, so no explicit waitForNavigation is needed.
    await expect(page.locator('a[href="/login"]').first()).toBeAttached({ timeout: 10000 });
  });
});

test.describe("admin workflow", () => {
  // Exercises the create -> edit -> delete lifecycle as an authenticated admin.
  // The `adminPage` fixture is already logged in; because `page.request` shares
  // the browser context's cookies, these API calls are authenticated with the
  // same admin session — a reliable way to test CRUD without depending on the
  // admin page's bespoke client-side JavaScript.
  test("admin can create, edit and delete a product, and open admin pages", async ({ adminPage }) => {
    // CREATE -> 201, and the response echoes the created product.
    const created = await adminPage.request.post("/api/products", {
      data: { name: "E2E Widget", price: 99, imageUrl: "/assets/hero.svg" },
    });
    expect(created.status()).toBe(201);
    const product = await created.json();
    expect(product).toMatchObject({ name: "E2E Widget" });

    // EDIT -> 200 (update the name/price of the product we just created).
    const updated = await adminPage.request.put(`/api/products/${product._id}`, {
      data: { name: "E2E Widget v2", price: 120, imageUrl: "/assets/hero.svg" },
    });
    expect(updated.status()).toBe(200);

    // DELETE -> 200.
    const deleted = await adminPage.request.delete(`/api/products/${product._id}`);
    expect(deleted.status()).toBe(200);

    // Finally confirm an admin management page loads in the browser for a
    // logged-in admin (guards passed, EJS rendered).
    await adminPage.goto("/admin/products");
    await expect(adminPage).toHaveURL(/\/admin\/products/);
    await expect(adminPage.locator("body")).toBeVisible();
  });
});
