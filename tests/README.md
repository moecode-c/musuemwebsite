# Automated Test Suite

Lean, fast test suite for the Egyptian Museum app. It focuses on the most
critical paths (auth, authorization, CRUD, boot/health, and the core user
journeys) rather than exhaustive coverage.

## Layout

```
tests/
  unit/         Pure logic, no DB/HTTP (critical middleware: authz, auth, errors)
  integration/  Real Express app + in-memory MongoDB via Supertest
  smoke/        Boot / DB connection / homepage / critical endpoints
  e2e/          Playwright journeys against a seeded, self-contained server
  fixtures/     Static sample data + binary fixtures (images)
  helpers/      Reusable harness: app boot, auth agents, factories, mocks
  setup/        Global Jest setup (env defaults)
```

## Running

```bash
# Jest suites (unit + integration + smoke)
npm test

# Individual Jest groups
npm run test:unit
npm run test:integration
npm run test:smoke

# Coverage report (Jest suites)
npm run test:coverage

# End-to-end (Playwright). One-time browser install first:
npm run test:e2e:install     # downloads the Chromium browser
npm run test:e2e             # runs the journeys
npm run test:e2e:ui          # interactive UI mode
```

## How it works

- **No external services are touched.** Integration/smoke/e2e tests boot an
  in-memory MongoDB (`mongodb-memory-server`); Cloudinary, HTTPS and the weather
  API are disabled or mocked. The first run may download a MongoDB binary.
- **The app is imported, not launched.** `app.js` only calls `listen()` when run
  directly; tests `require()` it and await `app.dbReady`. The E2E server
  (`tests/e2e/server.js`) starts its own listener on port 3100 and seeds a known
  admin (`admin@museum.com` / `Admin123`).
- **Auth is exercised for real** — integration tests log in through
  `POST /auth/login` and reuse the session cookie via a Supertest agent.
