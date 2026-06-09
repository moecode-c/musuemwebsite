/**
 * Jest configuration for the Egyptian Museum automated test suite.
 *
 * Scope:
 *  - Unit tests        -> tests/unit         (pure logic, mocked dependencies)
 *  - Integration tests -> tests/integration  (real Express app + in-memory MongoDB)
 *  - Smoke tests       -> tests/smoke        (boot / connectivity / critical endpoints)
 *
 * Playwright end-to-end specs live under tests/e2e and are executed by the
 * Playwright runner (`npm run test:e2e`), NOT by Jest. They are therefore
 * excluded here via testPathIgnorePatterns.
 *
 * Integration and smoke suites spin up `mongodb-memory-server`, so the global
 * timeout is raised and the suites run in-band (see the npm "test" script) to
 * keep database resources predictable across files.
 */
module.exports = {
  testEnvironment: "node",
  roots: ["<rootDir>/tests"],
  testMatch: ["**/tests/**/*.test.js"],
  testPathIgnorePatterns: ["/node_modules/", "<rootDir>/tests/e2e/"],
  setupFilesAfterEnv: ["<rootDir>/tests/setup/jest.setup.js"],
  testTimeout: 30000,
  clearMocks: true,
  collectCoverageFrom: [
    "controllers/**/*.js",
    "middleware/**/*.js",
    "utils/**/*.js",
    "models/**/*.js",
    "config/**/*.js",
    "routes/**/*.js",
  ],
  coverageDirectory: "<rootDir>/coverage",
  coveragePathIgnorePatterns: ["/node_modules/", "/tests/"],
};
