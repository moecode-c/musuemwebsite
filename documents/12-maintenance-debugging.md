# Maintenance, Bandwidth, and Troubleshooting

This document collects the practical things to watch after the app is running. It covers large files, bandwidth usage, deployment pain points, debugging order, and the maintenance habits that keep the project healthy.

## What this repo needs ongoing attention for

- Large images.
- Large videos.
- Large audio files.
- Large 3D models.
- Duplicate assets.
- Upload configuration.
- Session configuration.
- Render environment variables.
- MongoDB connection settings.
- Seed data freshness.

## Why bandwidth can look high quickly

The site serves media-heavy pages.
It also serves admin pages that can trigger API calls.
It also serves deploy assets during build and start.
It also has some duplicated media.
It also contains large hero and virtual tour assets.
It also contains 3D model content.
It also contains audio and PDF files.
That means a few minutes of usage can create a surprising amount of traffic.
That is normal for this kind of application.
It does mean the largest assets should be watched carefully.

## The largest files are the first suspects

The repository contains files such as:

- `public/assets/images/item10.jpg`
- `public/assets/images/item1.jpg`
- `public/assets/herovid.mp4`
- `public/assets/pharaohtimeline/g1.jpg`
- `public/assets/images/item5.jpg`
- `public/assets/audio/pharoahVirtualaudio.mp3`
- `public/assets/3dmodels/tutenkahmonhead.glb`
- `public/assets/map/map.png`
- `public/assets/videos/homepagevid.mp4`
- `public/assets/Afterlife-museum-brochure.pdf`

Those files matter because even a single visit can download one or more of them.
If the app is used on mobile or refreshed repeatedly, the total can rise fast.
If the same file exists in two places, the cost rises again.
That is why the file list document is important.

## Maintenance priorities

- Compress images.
- Resize huge images.
- Convert where practical to WebP or AVIF.
- Remove duplicate audio or PDF copies.
- Move large media to Cloudinary or another CDN.
- Keep only one canonical copy of shared assets.
- Check that uploads use the expected field names.
- Check that Render variables are present.
- Check that sessions survive restarts.
- Check that seeders still match the models.

## What to inspect first when something breaks

1. Logs.
2. Route.
3. Controller.
4. Model.
5. Middleware.
6. Template.
7. Browser script.
8. Static asset path.
9. Environment variables.
10. Deployment settings.

That order is practical because it goes from the most visible failure to the most likely source of the bug.
It prevents random guessing.
It keeps fixes focused.
It also makes the app easier to support in the future.

## Bandwidth troubleshooting steps

- Check the largest files.
- Check whether the browser requested a video.
- Check whether a page auto-loads heavy media.
- Check whether assets are duplicated.
- Check whether cache headers are helping.
- Check whether Cloudinary is active.
- Check whether the browser is re-downloading the same file.
- Check whether a page has a heavy background image.
- Check whether the page loads media that should be lazy loaded.
- Check whether a deploy rebuild transferred more than expected.

## Runtime troubleshooting steps

- Confirm MongoDB connectivity.
- Confirm the session store.
- Confirm auth middleware.
- Confirm role checks.
- Confirm the upload helper.
- Confirm the route mount path.
- Confirm the template data.
- Confirm the client script.
- Confirm the environment variables.
- Confirm the server start command.

## Common deployment issues

- Wrong branch selected.
- Missing `MONGODB_URI`.
- Missing `SESSION_SECRET`.
- Missing Cloudinary credentials.
- Wrong Docker build context.
- Wrong port binding.
- HTTPS enabled without certificates.
- Health check not matching startup time.
- Media-heavy deploys taking longer than expected.
- Static assets bloating the transfer size.

## Debugging patterns by layer

### If the page does not load

- Check server startup.
- Check route mount.
- Check template errors.
- Check static file paths.
- Check the browser console.

### If the data is wrong

- Check the model.
- Check the controller.
- Check the seed data.
- Check the route query params.
- Check the template field names.

### If a button does nothing

- Check the client script.
- Check the selector.
- Check the dataset value.
- Check the fetch URL.
- Check the API response.

### If a user cannot access a page

- Check the session.
- Check the role.
- Check the auth middleware.
- Check the route protection.
- Check the redirect logic.

### If uploads fail

- Check Multer.
- Check Cloudinary.
- Check the request field name.
- Check the file buffer.
- Check the environment variables.

## Long-term maintenance habits

- Review large files periodically.
- Remove near-duplicate assets.
- Keep seed data fresh.
- Keep docs updated.
- Keep controller names clear.
- Keep route names predictable.
- Keep middleware small and reusable.
- Keep admin scripts page-specific.
- Keep environment variables documented.
- Keep deployment assumptions explicit.

## Why docs matter for maintenance

A repository with many domains becomes hard to hold in your head.
Docs reduce that problem.
They make it clear where each responsibility lives.
They make it clear which files to inspect first.
They reduce the chance of changing the wrong thing.
They are especially useful when the app changes over time.
They are also useful for onboarding.
They are also useful when performance becomes a concern.
They are also useful when deployment becomes expensive.

## Why cleanup work pays off

- Smaller media files reduce bandwidth.
- Fewer duplicate files reduce confusion.
- Cleaner seed data reduces setup time.
- Better environment docs reduce deployment mistakes.
- Better route docs reduce debugging time.
- Better middleware docs reduce access-control errors.
- Better client script docs reduce admin UI bugs.
- Better model docs reduce schema drift.
- Better upload docs reduce file-handling mistakes.
- Better deployment docs reduce support time.

## Simple rule for future changes

If a change affects media, document it here.
If a change affects startup, document it in the bootstrap and deployment docs.
If a change affects auth, document it in the auth doc.
If a change affects data shape, document it in the model doc.
If a change affects a route, document it in the route doc.
If a change affects the admin UI, document it in the admin doc.
If a change affects seed data, document it in the seed doc.
That keeps the folder useful instead of stale.

## Summary

This project is healthy when the large files are under control, the startup configuration is correct, and the auth and upload flows are aligned with the rest of the code. The app is large enough that the maintenance work is part of normal development, not an afterthought.
