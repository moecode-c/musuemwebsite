


Project Plan
============

Summary
-------
This plan expands the initial, high-level checklist into an actionable multi-week program for stabilizing, optimizing, and deploying the Museum website. It focuses on documentation, media asset reduction, developer ergonomics, reliable deployment (Render/Docker), and operations (monitoring, backups, rollback).

Goal
----
Deliver a stable, documented, and deployable Museum website with:

- Fast and reproducible local development workflows.
- A repeatable production deployment path (Render and Docker).
- A measurable reduction in bandwidth and repo footprint by optimizing and offloading large media assets.

Project Scope
-------------

In-scope:

- Source code and documentation improvements in this repository.
- Asset identification and optimization, either by generating optimized copies or offloading to a CDN.
- Basic CI/CD: automated builds and deploys using Docker or a platform like Render.

Out-of-scope (unless requested):

- Building a full, custom CDN service.
- Large-scale migration of existing customers/data outside Mongo without additional stakeholder sign-off.

Stakeholders
------------

- Repository owner / maintainer: primary decision-maker and deployer.
- Developers: contributors who will follow this plan for local development and testing.
- Ops / Hosting: any account owners (Render, Cloudinary, AWS) who will provide credentials.

Milestones & Detailed Tasks
---------------------------

Milestone 1 — Documentation and Onboarding
   - Deliverables:
      - Comprehensive `README.md` (this file will be expanded).
      - `PLAN.md` (this document) and a `documents/` directory with architecture notes.
      - `.env.example` file describing environment variables and values for local dev.
   - Tasks:
      - Review and expand `documents/*` to ensure examples and code references are correct.
      - Add CLI commands and common troubleshooting steps.

Milestone 2 — Asset Audit and Optimization
   - Deliverables:
      - A list of the top N largest static assets (images, audio, video, 3D models).
      - Scripts to generate optimized copies (WebP/AVIF) and optionally offload originals to Cloudinary/S3.
   - Tasks:
      1. Run `node scripts/list_largest_files.js --top 50` to get the candidate list.
      2. Decide on a policy: either keep optimized copies in repo (smaller) or store optimized assets on Cloudinary and point the app to CDN URLs.
      3. Implement a `scripts/optimize-assets.js` using `sharp` for images and `ffmpeg` for video thumbnails/compression.
      4. Where applicable, remove duplicates and archive originals outside the repo if appropriate.
      5. If files must be removed from Git history, use `git-filter-repo` or `bfg` and coordinate with maintainers to rebase forks.

Milestone 3 — Local Developer Experience
   - Deliverables:
      - `.env.example` and `Makefile` or `npm` scripts for common dev flows.
      - A stable seed workflow: `node seeders/seedAll.js` or granular seeders.
   - Tasks:
      1. Add `scripts/dev.sh` / `npm run dev` to standardize starting the app with recommended environment variables.
      2. Validate that seeders run idempotently and provide a `--drop` flag when needed.
      3. Document how to use Docker for local testing (see Milestone 4).

Milestone 4 — Build and Deploy
   - Deliverables:
      - Verified `Dockerfile` and optional `docker-compose.yml` for local staging.
      - Render deployment instructions (Docker service) with environment variable checklist.
   - Tasks:
      1. Verify the multi-stage `Dockerfile` builds a minimal production image.
      2. Create a “staging” service on Render and wire up environment variables.
      3. Add a small healthcheck endpoint and verify readiness/liveness in the container.
      4. Add a `deploy.md` with step-by-step Render UI and secrets guidance.

Milestone 5 — Monitoring, Backups & Safety
   - Deliverables:
      - Basic logging and alerting recommendations.
      - Backup script for MongoDB dumps and documentation on restore.
   - Tasks:
      1. Configure logs to STDOUT for containerized deployments and use a log drain or service like Papertrail if desired.
      2. Schedule automated MongoDB backups (Atlas or `mongodump` cron job) and store them in a secure bucket.
      3. Add a runbook for common recovery tasks (restore DB, roll back deploy, clear cache).

Operational Details — Asset Optimization Pipeline (step-by-step)
--------------------------------------------------------------

1. Identify candidates
    - Use `scripts/list_largest_files.js` to produce the top 100 largest files and their paths.
    - Export this list to a CSV for review.

2. Validate usage
    - For each candidate, run `git grep` or search views to identify whether the file is referenced in the site.
    - Discard files not referenced by any view or route (they can be archived).

3. Optimize images
    - Install `sharp` for Node-based image conversion: produce WebP and AVIF copies.
    - Example command: `sharp input.jpg --resize 1600 --webp({quality:75})`.

4. Optimize video/audio
    - Use `ffmpeg` to re-encode with a modern codec and bitrate appropriate for web delivery.
    - Generate a small poster image for each video and serve an HLS stream if needed for long videos.

5. Upload/Offload
    - Use `utils/cloudinaryUpload.js` to upload optimized assets; store resulting URLs in the DB or a config map.

6. Update references
    - Prefer CDN-hosted URLs in templates: implement a helper that prefers a CDN URL when present and falls back to local `public/assets/`.

7. Test & Validate
    - Run manual QA on critical pages (home, exhibit pages, shop) and check network payload sizes.

Testing & QA Plan
-----------------

- Unit testing: add tests for critical utils (e.g., `utils/cloudinaryUpload.js`) using Jest or Mocha.
- Integration testing: simulate common user flows with Puppeteer or Playwright (home, exhibit detail, cart flow).
- Smoke tests: after deploy, run a short script hitting key endpoints and validating HTTP 200/HTML structure.

Rollout & Rollback Strategy
---------------------------

Strategy: deploy to staging first, then promote to production after smoke tests.

Rollback steps:

1. Revert the Git commit that introduced the failing release and re-deploy.
2. If a DB migration caused issues, use the backup to restore the previous DB state.
3. For asset issues, either switch templates back to local copies or re-point CDN URLs to previous versions.

Security and Compliance Checklist
--------------------------------

- Environment secrets must never be committed; use Render/secret manager or `.env` on dev machines.
- Validate file uploads: limit file types and sizes in `multer` middleware and sanitize filenames.
- Keep dependencies updated and periodically run `npm audit`.
- Use HTTPS in production and enable HSTS where appropriate.

Backup & Disaster Recovery
--------------------------

1. Daily MongoDB snapshots: use Atlas scheduled backups or `mongodump` to S3 with lifecycle rules.
2. Export important assets (if not in Cloudinary) to a secure object store.
3. Keep a tested restore playbook in `documents/restore-playbook.md`.

CI/CD Recommendations
---------------------

- Add a CI pipeline (GitHub Actions) that runs lint, unit tests, and builds a Docker image on PR merges.
- Publish the Docker image to a private registry or let Render build from repo.

Maintenance Schedule (recurring tasks)
-------------------------------------

- Weekly: review logs for errors and alerts.
- Monthly: run an asset audit and consider further optimization.
- Quarterly: dependency upgrades and security review.

Risks & Mitigations
-------------------

- Risk: large media in repo causing bandwidth/slow deploys.
   - Mitigation: offload to Cloudinary and maintain optimized copies.
- Risk: misconfigured environment leading to secrets leak.
   - Mitigation: use platform secret management and rotate credentials.

Appendices
----------

Appendix A — Environment Variables

- `MONGODB_URI` — MongoDB connection string used by Mongoose.
- `SESSION_SECRET` — secret for express-session.
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — for Cloudinary uploads.
- `PORT` — port the app listens on (defaults to 3000).

Appendix B — Useful Commands

- Install dependencies:

   npm install

- Run dev server with nodemon:

   npm run dev

- Run seeders:

   node seeders/seedAll.js

- Build Docker image:

   docker build -t museumwebsite .

- List largest files using the repository script:

   node scripts/list_largest_files.js --top 50

Appendix C — Contacts

- Repository owner / maintainer: (add your name/email here)

Notes & Next Actions
--------------------

If you want, I can:

- Implement `scripts/optimize-assets.js` that creates WebP/AVIF copies inside `public/assets/optimized/`.
- Generate an `.env.example` file with placeholder values.
- Add a GitHub Actions workflow to run lint/tests and build a Docker image on push.

