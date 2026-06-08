# Project Overview

The museum website is a single Express application that serves HTML pages, JSON APIs, static assets, uploaded media, and admin tools. It is designed as a practical content platform rather than a modern SPA. That choice keeps the public site straightforward while still supporting rich features like exhibit management, shop items, tickets, assistance requests, virtual tour media, and operational records.

## What the stack is

- Node.js runs the server.
- Express handles HTTP requests.
- EJS renders HTML on the server.
- MongoDB stores application data.
- Mongoose defines schemas and talks to MongoDB.
- Multer accepts file uploads.
- Cloudinary stores uploaded media when credentials are available.
- connect-mongo stores sessions in MongoDB.
- Helmet, compression, morgan, cookie-parser, and method-override provide common web middleware.
- Nodemon is used for development restarts.

## Core idea

The application mixes public visitor pages with admin screens and API endpoints in one repo. That means you need to understand both server-rendered behavior and fetch-driven client behavior. The same app can do all of the following:

- Render the home page.
- Render the exhibits page.
- Render the shop.
- Render the admin dashboard.
- Accept a ticket request.
- Accept an assistance request.
- Accept a testimonial.
- Accept a product or exhibit upload.
- Store orders and carts.
- Seed the database.
- Serve large media files.
- Run in Docker.
- Deploy on Render.

## The main folders

- `app.js` wires the app together.
- `config/` configures MongoDB, Cloudinary, and Multer.
- `controllers/` contains request logic.
- `middleware/` contains auth, roles, locals, validation, and error handling.
- `models/` contains Mongoose schemas.
- `public/` contains assets and browser scripts.
- `routes/` maps URLs to controllers.
- `seeders/` loads sample data.
- `utils/` contains upload helpers, async wrappers, and support utilities.
- `views/` contains the EJS templates.
- `certs/` contains certificate files used for HTTPS in local or LAN scenarios.

## The request lifecycle

1. A browser makes a request.
2. Express receives it.
3. Global middleware runs.
4. Sessions are loaded from MongoDB.
5. Locals middleware exposes request data to templates.
6. Route middleware checks auth or validation if needed.
7. The controller does the actual work.
8. The controller may read or write MongoDB.
9. The controller may upload or reference media.
10. The controller sends HTML, JSON, a redirect, or a file.

## Why the app is media-heavy

- The museum content includes images.
- The museum content includes videos.
- The museum content includes audio.
- The museum content includes 3D models.
- The museum content includes PDFs and panoramas.
- The museum content includes many large background images.
- The museum content includes a virtual tour.
- The museum content includes exhibit and shop imagery.
- The museum content includes duplicate copies of some assets in more than one folder.
- The museum content therefore uses more bandwidth than a normal text-focused site.

## Why the app looks simple in the browser

- Pages are rendered with the data they need.
- The browser does not need a large client framework.
- The admin UI can still feel interactive because it uses fetch where needed.
- Static files are served directly.
- Shared layout partials keep the UI consistent.
- Localization is handled in a server-friendly way.
- Most forms still behave like normal forms.
- The code is easy to read without a build pipeline for front-end bundles.
- This keeps the project approachable.
- It also keeps deployment simpler.

## Why admin pages sometimes use fetch

- Fetch avoids a full page reload for one action.
- Fetch is useful for status updates.
- Fetch is useful for delete actions.
- Fetch is useful for list refreshes.
- Fetch is useful when the server already returns JSON.
- Fetch is useful when the page is mostly static but needs a small amount of interactivity.
- Fetch is especially useful for moderation tools.
- Fetch helps keep server-rendered admin pages fast and practical.
- Fetch still uses server-side authorization.
- Fetch does not replace the route or controller; it just calls them from the browser.

## Why sessions matter

- Sessions let the app remember who is logged in.
- Sessions let the app store user state across requests.
- Sessions let the app protect admin tools.
- Sessions let templates show the current user.
- Sessions let guest-only routes redirect logged-in users.
- Sessions are stored in MongoDB so they persist beyond process restarts.
- Sessions are essential for cart and user workflows.
- Sessions are essential for the auth middleware.
- Sessions are also important when the app runs in Docker.
- Sessions are one of the main reasons the browser experience feels continuous.

## Why roles matter

- Not every logged-in user should be an admin.
- Roles make the access rules clearer.
- Roles keep the route layer readable.
- Roles keep the controller layer less cluttered.
- Roles make it easier to add permissions later.
- Roles are a better abstraction than hard-coding usernames.
- Roles are important for dashboards and moderation tools.
- Roles are also important for destructive actions.
- Roles are one of the safest places to enforce business policy.
- Roles keep the project scalable when staff responsibilities grow.

## Why seeders matter

- Seeders make a clean database usable.
- Seeders make local development faster.
- Seeders make demos possible.
- Seeders make screenshots easier.
- Seeders help test admin pages.
- Seeders help test role behavior.
- Seeders help verify forms and tables.
- Seeders prevent manual content entry from becoming a blocker.
- Seeders are especially useful for a content-rich museum app.
- Seeders keep the repository reproducible.

## Why deployment needs care

- The app depends on environment variables.
- The app depends on MongoDB.
- The app may depend on Cloudinary.
- The app may depend on HTTPS certificates locally.
- The app serves large static files.
- The app can therefore consume bandwidth quickly.
- Docker helps make deployment repeatable.
- Render helps make deployment easy to manage.
- The startup logs matter a lot when something fails.
- Deployment should be checked alongside asset size and upload configuration.

## What to optimize first

- Optimize the largest images.
- Remove duplicated media files.
- Move media to Cloudinary or another CDN when practical.
- Compress video if possible.
- Compress audio if possible.
- Keep the root app lean.
- Keep seed files and docs readable.
- Keep route names aligned with behavior.
- Keep controller responsibilities focused.
- Keep the app easy to reason about in production.

## What a new contributor should understand first

- This is a server-rendered Express app.
- The app has a real admin dashboard.
- The app has a real database schema.
- The app has real upload behavior.
- The app has real deployment needs.
- The app has many media files.
- The app is not just a set of static pages.
- The app is not just an API backend.
- The app is a museum platform with multiple workflows.
- The docs folder exists so you do not have to rediscover that from scratch.

## Suggested first bug-hunting path

- Start in `app.js` for startup issues.
- Start in `routes/` for URL issues.
- Start in `controllers/` for logic issues.
- Start in `models/` for data shape issues.
- Start in `views/` for template issues.
- Start in `public/javascript/` for admin UI issues.
- Start in `config/` for upload and database issues.
- Start in `middleware/` for access control issues.
- Start in `seeders/` for missing sample data.
- Start in `documents/` if you need a map first.

## Summary

The codebase is large mostly because the museum content is large. The app is built to keep the user experience simple while handling many kinds of content and several kinds of admin workflows. Understanding the project is mostly a matter of understanding where each kind of responsibility lives. That is exactly what the rest of this documentation folder explains.
