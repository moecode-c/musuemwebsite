


Museum Website
===============

Overview
--------

This repository is a Node.js Express application that serves a museum website with a mix of public pages (exhibits, shop, virtual tour) and an admin interface. Views use EJS templates. The project includes an upload pipeline (Multer + Cloudinary optional), seeders for sample data, and utilities for pagination, i18n, and more.

Key Features
------------

- Exhibit listing and detail pages with media support (images, audio, video, 3D models).
- Shopping cart and checkout flow (orders stored in MongoDB).
- Admin routes for managing exhibits, products, testimonials, tickets, and assistance requests.
- Seeders for sample data.
- Utilities for Cloudinary uploads with local fallback.

Tech Stack
----------

- Node.js (recommended 18+)
- Express
- EJS for server-side views
- MongoDB + Mongoose
- Multer for uploads
- Cloudinary (optional) for media hosting

Getting Started — Prerequisites
-------------------------------

Install tools:

- Node.js 18+ (download from nodejs.org)
- MongoDB (local or Atlas)
- Git
- Optional: Docker if you plan to containerize

Install repository dependencies

```bash
npm install
```

Environment variables
---------------------

Create a `.env` file in the project root. Minimal variables used by the app:

- `MONGODB_URI` — MongoDB connection string (e.g., `mongodb://localhost:27017/museum-dev`).
- `SESSION_SECRET` — random string for session encryption.
- `PORT` — port to listen on (defaults to 3000).
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — if using Cloudinary.

I can generate a `.env.example` if you want a template.

Run Locally
-----------

Start development server (with nodemon if configured):

```bash
npm run dev
```

Start production server:

```bash
npm start
```

Seeders and Sample Data
-----------------------

Seeders live in the `seeders/` folder. Typical usage:

```bash
node seeders/seedAll.js
```

Check individual seeder files to seed only specific collections.

Docker (optional)
-----------------

The repo includes a `Dockerfile`. Use these commands to build and run locally:

```bash
docker build -t museumwebsite .
docker run -p 3000:3000 --env-file .env museumwebsite
```

For local multi-service testing, you may add a `docker-compose.yml` that includes a MongoDB service.

Deploy to Render (Docker)
-------------------------

Render can build from the `Dockerfile`. Steps:

1. Create a new Web Service on Render and connect your GitHub/GitLab repo.
2. Choose 'Docker' as the environment; Render will use your `Dockerfile` to build.
3. Set environment variables on the Render dashboard (MONGODB_URI, SESSION_SECRET, CLOUDINARY_*).
4. Optionally set auto-deploy on push to your main branch.

Assets & Media
--------------

Static files live under `public/assets/`. Large media such as audio, video, and 3D models are stored here by default. Recommended approaches:

1. Convert images to WebP/AVIF using `sharp` for smaller payloads.
2. Offload heavy assets to Cloudinary or S3 + CDN and update templates to prefer CDN-hosted assets.
3. Use `scripts/list_largest_files.js` to identify the largest files in the project.

Utility Scripts
---------------

- `scripts/list_largest_files.js` — enumerates large files to help prioritize optimization.
- (Proposed) `scripts/optimize-assets.js` — to create optimized image copies (WebP/AVIF).

Testing and QA
--------------

Add tests as needed. Recommended:

- Unit tests for utilities (`utils/`) using Jest.
- Integration tests for main flows using Playwright or Puppeteer.

Troubleshooting
---------------

- If the app crashes on startup, check `MONGODB_URI` and that MongoDB is reachable.
- If uploads fail, confirm Cloudinary credentials and `utils/cloudinaryUpload.js` configuration.
- For session issues, confirm `SESSION_SECRET` and Mongo connection for `connect-mongo`.

Contributing
------------

If you plan to contribute:

1. Fork the repo and create a branch with a clear name.
2. Run tests and linters locally before opening a PR.
3. Include a clear PR description and screenshots for UI changes.

Coding Conventions
------------------

- Use ES2019+ syntax where appropriate.
- Prefer descriptive variable and function names.
- Avoid one-letter variable names except for counters/indices.

Security Notes
--------------

- Never commit secrets. Use platform-provided secret storage for production (Render secrets or environment variables stored in CI).
- Sanitize and validate uploads in `middleware/validation.js` and `multer` configuration.

Maintenance & Monitoring
------------------------

- Ensure logs go to STDOUT in containers and configure a log drain on your host.
- Run periodic audits for large files and remove duplicates.

Roadmap Ideas
-------------

- Add a dedicated asset management system: auto-optimization + Cloudinary sync.
- Add full CI (GitHub Actions) to run tests and build a Docker image on PRs.
- Add a staging deployment in Render or another host for pre-prod validation.

Support and Contact
-------------------

If you want help implementing any of the above items, tell me which one to start with:

- Generate `.env.example` and add to repo.
- Create `scripts/optimize-assets.js` to generate WebP/AVIF copies.
- Add GitHub Actions workflow for CI.

License
-------

Specify your license here or add a `LICENSE` file.
