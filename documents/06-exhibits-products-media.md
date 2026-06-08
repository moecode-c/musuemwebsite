# Exhibits, Products, and Media Uploads

This project is media-heavy. Exhibits, products, hero sections, virtual tour pages, and admin previews all rely on images, audio, video, PDFs, or 3D assets. The media pipeline is one of the most important parts of the codebase because it affects performance, deployment, storage, and bandwidth.

## The media strategy

- Keep the database small.
- Store URLs instead of binaries.
- Upload binaries once.
- Serve media through a CDN when possible.
- Use local fallback when cloud credentials are missing.
- Keep the request handlers focused.
- Keep large files out of the database.
- Keep the UI pointing at stable URLs.
- Compress media when practical.
- Avoid duplicate copies of the same asset.

## Files involved

- `controllers/exhibitsController.js`
- `controllers/productsController.js`
- `config/multer.js`
- `config/cloudinary.js`
- `utils/cloudinaryUpload.js`
- `models/Exhibit.js`
- `models/Product.js`
- `public/assets/`
- `views/virtual-tour/`

## Why uploads matter so much here

A normal text site can ignore upload design for a long time.
This site cannot.
It stores large exhibit photos.
It stores large product photos.
It stores videos.
It stores audio.
It stores panorama and VR assets.
It stores model files.
It stores brochure PDFs.
It may also serve some of those files directly.
That means a small architecture mistake can produce a big bandwidth bill.

## How Multer fits in

Multer receives multipart form data.
It turns an uploaded file into a buffer or a file path depending on configuration.
The app uses memory-style handling for Cloudinary upload flows.
That lets the controller send the file buffer straight to the upload helper.
For some workflows, disk storage may still be available.
The important part is that the controller can see the file in `req.file` or `req.files`.
The field names must match the route and the form.
If the field name is wrong, the upload will appear to fail mysteriously.

## How Cloudinary fits in

Cloudinary is the main cloud media target.
It stores the uploaded file.
It returns a URL.
That URL is saved in MongoDB.
The page or API later uses that URL in the browser.
This keeps binary content out of the database.
It also keeps the app image delivery simple.
It also makes resizing or transformation easier later.
It is the right fit for a museum site with many assets.

## What `uploadBuffer` does

- Accepts a buffer.
- Accepts upload options.
- Chooses the Cloudinary upload stream.
- Resolves with a response object.
- Gives you `secure_url` on success.
- Can fail when Cloudinary is misconfigured.
- Can fall back to local storage for some paths.
- Lets controllers stay small.
- Lets all upload callers use the same helper.
- Centralizes the hard part of media handling.

## Why exhibits are special

Exhibits are not just products with different names.
They can have an image.
They can have a 3D model.
They can have a category.
They can have era and period fields.
They can have location data.
They can have coordinates.
They can be searched by several text fields.
They are used in both public pages and admin pages.
They are a major content area in the museum site.
They therefore deserve a full explanation.

## Exhibit creation flow

1. The client submits exhibit data.
2. The route receives the request.
3. Multer parses the file fields.
4. The controller normalizes the category.
5. The controller uploads the image if present.
6. The controller uploads the model if present.
7. The controller resolves URLs.
8. The controller parses coordinates.
9. The controller creates the MongoDB record.
10. The controller returns the created exhibit.

## Exhibit update flow

- The request may contain new text.
- The request may contain a new image.
- The request may contain a new model.
- The controller only uploads the files that were included.
- The controller only updates coordinates when valid numbers are supplied.
- The controller writes the new URLs back to MongoDB.
- The controller returns the updated document.
- The update route is useful for admin management.
- The update route should never silently break media links.
- The update route should stay aligned with the form field names.

## Why exhibits use category normalization

Category names in user input are messy.
People may type `pharaoh`, `Pharaonic`, `pharaonic `, or `Coptic`.
The controller maps those into consistent categories.
That helps filters.
That helps search.
That helps the UI.
That helps seed data.
That helps the public page stay clean.
That also helps the admin tools because the same category appears in a predictable form.

## Why products use a simpler pattern

Products are mainly shop items.
They usually need fewer fields than exhibits.
They still use image uploads.
They still store image URLs.
They still benefit from Cloudinary.
They still need compression and optimization.
But they do not need a 3D model upload pipeline.
That makes the product controller simpler than the exhibit controller.

## What the browser sees

- A stable image URL.
- A stable model URL.
- A stable product image URL.
- A stable public asset path.
- A stable card or gallery preview.
- A page that loads faster when the media is optimized.
- A request that is easier to cache.
- Less need for the browser to receive binary uploads repeatedly.
- Better performance on mobile.
- Better performance on Render.

## Why the repo has large static assets already

- Hero video is large.
- Virtual tour audio is large.
- 3D models are large.
- Panorama images are large.
- Background images are large.
- Some assets appear more than once.
- Some assets are stored in both `public/` and `views/`.
- Static assets count toward bandwidth when served from the app.
- That is why usage can spike even with few visitors.
- The file list in `documents/12-maintenance-debugging.md` should be read alongside this doc.

## Common media mistakes

- Wrong Multer field name.
- Missing Cloudinary variables.
- Upload helper configured too strictly.
- Large files copied into multiple folders.
- URLs saved incorrectly.
- File type not matching `resource_type`.
- Browser requesting the same large asset over and over.
- Images not compressed before upload.
- 3D models served from the app instead of a CDN.
- PDFs stored in more than one place.

## What to inspect when media fails

- Inspect the route file.
- Inspect the controller file.
- Inspect Multer config.
- Inspect Cloudinary config.
- Inspect the browser form field names.
- Inspect the saved MongoDB URL field.
- Inspect the static asset path.
- Inspect the deployment environment variables.
- Inspect the server logs.
- Inspect whether the file is duplicated somewhere else.

## Why the local fallback exists

Cloud uploads are convenient, but local fallback keeps development possible when credentials are missing or when you are testing certain paths offline.
That can be useful in a lab or during early development.
It also makes the app more robust.
The fallback should be understood, though, because production should normally prefer the cloud path for scalable media delivery.

## Media and bandwidth notes

- Large media files are the main reason Render usage can jump.
- Deploy images can also be large because dependencies and assets get transferred.
- The browser can redownload media if cache settings are not ideal.
- Videos are usually the most expensive single asset type.
- Audio is cheaper than video but still significant.
- 3D models can be surprisingly heavy.
- Even a few page loads can create a lot of traffic.
- Optimization is therefore a practical maintenance task, not a cosmetic one.

## Developer rules of thumb

- Store media outside the database when possible.
- Compress before you upload.
- Reuse URLs instead of copying files around.
- Keep only one canonical copy of each asset.
- Replace giant JPEGs with smaller versions when you can.
- Use WebP or AVIF for new image work when practical.
- Treat public assets as part of performance engineering.
- Treat upload configuration as part of feature development.
- Treat admin image management as part of the content model.
- Treat bandwidth as a real cost.

## Summary

The exhibit and product controllers show how this app handles media in practice. The pattern is simple: upload the file, receive a URL, store the URL, and render the URL later. The complexity is not in the code size; it is in the effect that media size has on hosting, deployment, and user experience.
