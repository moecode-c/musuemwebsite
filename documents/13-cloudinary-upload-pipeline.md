# Cloudinary Upload Pipeline

This appendix explains the upload pipeline in more detail because it is one of the most important system paths in the repository. The app handles product images and exhibit images or 3D models through a shared helper so the controllers stay small and the behavior stays consistent.

## The pipeline in one sentence

A browser submits a file.
Multer receives it.
The controller passes the buffer to `uploadBuffer`.
Cloudinary receives the file when configured.
The helper returns a URL.
The controller stores the URL in MongoDB.
The page later uses the URL in the browser.
That is the entire pattern.

## Why this approach is used

- Keeps binaries out of MongoDB.
- Keeps controllers simple.
- Keeps media delivery flexible.
- Keeps the browser on stable URLs.
- Keeps uploads reusable across domains.
- Keeps the code easier to debug.
- Keeps large files off the database path.
- Keeps Cloudinary optional in some local paths.
- Keeps media handling centralized.
- Keeps the app aligned with a media-heavy museum site.

## Files involved

- `config/multer.js`
- `config/cloudinary.js`
- `utils/cloudinaryUpload.js`
- `controllers/productsController.js`
- `controllers/exhibitsController.js`
- `routes/products.js`
- `routes/exhibits.js`
- `models/Product.js`
- `models/Exhibit.js`

## Product upload flow

- The form sends a product image.
- Multer receives the file.
- The controller reads `req.file`.
- The controller uploads the buffer.
- Cloudinary returns a secure URL.
- The controller stores the URL.
- The product is saved.
- The storefront later uses the saved URL.

## Exhibit upload flow

- The form sends exhibit data.
- The form may send an image.
- The form may send a 3D model.
- Multer receives `req.file` or `req.files`.
- The controller uploads the image buffer.
- The controller uploads the model buffer.
- Cloudinary returns secure URLs.
- The exhibit is saved with `imageUrl` and `modelUrl`.
- The exhibit page later uses those URLs.
- The admin page later edits those URLs.

## Why `requireCloudinary` exists

`requireCloudinary` forces the helper to fail when the cloud upload is not configured or the upload does not succeed.
That is useful for product and exhibit paths because those features are expected to use cloud storage in production.
Failing early is better than saving a bad record.
It also avoids silent broken media links.
It also makes the deployment environment easier to trust.
If uploads are required, the helper should not pretend they succeeded.

## Why the helper accepts buffers

Buffers are convenient because the file is already in memory from Multer.
The controller does not need to write a temporary file first.
The helper can stream the buffer directly.
That reduces extra disk work.
It keeps the upload path fast.
It also keeps cleanup simpler.
It is a good fit for this app because the files are usually relatively small compared to the rest of the workflow, even though some assets are still large.

## Why URLs are stored instead of file objects

- URLs are easy to render.
- URLs are easy to serialize.
- URLs are easy to cache.
- URLs are easy to share.
- URLs are easy to display in admin lists.
- URLs are easy to store in MongoDB.
- URLs can point to Cloudinary or local fallback paths.
- URLs keep the model schema small.
- URLs let the browser do the heavy lifting later.
- URLs reduce duplication.

## Cloudinary credential requirements

- Cloud name.
- API key.
- API secret.
- Environment variables in deploy.
- Correct account permissions.
- Network access to the upload endpoint.
- A working Cloudinary SDK configuration.
- A correct folder path for the upload destination.
- The right resource type for the file.
- A valid buffer from Multer.

## Resource type matters

Image uploads should use the image resource type.
Raw uploads should be used for files like 3D models when the file is not an image.
Choosing the right resource type matters because Cloudinary handles different file kinds differently.
If the type is wrong, uploads may fail or behave strangely.
That is why the controller is explicit about image versus raw uploads.
That clarity makes debugging easier.
It also makes the code easier to read later.

## Why local fallback exists

Local fallback is useful during development or when cloud configuration is temporarily unavailable.
It gives the app more flexibility.
It allows certain paths to continue in constrained environments.
It also makes it easier to see how the app behaves when Cloudinary is not present.
That said, production should normally use the cloud path for better scale and reliability.

## Common upload problems

- Wrong field name.
- Missing cloud credentials.
- Wrong resource type.
- Bad file buffer.
- Missing form encoding.
- Wrong route path.
- Wrong file extension.
- Large file size.
- Duplicate files in the repo.
- Incorrect fallback path.

## What to inspect when uploads fail

- The route definition.
- The Multer field names.
- The upload helper code.
- The Cloudinary config.
- The environment variables.
- The controller logic.
- The stored URL field.
- The browser form submission.
- The server logs.
- The deployment settings.

## Why this pipeline affects bandwidth

When uploads are stored in the cloud, the browser downloads the resulting URL later.
When media is served locally, the app itself serves the bytes.
Either way, a large file creates traffic.
That is why image compression and file cleanup matter.
That is also why duplicate copies are such a problem.
That is also why media-heavy pages can cause Render usage to jump quickly.
The upload pipeline and the bandwidth story are deeply connected.

## Summary

The upload pipeline is a clean example of the app's overall design: receive data in the controller, hand off heavy lifting to a helper, store a compact reference in MongoDB, and keep the browser focused on rendering URLs rather than shipping binaries through the database.
