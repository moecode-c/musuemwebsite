/**
 * SMOKE TESTS — fast "is the application alive and wired together?" checks.
 *
 * Smoke tests don't dig into business rules; they verify the app boots, the
 * database connects, and the most important endpoints respond at all. If these
 * fail, something fundamental is broken and the other suites aren't worth running.
 *
 * Note on the mock below: pageController.home calls the live weather API. We
 * jest.mock the apiClient module BEFORE the app is required (jest hoists
 * jest.mock to the top of the file), so the homepage renders from a fixed,
 * offline value instead of making a real network request — keeping the smoke
 * run deterministic and fast.
 */
jest.mock("../../utils/apiClient", () => ({
  getWeather: jest.fn().mockResolvedValue({ temperature_2m: 25, wind_speed_10m: 10 }),
}));

const request = require("supertest");
const mongoose = require("mongoose");
const { initTestApp, getApp, closeTestApp } = require("../helpers/testApp");

// Boot the real app + in-memory DB once for the whole file (60s allows for a
// first-time MongoDB binary download).
beforeAll(async () => {
  await initTestApp();
}, 60000);

afterAll(async () => {
  await closeTestApp();
});

describe("smoke", () => {
  // The app object exists and Mongoose reports an active connection.
  // readyState 1 === "connected".
  it("boots the app with a live database connection", () => {
    expect(getApp()).toBeDefined();
    expect(mongoose.connection.readyState).toBe(1);
  });

  // The homepage renders HTML (200 + a <title> tag), and an unknown URL is
  // handled by the 404 middleware rather than crashing.
  it("serves the homepage and a missing page returns 404", async () => {
    const home = await request(getApp()).get("/");
    expect(home.status).toBe(200);
    expect(home.text).toContain("<title>");

    const missing = await request(getApp()).get("/this-page-does-not-exist");
    expect(missing.status).toBe(404);
  });

  // Every public read API responds 200 with a JSON array, and both auth pages
  // load. Looping keeps the test compact while covering all critical endpoints.
  it("responds on critical API + auth endpoints", async () => {
    const app = getApp();

    for (const path of ["/api/exhibits", "/api/products", "/api/testimonials", "/api/map-pins", "/api/tickets"]) {
      const res = await request(app).get(path);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    }

    // Authentication entry points are reachable (the login/register forms render).
    expect((await request(app).get("/auth/login")).status).toBe(200);
    expect((await request(app).get("/auth/register")).status).toBe(200);
  });
});
