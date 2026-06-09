/**
 * Global Jest setup, applied to every test file via `setupFilesAfterEach`.
 *
 * It establishes deterministic environment variables so the application never
 * tries to talk to real external services during tests:
 *  - NODE_ENV=test           -> opt out of production-only guards
 *  - SESSION_SECRET          -> stable session signing key
 *  - Cloudinary vars removed -> `cloudinaryConfigured` stays false so uploads
 *                               are never sent to a real account (controllers
 *                               that require Cloudinary are tested with a mock)
 *  - HTTPS removed           -> never attempt to read TLS certs
 *
 * Note: the MongoDB connection string is injected per-suite by the test
 * helpers (tests/helpers/testApp.js) right before the app is required.
 */
process.env.NODE_ENV = process.env.NODE_ENV || "test";
process.env.SESSION_SECRET = process.env.SESSION_SECRET || "test_session_secret";

delete process.env.HTTPS;
delete process.env.CLOUDINARY_CLOUD_NAME;
delete process.env.CLOUDINARY_API_KEY;
delete process.env.CLOUDINARY_API_SECRET;
delete process.env.MONGODB_URI_DIRECT;

// mongodb-memory-server can take a while to download a binary on the very first
// run; the per-suite hooks pass their own timeouts, but raise the default too.
jest.setTimeout(30000);
