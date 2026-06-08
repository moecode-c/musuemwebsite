# Application Bootstrap and Server Startup

The bootstrap layer lives in `app.js`. It is the file that loads environment variables, configures Express, wires middleware, mounts routes, and starts the HTTP or HTTPS server. If something about startup, port binding, sessions, certificates, or route ordering is wrong, this is the first file to inspect.

## What bootstrap is responsible for

- Loading `.env` values through dotenv.
- Connecting to MongoDB.
- Configuring Cloudinary.
- Creating the Express app.
- Setting the EJS view engine.
- Setting the views directory.
- Adding security middleware.
- Adding logging middleware.
- Adding parsers for JSON and form submissions.
- Adding cookie parsing.
- Adding method override support.
- Mounting static files.
- Creating the session store.
- Mounting locals middleware.
- Mounting page and API routes.
- Defining a few file-serving helpers.
- Starting the server on the configured host and port.
- Handling HTTPS when requested.
- Printing useful startup logs.

## Why startup order matters

The order in `app.js` is not arbitrary.
The app needs configuration before it can connect to MongoDB.
The app needs parsers before routes read request bodies.
The app needs sessions before auth middleware can read them.
The app needs locals before templates render.
The app needs static assets before the browser asks for them.
The app needs routes after the supporting middleware is ready.
The app needs error handling at the end.
If the order is wrong, the whole request chain becomes harder to debug.

## The important middleware stack

- `helmet()` adds common security headers.
- `compression()` reduces response size where possible.
- `morgan("dev")` prints request logs.
- `express.json()` parses JSON bodies.
- `express.urlencoded({ extended: true })` parses HTML form submissions.
- `cookieParser()` reads cookies.
- `methodOverride("_method")` lets forms simulate PUT and DELETE.
- `express.static()` serves files from `public/`.
- Session middleware stores login state.
- Locals middleware exposes request data to views.

## What sessions do at bootstrap time

The session middleware is important because the app uses login state, role checks, and session-aware browsing.
The session store is backed by MongoDB.
That means the session survives process restarts better than memory-only storage.
The cookie options are conservative and web-friendly.
The secret should come from the environment in production.
The session configuration is also one of the things that can differ between local Docker and Render.
If sessions vanish, inspect the bootstrap configuration first.

## What the bootstrap does for static files

The application serves a lot of static assets.
The `public/` directory holds CSS, JavaScript, images, audio, video, and 3D files.
The app also exposes some vendor dependencies from `node_modules`.
That is helpful because templates can load those assets without a bundler.
Static files should be mounted before route handlers so requests for images do not travel through controller logic.
This matters because the site contains large files.
Serving them directly is much faster than passing them through Mongo or a view engine.

## Special file routes in bootstrap

Some files live in unusual places.
The app has routes that serve the virtual tour brochure or audio assets directly from `views/virtual-tour/`.
That is not the usual pattern for a typical Express site, but it is practical here because those files are part of the tour experience.
When you see a file response instead of a template response, check `app.js` first.
A path may be intentionally wired there instead of being handled by a controller.
That is why this file is more than just boilerplate.

## How HTTPS works here

The app can run with HTTPS if the environment requests it.
That makes local LAN testing more realistic.
It also means the bootstrap must check for certificate paths.
The code does not silently pretend HTTPS is available when the certificates are missing.
That strict behavior is useful because it prevents false confidence.
If you are testing on a phone over the network, the HTTPS and host settings matter.
If certificates are wrong, startup will fail early rather than produce a confusing partially secure state.

## Why the host is important

The host should be `0.0.0.0` in container and LAN scenarios.
That makes the server reachable outside the local loopback interface.
It matters for Docker.
It matters for Render.
It matters for phone testing on the same network.
It matters when you want to use the app on another device.
If the host is wrong, the app may appear to work but will not be reachable externally.

## What happens after startup

1. Config is loaded.
2. Database connection begins.
3. Express is configured.
4. Middleware is attached.
5. Sessions are initialized.
6. Locals are attached.
7. Routes are mounted.
8. The error handler is attached.
9. The server listens.
10. Logs confirm the host and port.

## Why `app.js` is a root-level file

The root location is useful because the process entry point should be easy to find.
Docker can call `node app.js` directly.
Render can start the container without extra indirection.
Nodemon can watch the file in development.
The package scripts can point to it explicitly.
This makes the startup path easy to understand.

## Common startup problems

- The database URL is missing or wrong.
- The session secret is missing or weak.
- Cloudinary is not configured but uploads require it.
- A certificate path is missing when HTTPS is enabled.
- The wrong port is selected.
- Another process is already using the port.
- A route file is missing or throws on require.
- A middleware file throws during import.
- A file path for a static asset is wrong.
- An environment variable is read before dotenv runs.

## How to debug startup issues

Check the console output first.
Check whether the database connection succeeded.
Check whether the route mount order is complete.
Check whether the port and host are printed correctly.
Check whether the app is trying to start in HTTPS mode unexpectedly.
Check whether a missing file import is causing the boot to crash.
Check whether session configuration depends on variables that are not present.
Check whether the app can serve a simple static file.
Check whether the failure appears before or after the server begins listening.
That usually tells you whether the problem is configuration or runtime.

## What the bootstrap does not do

- It does not implement business logic.
- It does not render pages directly.
- It does not write MongoDB records directly.
- It does not perform role checks itself.
- It does not upload files itself.
- It does not contain the exhibit or product rules.
- It does not contain the seeder logic.
- It does not contain the admin UI behavior.
- It does not replace controllers or models.
- It only connects all the pieces together.

## Why this file matters so much

If the app starts incorrectly, everything else looks broken.
If the bootstrap is correct, most feature bugs become easier to isolate.
If the bootstrap is wrong, you can waste time checking the wrong layer.
That is why startup should be documented separately from routes and controllers.
That is also why deployment and local development often fail in the same place.
The file is small compared to the rest of the repo, but it is one of the most important files in the whole application.

## Reading this file with the rest of the repo

Read it with the package scripts to see how the app is launched.
Read it with the database config to see how MongoDB becomes available.
Read it with the upload config to see why media works.
Read it with the auth middleware to see where sessions become useful.
Read it with the route files to see what gets mounted where.
Read it with the deployment doc to see why Docker and Render care about the same startup details.

## Summary

`app.js` is the command center for the application. It does not contain most of the feature logic, but it decides whether the feature logic can run safely. If you understand this file, you understand the environment the rest of the code runs in.
