/**
 * UNIT TESTS — the most critical, cross-cutting logic, tested in complete
 * isolation (no database, no HTTP server, no network).
 *
 * Why these three? They are the gates every request passes through:
 *   1. Authorization (middleware/roles)  — who is allowed to do what
 *   2. Authentication (middleware/auth)   — is the caller logged in
 *   3. Error handling  (middleware/error) — how failures are surfaced
 *
 * How the isolation works:
 *   - We import the middleware functions directly and call them as plain
 *     functions with fake `req`, `res`, and `next` objects.
 *   - `mockReq`/`mockRes` (from helpers/mongooseMock) are lightweight stand-ins:
 *     every response method (status/json/render/redirect/...) is a jest.fn()
 *     that records how it was called, so we can assert on it. `mockRes.status`
 *     also returns `res` so the real `res.status(403).render(...)` chaining works.
 *   - `next` is a jest.fn(); calling it means "allowed through", not calling it
 *     means the middleware short-circuited (blocked/redirected).
 */
const roles = require("../../middleware/roles");
const auth = require("../../middleware/auth");
const { notFoundHandler, errorHandler } = require("../../middleware/error");
const { mockReq, mockRes } = require("../helpers/mongooseMock");

describe("authorization (middleware/roles)", () => {
  // Tests the pure permission table directly (no req/res needed). This locks in
  // the core rules: admin is all-powerful, regular users have nothing, employees
  // have scoped permissions, and the legacy "super_admin" string still works.
  it("grants admins everything (wildcard) and restricts regular users + legacy super_admin maps to admin", () => {
    expect(roles.hasPermission("admin", "task:create")).toBe(true); // admin has "*"
    expect(roles.hasPermission("user", "task:create")).toBe(false); // visitor: denied
    expect(roles.hasPermission("museum_manager", "task:create")).toBe(true); // scoped grant
    // "super_admin" is a legacy alias that must normalise to "admin".
    expect(roles.hasPermission("super_admin", "task:create")).toBe(true);
    expect(roles.isAdminRole("admin")).toBe(true);
    expect(roles.isEmployeeRole("janitor")).toBe(true);
  });

  // Tests the guard middlewares as Express would invoke them. We drive each one
  // with a fake session role and assert it either blocks (res.status(403)) or
  // lets the request continue (next() called).
  it("requireAdmin / requirePermission block unauthorized roles and allow authorized ones", () => {
    const next = jest.fn();

    // A non-admin hitting an admin-only guard -> 403 and next() is NOT called.
    const denyRes = mockRes();
    roles.requireAdmin(mockReq({ session: { user: { role: "user" } } }), denyRes, next);
    expect(denyRes.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();

    // An admin passes the same guard -> next() IS called (request continues).
    const allowRes = mockRes();
    roles.requireAdmin(mockReq({ session: { user: { role: "admin" } } }), allowRes, next);
    expect(next).toHaveBeenCalledTimes(1);

    // requirePermission(perm) is a factory returning a guard; a manager has
    // "zone:manage", so the guard calls next() (2nd next() overall).
    roles.requirePermission("zone:manage")(
      mockReq({ session: { user: { role: "museum_manager" } } }),
      mockRes(),
      next
    );
    expect(next).toHaveBeenCalledTimes(2);
  });
});

describe("authentication (middleware/auth)", () => {
  // requireAuth protects page routes: guests are redirected to /login, logged-in
  // users fall through to the handler.
  it("requireAuth redirects guests to /login and calls next() when logged in", () => {
    const next = jest.fn();

    // No session.user -> redirect("/login"), handler never runs.
    const guestRes = mockRes();
    auth.requireAuth(mockReq({ session: {} }), guestRes, next);
    expect(guestRes.redirect).toHaveBeenCalledWith("/login");
    expect(next).not.toHaveBeenCalled();

    // A session with a user -> next() is called.
    auth.requireAuth(mockReq({ session: { user: { id: "1" } } }), mockRes(), next);
    expect(next).toHaveBeenCalledTimes(1);
  });

  // requireAuthApi protects AJAX/JSON routes: instead of an HTML redirect it
  // returns 401 JSON containing a redirect hint the browser code can act on.
  it("requireAuthApi answers 401 JSON for guests (so AJAX clients can redirect)", () => {
    const res = mockRes();
    auth.requireAuthApi(mockReq({ session: {} }), res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ redirect: "/login" })
    );
  });
});

describe("error handling (middleware/error)", () => {
  // The error handler must format failures differently for API vs page routes.
  // console.error is silenced because the handler logs every error (we don't
  // want that noise in the test output, and we restore it afterwards).
  it("returns JSON for API routes and renders the 500 page for everything else", () => {
    jest.spyOn(console, "error").mockImplementation(() => {});

    // /api/* error -> JSON body with the error message and its status code.
    const apiRes = mockRes();
    errorHandler(
      Object.assign(new Error("bad"), { status: 400 }),
      mockReq({ originalUrl: "/api/products" }),
      apiRes,
      jest.fn()
    );
    expect(apiRes.status).toHaveBeenCalledWith(400);
    expect(apiRes.json).toHaveBeenCalledWith({ message: "bad" });

    // Non-API error with no explicit status -> defaults to 500 + renders 500.ejs.
    const pageRes = mockRes();
    errorHandler(new Error("kaboom"), mockReq({ originalUrl: "/shop" }), pageRes, jest.fn());
    expect(pageRes.status).toHaveBeenCalledWith(500);
    expect(pageRes.render).toHaveBeenCalledWith("500", expect.any(Object));

    // The 404 handler (no error object) renders the 404 page with status 404.
    const nfRes = mockRes();
    notFoundHandler(mockReq({ originalUrl: "/missing" }), nfRes);
    expect(nfRes.status).toHaveBeenCalledWith(404);
    expect(nfRes.render).toHaveBeenCalledWith("404", expect.any(Object));

    console.error.mockRestore();
  });
});
