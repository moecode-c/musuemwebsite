# Docker, Compose, and Render Deployment

This project is ready for container-based deployment. The Dockerfile defines how the app runs in production. Docker Compose helps with local orchestration. Render can run the repository as a Docker web service.

## What Docker is doing here

- Turns the app into a container image.
- Makes runtime behavior repeatable.
- Packages code and dependencies together.
- Uses the same entrypoint every time.
- Avoids machine-specific setup drift.
- Makes deployment easier to reason about.
- Matches the single-process Node app design.
- Works well with Render.
- Works well with local testing.
- Keeps startup behavior explicit.

## What Docker Compose is doing here

- Describes local service orchestration.
- Helps during development.
- Carries environment variables.
- Maps ports.
- Builds the image from the Dockerfile.
- Is not required by Render itself.
- Is useful for repeatable local runs.
- Lets you avoid remembering long commands.
- Can be extended later if supporting services are added.
- Stays separate from the runtime image definition.

## Files involved

- `Dockerfile`
- `docker-compose.yml`
- `package.json`
- `app.js`
- `.env`
- `config/db.js`
- `config/cloudinary.js`
- `seeders/`

## What the Dockerfile should do

- Install dependencies.
- Copy the application source.
- Expose the correct port.
- Set the runtime command.
- Run the app as a non-root user if possible.
- Keep the image smaller than it needs to be.
- Keep the build deterministic.
- Match the Node version the app expects.
- Avoid unnecessary build layers.
- Let the container start with `node app.js`.

## What Render needs

- A Git repository.
- A branch to deploy.
- A Docker web service.
- Environment variables.
- MongoDB connection data.
- Session secret data.
- Cloudinary data if uploads are cloud-backed.
- A valid app start command via the Dockerfile.
- A process that listens on `process.env.PORT`.
- A fast enough health check.

## Why Render usage can rise

Render bandwidth grows when the app returns large files.
That includes deploy layers.
That includes static assets.
That includes media downloads.
That includes repeated refreshes.
That includes images, audio, video, and 3D files.
This repo has a lot of those.
So usage can climb quickly even with few visible visits.
That is not unusual for a media-heavy site.
It does mean optimization is worth doing.

## Common environment variables

- `MONGODB_URI`
- `SESSION_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `HOST`
- `HTTPS`
- `SSL_KEY_PATH`
- `SSL_CERT_PATH`
- `PORT`

## Why the app listens on a single port

A single Node server is easy to deploy.
It is easy to containerize.
It is easy for Render to host.
It is easy to understand.
It avoids extra reverse proxy complexity.
It also matches the current app architecture well.
That is why the deployment path is straightforward.

## Local development with Docker

The simplest local flow is usually:

```bash
docker compose up --build
```

Use that when the image or dependencies change.
Use it when the Dockerfile changes.
Use it when you want to verify the build pipeline.
Use it when local state is inconsistent.
If you are only changing app code and the container already mounts it, you may not need a rebuild every time.

## When `--build` matters

- The Dockerfile changed.
- Package dependencies changed.
- The base image changed.
- The build steps changed.
- The environment files changed in a way that affects the image.
- You want to ensure a fresh image.
- You want to check dependency installation again.
- You suspect stale layers.
- You want to mirror a fresh Render deploy.
- You want a clean reproducible run.

## When `--build` is not necessary

- Only app code changed in a mounted volume setup.
- Only EJS templates changed in a dev container that reloads them.
- Only CSS changed and the files are already mounted.
- Only client scripts changed and the server can reload them.
- Only seed data changed and the container does not need a new image.
- Only a runtime value in the environment changed.
- Only a local database record changed.
- Only a browser page changed without touching the container image.
- Only a static asset path was updated outside the build.
- Only a user-level content change was made in the browser.

## Why Docker and Compose are different

Dockerfile defines the image.
Compose defines how to run the image.
Dockerfile is about the container itself.
Compose is about the local stack or service orchestration.
Dockerfile is what Render cares about.
Compose is what your local machine cares about.
They are related but not interchangeable.
They solve different problems.
The repo uses both because that is practical.

## Render deployment steps

1. Connect the repository.
2. Pick the branch.
3. Choose Docker as the runtime.
4. Set environment variables.
5. Confirm the service port.
6. Deploy.
7. Check the logs.
8. Verify MongoDB connection.
9. Verify Cloudinary uploads.
10. Verify the site loads correctly.

## What can go wrong during deploy

- Missing MongoDB URI.
- Missing session secret.
- Missing Cloudinary credentials.
- Wrong port binding.
- Certificate settings accidentally enabled.
- Startup crash from a missing file.
- Build failure from a dependency issue.
- Bandwidth from large media getting unexpectedly high.
- Health check failing before startup completes.
- A route or controller throwing during initialization.

## Why Docker helps this repo

- It keeps Node and package versions consistent.
- It reduces "works on my machine" issues.
- It makes Render behavior easier to mirror locally.
- It keeps startup commands explicit.
- It makes environment differences easier to spot.
- It gives you one place to document runtime behavior.
- It can make deploy troubleshooting much easier.
- It can simplify onboarding.
- It can simplify rollback reasoning.
- It fits a server-rendered Express app well.

## Best practice for this repository

- Keep the app listening on `PORT`.
- Keep secrets in environment variables.
- Keep media on a CDN when possible.
- Keep large binaries out of the database.
- Keep Docker image layers small.
- Keep Compose for local orchestration.
- Keep the build reproducible.
- Keep the startup log readable.
- Keep the health check simple.
- Keep the deployment checklist short and honest.

## Summary

Docker gives this app a stable runtime, Compose helps with local control, and Render gives you a straightforward cloud host. The key things to remember are the port, the database, the session secret, and the media credentials. If the app feels expensive to run, this is the doc to read with the maintenance doc.
