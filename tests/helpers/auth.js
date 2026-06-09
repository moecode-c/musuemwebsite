/**
 * Authentication helpers for integration tests.
 *
 * `createUser` inserts a user directly (bcrypt-hashing the password at a low
 * cost factor for speed). `authAgent` creates such a user and then performs a
 * real login through POST /auth/login, returning a Supertest agent that carries
 * the resulting session cookie — exercising the genuine auth flow and session
 * store rather than faking a session.
 */
const request = require("supertest");
const bcrypt = require("bcrypt");
const User = require("../../models/User");

const DEFAULT_PASSWORD = "Passw0rd!";
let seq = 0;

async function createUser(overrides = {}) {
  const { password = DEFAULT_PASSWORD, ...rest } = overrides;
  // Cost factor 4 keeps hashing fast in tests while still using real bcrypt.
  const hash = await bcrypt.hash(password, 4);
  seq += 1;
  const user = await User.create({
    name: rest.name || "Test User",
    email: rest.email || `user-${Date.now()}-${seq}@example.com`,
    password: hash,
    role: rest.role || "user",
  });
  return user;
}

async function authAgent(app, overrides = {}) {
  const password = overrides.password || DEFAULT_PASSWORD;
  const user = await createUser({ ...overrides, password });
  const agent = request.agent(app);
  const res = await agent.post("/auth/login").send({ email: user.email, password });
  if (res.status !== 200) {
    throw new Error(`authAgent login failed (${res.status}): ${res.text}`);
  }
  return { agent, user, password };
}

// Convenience wrappers for the most common roles used across the suite.
const adminAgent = (app, overrides = {}) => authAgent(app, { ...overrides, role: "admin" });
const managerAgent = (app, overrides = {}) => authAgent(app, { ...overrides, role: "museum_manager" });
const janitorAgent = (app, overrides = {}) => authAgent(app, { ...overrides, role: "janitor" });
const userAgent = (app, overrides = {}) => authAgent(app, { ...overrides, role: "user" });

module.exports = {
  DEFAULT_PASSWORD,
  createUser,
  authAgent,
  adminAgent,
  managerAgent,
  janitorAgent,
  userAgent,
};
