# Museum Website Documentation Index

This folder is a full written map of the museum website. It explains the application structure, server startup, routes, data models, uploads, admin pages, seeders, deployment, and the performance issues that matter most in a media-heavy site.

## How to read this folder

Start with the overview if you want the broad shape of the application.
Read the bootstrap file next if you want to understand how the server starts.
Read routes and controllers together because that is where most behavior lives.
Read the media and deployment docs together if you care about bandwidth or Render.
Read the seeder and maintenance docs if you want to keep the app healthy over time.

## File map

- [01-overview.md](01-overview.md) explains the project at a high level.
- [02-bootstrap.md](02-bootstrap.md) explains `app.js`, middleware order, port selection, and startup flow.
- [03-routing-and-navigation.md](03-routing-and-navigation.md) explains URLs, page routes, API routes, and navigation patterns.
- [04-auth-sessions-and-roles.md](04-auth-sessions-and-roles.md) explains login state, sessions, guest checks, and role-based access control.
- [05-data-models.md](05-data-models.md) explains the MongoDB models and why each record shape exists.
- [06-exhibits-products-media.md](06-exhibits-products-media.md) explains exhibit uploads, product uploads, Cloudinary, and media URLs.
- [07-cart-orders-tickets.md](07-cart-orders-tickets.md) explains cart state, orders, tickets, and visitor request workflows.
- [08-admin-and-api-workflows.md](08-admin-and-api-workflows.md) explains the admin dashboard and the client-side API calls that power it.
- [09-seeders-and-sample-data.md](09-seeders-and-sample-data.md) explains the seed scripts and how sample data is loaded.
- [10-deployment-docker-render.md](10-deployment-docker-render.md) explains Docker, Compose, and Render deployment.
- [11-frontend-assets-and-client-js.md](11-frontend-assets-and-client-js.md) explains EJS templates, CSS, static assets, and browser scripts.
- [12-maintenance-debugging.md](12-maintenance-debugging.md) explains troubleshooting, bandwidth, large files, and long-term maintenance.

## Repository anchor points

- `app.js` is the runtime entry point.
- `package.json` defines `start`, `dev`, and `seed` scripts.
- `controllers/` owns request handling.
- `routes/` owns endpoint wiring.
- `models/` owns MongoDB schemas.
- `views/` owns EJS templates.
- `public/` owns CSS, JavaScript, and media.
- `seeders/` owns repeatable sample data.
- `config/` owns database, Cloudinary, and Multer setup.
- `middleware/` owns auth, roles, locals, validation, and error handling.
- `utils/` owns shared helpers such as upload, async wrapping, and API helpers.

## What makes this app unusual

- It is not a small brochure site.
- It is not a pure API server.
- It is a hybrid museum platform.
- It includes public pages, admin pages, shop pages, ticketing pages, and immersive media pages.
- It also includes operational workflows such as tasks, cleaning zones, and assistance requests.
- That means the codebase mixes content delivery, data entry, moderation, and media hosting.
- The result is easy to use but large enough to need careful documentation.
- The largest files are media assets, not JavaScript files.
- That is why bandwidth matters so much in this project.
- That is also why Render usage can rise quickly even when only a few requests were made.

## Reading order for a new contributor

1. Read `01-overview.md`.
2. Read `02-bootstrap.md`.
3. Read `03-routing-and-navigation.md`.
4. Read `04-auth-sessions-and-roles.md`.
5. Read `05-data-models.md`.
6. Read `06-exhibits-products-media.md`.
7. Read `07-cart-orders-tickets.md`.
8. Read `08-admin-and-api-workflows.md`.
9. Read `09-seeders-and-sample-data.md`.
10. Read `10-deployment-docker-render.md`.
11. Read `11-frontend-assets-and-client-js.md`.
12. Read `12-maintenance-debugging.md`.

## What to keep in sync

- If a route changes, update the matching controller note.
- If a model field changes, update the matching data and form notes.
- If a media path changes, update the media and deployment docs.
- If auth behavior changes, update the session and role docs.
- If a new admin page appears, update the admin workflow doc.
- If a new large asset appears, update the maintenance doc.
- If a new seeder appears, update the seeder doc.
- If the app gains a new deployment target, update the deployment doc.
- If localization behavior changes, update the overview and frontend docs.
- If bandwidth changes again, re-check the asset list and the maintenance doc.

## Why these docs exist

- They reduce guesswork.
- They let you trace features quickly.
- They make the repository easier to hand off.
- They are useful when the app grows.
- They are useful when you need to deploy quickly.
- They are useful when the site feels slow or expensive to run.
- They are useful when a feature works in one place but not another.
- They are useful when the project has many content categories.
- They are useful when the codebase already has a lot of media.
- They are useful when you need to remember where a behavior is actually implemented.
- They are useful when you want to avoid re-reading the whole repository every time.

## Notes on tone

- The docs use plain language.
- The docs prefer file names over vague descriptions.
- The docs prefer practical examples over abstract architecture talk.
- The docs keep the project-specific details close to the file references.
- The docs are intended for future maintenance, not just for the current session.
- The docs are intentionally verbose so the repository is easier to navigate later.
- The docs are organized by feature instead of by abstract theory.
- The docs mention the same important files more than once because that is how people actually read large repositories.
- The docs should help both development and deployment work.
- The docs should also help when bandwidth or media handling becomes the main concern.
- The docs are meant to be edited as the app evolves.

## Next place to look

- If the server does not start, open `02-bootstrap.md`.
- If a URL is wrong, open `03-routing-and-navigation.md`.
- If a user cannot log in, open `04-auth-sessions-and-roles.md`.
- If data looks wrong, open `05-data-models.md`.
- If uploads are failing, open `06-exhibits-products-media.md`.
- If admin actions are failing, open `08-admin-and-api-workflows.md`.
- If the site is empty after reset, open `09-seeders-and-sample-data.md`.
- If Render is expensive, open `10-deployment-docker-render.md` and `12-maintenance-debugging.md`.
- If the browser is acting strangely, open `11-frontend-assets-and-client-js.md`.
- If you still do not know where something lives, start from this index again.
