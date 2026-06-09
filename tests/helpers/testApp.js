/**
 * Integration / smoke test harness.
 *
 * Boots an in-memory MongoDB (mongodb-memory-server), points the real
 * application at it via `process.env.MONGODB_URI`, then `require`s the actual
 * Express app. Because app.js only calls `listen()` when run directly, requiring
 * it here yields the configured app without binding a port, and exposes
 * `app.dbReady` (the DB connection promise) which we await before returning.
 *
 * Usage in a suite:
 *
 *   const { initTestApp, closeTestApp, clearCollections, getApp } = require("../helpers/testApp");
 *   beforeAll(async () => { await initTestApp(); });
 *   afterEach(async () => { await clearCollections(); });
 *   afterAll(async () => { await closeTestApp(); });
 *   // inside a test: request(getApp())...
 *
 * Each Jest test file runs in its own module registry, so each integration file
 * gets an isolated app + database instance (no cross-file state leakage).
 */
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;
let app;

async function initTestApp() {
  if (app) return app;

  mongoServer = await MongoMemoryServer.create();
  // Point the app's DB config at the in-memory server BEFORE requiring app.js.
  process.env.MONGODB_URI = mongoServer.getUri("egyptian_museum_test");
  delete process.env.MONGODB_URI_DIRECT;
  process.env.SESSION_SECRET = process.env.SESSION_SECRET || "test_session_secret";

  // eslint-disable-next-line global-require -- must load AFTER env is configured
  app = require("../../app");
  await app.dbReady; // wait for mongoose connection (and session store) to be ready
  return app;
}

function getApp() {
  if (!app) {
    throw new Error("Test app not initialised. Call initTestApp() in beforeAll first.");
  }
  return app;
}

// Wipe every collection between tests so each test starts from a clean slate.
async function clearCollections() {
  if (mongoose.connection.readyState !== 1) return;
  const { collections } = mongoose.connection;
  await Promise.all(Object.values(collections).map((collection) => collection.deleteMany({})));
}

async function closeTestApp() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.dropDatabase().catch(() => {});
    await mongoose.disconnect().catch(() => {});
  }
  if (mongoServer) {
    await mongoServer.stop();
    mongoServer = undefined;
  }
  app = undefined;
}

module.exports = { initTestApp, getApp, clearCollections, closeTestApp };
