/**
 * INTEGRATION TESTS — the REAL Express app, wired to a REAL (in-memory) MongoDB.
 *
 * Unlike the unit tests (which fake everything), these exercise the full stack:
 * router -> middleware (auth, validation) -> controller -> Mongoose model -> DB.
 *
 * How the harness works (see tests/helpers/testApp.js):
 *   - initTestApp() boots an in-memory MongoDB, points the app's config at it,
 *     then `require`s the actual app.js and awaits its DB connection. Because
 *     app.js only calls listen() when run directly, requiring it gives us the
 *     configured app without opening a port — perfect for Supertest.
 *   - Supertest's `request(app)` sends real HTTP requests into that app object.
 *   - clearCollections() wipes every collection after each test for isolation.
 *   - closeTestApp() disconnects Mongoose and stops the in-memory server.
 *
 * Authentication is exercised for real: `adminAgent` creates a user and logs in
 * through POST /auth/login, returning a Supertest *agent* that carries the
 * session cookie on subsequent requests (so admin-only routes are reachable).
 */
const request = require("supertest");
const { initTestApp, getApp, clearCollections, closeTestApp } = require("../helpers/testApp");
const { adminAgent } = require("../helpers/auth");
const { buildUser, buildProduct } = require("../helpers/factories");

// 60s timeout: the very first run may download the MongoDB binary.
beforeAll(async () => {
  await initTestApp();
}, 60000);

// Reset the database between tests so each one starts from a known-empty state.
afterEach(async () => {
  await clearCollections();
});

// Tear down the DB + in-memory server when the file finishes.
afterAll(async () => {
  await closeTestApp();
});

describe("authentication flow", () => {
  // End-to-end auth against the DB: a real user is persisted (password bcrypt
  // hashed by the controller), then we prove the credential check actually works
  // by trying both the correct and an incorrect password.
  it("registers a new user, then rejects a wrong password on login", async () => {
    const app = getApp();
    const creds = buildUser({ email: "auth-flow@example.com", password: "Secret123" });

    // Registration succeeds and returns a redirect target for the client.
    const registered = await request(app).post("/auth/register").send(creds);
    expect(registered.status).toBe(200);
    expect(registered.body).toHaveProperty("redirect");

    // Registering the same email again is rejected with 409 Conflict (the
    // controller checks for an existing user before creating).
    const dup = await request(app).post("/auth/register").send(creds);
    expect(dup.status).toBe(409);

    // Correct password -> 200; wrong password -> 401 (bcrypt.compare fails).
    const ok = await request(app).post("/auth/login").send({ email: creds.email, password: "Secret123" });
    expect(ok.status).toBe(200);

    const bad = await request(app).post("/auth/login").send({ email: creds.email, password: "wrong" });
    expect(bad.status).toBe(401);
  });
});

describe("product CRUD + authorization", () => {
  // A representative full CRUD cycle that also proves authorization: the public
  // can read, but only an authenticated admin can write. Each step's response is
  // verified, and we confirm the DB state changed by re-reading the list.
  it("lets an admin create, read and delete a product while blocking guests", async () => {
    const app = getApp();

    // GET is public and the DB starts empty -> 200 with an empty array.
    const emptyList = await request(app).get("/api/products");
    expect(emptyList.status).toBe(200);
    expect(emptyList.body).toEqual([]);

    // A guest (no session) hitting the admin-guarded POST -> 403 Forbidden.
    const guestCreate = await request(app).post("/api/products").send(buildProduct());
    expect(guestCreate.status).toBe(403);

    // Log in as admin, then create. We pass imageUrl in the body so no file
    // upload (and therefore no Cloudinary call) is needed for this path.
    const { agent } = await adminAgent(app);
    const created = await agent.post("/api/products").send(buildProduct({ name: "Scarab" }));
    expect(created.status).toBe(201);
    expect(created.body).toMatchObject({ name: "Scarab", price: 350 });

    // The new product is now visible publicly...
    const list = await request(app).get("/api/products");
    expect(list.body).toHaveLength(1);

    // ...and the admin can delete it, after which the list is empty again.
    const deleted = await agent.delete(`/api/products/${created.body._id}`);
    expect(deleted.status).toBe(200);
    expect((await request(app).get("/api/products")).body).toHaveLength(0);
  });
});

describe("validation + access control", () => {
  // Confirms the two "negative path" protections work end-to-end: express-
  // validator rejects bad input with 422, and the auth guards reject
  // unauthorized callers with 403 (page/admin) or 401 (AJAX) as appropriate.
  it("returns 422 for invalid input and protects authenticated/admin routes", async () => {
    const app = getApp();

    // Invalid email -> express-validator short-circuits with 422 (handler never runs).
    const badSub = await request(app).post("/newsletter/subscribe").send({ name: "X", phone: "123", email: "nope" });
    expect(badSub.status).toBe(422);

    // Valid payload passes validation and is accepted.
    const goodSub = await request(app)
      .post("/newsletter/subscribe")
      .send({ name: "Valid Name", phone: "123456", email: "good@example.com" });
    expect(goodSub.status).toBe(200);

    // Admin-only listing is forbidden for a guest (requireAdmin -> 403).
    expect((await request(app).get("/api/users")).status).toBe(403);

    // An AJAX-protected route (requireAuthApi) returns 401 JSON for a guest
    // rather than redirecting, so client-side code can handle it.
    const protectedPost = await request(app).post("/api/ticket-requests").send({});
    expect(protectedPost.status).toBe(401);
  });
});
