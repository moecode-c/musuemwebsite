# Front-End Assets and Client-Side JavaScript

The browser-facing part of the project lives mostly in `views/` and `public/`. EJS templates render the HTML. CSS controls the look. Client-side JavaScript adds targeted interactivity where a full page reload would be unnecessary.

## What lives in the front-end folders

- `views/`
- `public/css/`
- `public/javascript/`
- `public/assets/`
- `views/partials/`
- `views/admin/`
- `views/about/`
- `views/shop/`
- `views/exhibits/`
- `views/virtual-tour/`

## Why the project uses EJS

- It keeps the server in control of page rendering.
- It avoids a separate SPA build pipeline.
- It works well with localization.
- It works well with sessions.
- It works well with admin dashboards.
- It works well with content-heavy pages.
- It makes deploys simpler.
- It keeps markup close to the data it uses.
- It makes the app easier to debug.
- It fits the overall MVC structure.

## Why the CSS is split up

The repository uses many CSS files because the pages are different.
A home page needs different styles than a shop page.
An admin page needs different styles than a virtual tour page.
An accessibility page needs different styles than a product card grid.
Splitting CSS by feature keeps the styles manageable.
It also makes changes safer.
It also makes the repository easier to search.
It also avoids one giant stylesheet turning into a mess.

## Why the public assets folder is large

- It contains images.
- It contains audio.
- It contains video.
- It contains 3D assets.
- It contains maps.
- It contains uploads.
- It contains VR assets.
- It contains game assets.
- It contains brochure files.
- It contains background and hero media.

## Important browser scripts

- `public/javascript/admin.js`
- `public/javascript/admin-assistance.js`
- `public/javascript/localization.js`
- `public/javascript/about.js`
- `public/javascript/artifact-popup.js`
- `public/javascript/artifactPopup-tabs.js`
- `public/javascript/admin-orders.js`
- `public/javascript/plan-trip.js`
- `public/javascript/virtual-tour.js`
- `public/javascript/explore-ages.js`

## Why some scripts use fetch

Fetch is the easiest way for a server-rendered page to talk to a JSON API.
That is why admin screens use it.
That is why status changes use it.
That is why delete actions use it.
That is why data refreshes use it.
It keeps the page light.
It keeps the page responsive.
It lets the server keep the real business logic.
It avoids a full front-end application where one is not needed.

## Example client-side flow

1. The page loads.
2. The browser script attaches event listeners.
3. The user clicks a button.
4. The script collects an ID or form data.
5. The script sends fetch.
6. The server updates the record.
7. The script checks the response.
8. The page reloads or updates.
9. The browser shows the change.
10. The interaction feels immediate.

## Why some assets are duplicated

Some files appear in more than one folder.
That is often a sign of content drift.
It may be accidental.
It may be historical.
It may be a compatibility choice.
It still creates extra storage and bandwidth cost.
The maintenance doc should be used to find and rationalize duplicates.
If the same file can be served once from one canonical location, that is usually better.

## What localization affects

- Text labels.
- Layout direction.
- Button labels.
- Page headings.
- Menu items.
- Admin labels.
- Form messages.
- Browser script text.
- Partial templates.
- Dynamic page content.

## Why the app remains easy to use without a SPA

- Most pages are mostly content.
- Server rendering handles the first load.
- CSS handles the layout.
- Scripts only add behavior where needed.
- Forms still work like forms.
- Admin actions only use fetch when it helps.
- The browser experience stays predictable.
- The codebase stays smaller than a full SPA stack.
- Deployments stay easier.
- Debugging stays practical.

## Asset performance rules

- Optimize image dimensions.
- Compress images.
- Compress videos when possible.
- Compress audio when possible.
- Avoid loading huge files by default.
- Use thumbnails where possible.
- Use lazy loading where practical.
- Reuse existing assets instead of creating near-duplicates.
- Cache static assets intelligently.
- Keep mobile users in mind.

## What to inspect when a page looks wrong

- Check the template file.
- Check the stylesheet linked by the template.
- Check the browser console.
- Check the browser network panel.
- Check whether the script ran.
- Check whether the route passed the right data.
- Check whether the locale is correct.
- Check whether the wrong asset path is being used.
- Check whether the image is too large or missing.
- Check whether the admin script is expecting a different DOM shape.

## Why front-end assets matter for bandwidth

Static assets are often the biggest part of page traffic.
A single hero image can cost more than several JSON calls.
A video can cost more than a dozen normal pages.
A 3D model can cost more than a whole admin workflow.
A duplicate asset doubles the cost without adding value.
That is why front-end optimization is not optional in this project.
It directly affects hosting usage and user experience.

## Browser script maintenance tips

- Keep scripts page-specific.
- Keep selectors simple.
- Keep error messages clear.
- Keep fetch URLs aligned with routes.
- Keep data attributes consistent.
- Keep reload behavior intentional.
- Keep text localized where necessary.
- Keep the code readable enough to edit later.
- Keep scripts short when possible.
- Split scripts if one file becomes too broad.

## Front-end and back-end connection

The front-end is not separate from the back-end here.
The template renders server data.
The CSS shapes the page.
The JavaScript talks to APIs.
The server still owns the data.
The browser only asks for changes or shows the result.
That relationship is one of the strengths of this architecture.
It keeps the project understandable even as content grows.

## Summary

The front-end layer in this project is mostly server-rendered, with carefully chosen client scripts where they make the most sense. The biggest technical concern is not framework complexity; it is media size, asset duplication, and keeping browser behavior aligned with the server routes.
