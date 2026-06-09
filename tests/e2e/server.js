/**
 * Self-contained server used by Playwright's `webServer`.
 *
 * It boots an in-memory MongoDB, points the real Express app at it, seeds a
 * known admin account + a little catalogue data, and then listens on PORT 3100.
 * Playwright waits for the URL before running specs, so no external MongoDB or
 * separately-running app is required.
 *
 * External services are neutralised: Cloudinary/HTTPS env vars are removed so
 * the app never talks to a real account or reads TLS certs during E2E.
 */
const http = require("http");
const path = require("path");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const { MongoMemoryServer } = require("mongodb-memory-server");

// Load .env first (for anything harmless) then strip external-service config.
dotenv.config({ path: path.join(__dirname, "..", "..", ".env") });

const sampleData = require("../fixtures/sampleData");

const ADMIN = { name: "Site Admin", email: "admin@museum.com", password: "Admin123", role: "admin" };

async function main() {
  const mongod = await MongoMemoryServer.create();

  process.env.NODE_ENV = "test";
  process.env.MONGODB_URI = mongod.getUri("egyptian_museum_e2e");
  process.env.SESSION_SECRET = "e2e_session_secret";
  process.env.HOST = "127.0.0.1";
  process.env.PORT = process.env.E2E_PORT || "3100";
  delete process.env.MONGODB_URI_DIRECT;
  delete process.env.HTTPS;
  delete process.env.CLOUDINARY_CLOUD_NAME;
  delete process.env.CLOUDINARY_API_KEY;
  delete process.env.CLOUDINARY_API_SECRET;

  // Require the app only after env is configured (it connects on require).
  const app = require("../../app");
  await app.dbReady;

  // Seed a deterministic dataset for the E2E journeys.
  const User = require("../../models/User");
  const Product = require("../../models/Product");
  const Exhibit = require("../../models/Exhibit");
  const Testimonial = require("../../models/Testimonial");
  const Ticket = require("../../models/Ticket");
  const MapPin = require("../../models/MapPin");

  await Promise.all([
    User.deleteMany({}),
    Product.deleteMany({}),
    Exhibit.deleteMany({}),
    Testimonial.deleteMany({}),
    Ticket.deleteMany({}),
    MapPin.deleteMany({}),
  ]);

  await User.create({ ...ADMIN, password: await bcrypt.hash(ADMIN.password, 8) });
  await Product.insertMany(sampleData.products);
  await Exhibit.insertMany(sampleData.exhibits);
  await Testimonial.insertMany(sampleData.testimonials);
  await Ticket.insertMany(sampleData.tickets);
  await MapPin.insertMany(sampleData.mapPins);

  const port = Number(process.env.PORT);
  http.createServer(app).listen(port, "127.0.0.1", () => {
    // eslint-disable-next-line no-console
    console.log(`E2E server ready on http://127.0.0.1:${port}`);
  });

  const shutdown = async () => {
    await mongod.stop().catch(() => {});
    process.exit(0);
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error("Failed to start E2E server:", error);
  process.exit(1);
});
