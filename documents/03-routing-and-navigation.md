# Routing and Navigation

The route layer turns URLs into controller actions. It is the map of the application. When a page or API endpoint behaves strangely, this is usually the first folder to inspect after `app.js`.

## What routes do

- Bind a path to a controller.
- Choose the HTTP method.
- Apply middleware.
- Separate public pages from admin pages.
- Separate HTML rendering from JSON APIs.
- Keep URL behavior explicit.
- Make the app easier to maintain.
- Make debugging quicker.
- Make permissions visible at a glance.
- Keep the controller layer focused on actual work.

## The three big route categories

### Public pages

- These routes render EJS templates.
- They are meant for normal visitors.
- They include the home page and other content pages.
- They often read data from controllers before rendering.
- They may use query strings for filters or searches.
- They usually do not require login.
- They may still read locale or session data.
- They often use shared layouts and partials.
- They should remain fast to load.
- They should stay readable because they are the public face of the site.

### Admin pages

- These routes render dashboards or management screens.
- They are often protected by `requireAdmin`.
- They may preload data on the server.
- They may still use client-side fetch for actions.
- They are used by staff more than visitors.
- They should never assume access is safe by default.
- They often show lists, cards, stats, and moderation controls.
- They usually point to separate templates under `views/admin/`.
- They are the easiest place to see the operational shape of the app.
- They often connect to JSON endpoints for live changes.

### JSON APIs

- These routes are used by front-end scripts and forms.
- They return JSON instead of HTML.
- They often support CRUD behavior.
- They are used heavily by admin tools.
- They are used by upload flows.
- They are used by browser fetch calls.
- They can be used by server-rendered pages when the page needs live updates.
- They usually live under `/api/*`.
- They are ideal for structured data work.
- They keep HTML templates cleaner.

## Important route files

- `routes/pages.js` handles public page rendering.
- `routes/auth.js` handles login and registration behavior.
- `routes/admin.js` handles admin screens.
- `routes/exhibits.js` handles exhibit CRUD.
- `routes/products.js` handles shop item CRUD.
- `routes/orders.js` handles order data.
- `routes/tickets.js` handles ticket content and management.
- `routes/ticketRequests.js` handles ticket request submissions.
- `routes/testimonials.js` handles testimonials.
- `routes/users.js` handles user administration.
- `routes/assistance.js` handles accessibility help requests.
- `routes/tasks.js` handles operational tasks.
- `routes/cleaningZones.js` handles cleaning zone data.
- `routes/mapPins.js` handles map pin data.
- `routes/newsletter.js` handles newsletter-related flows.
- `routes/cart.js` handles cart pages and cart behavior.

## What to check when a route fails

- Check the URL path.
- Check the HTTP method.
- Check the route mount in `app.js`.
- Check the middleware before the handler.
- Check the controller function name.
- Check the validation middleware.
- Check whether the route is public or admin-only.
- Check whether a client script is calling the right API path.
- Check whether method override is required.
- Check whether the route is meant to render HTML or send JSON.

## Why method override matters

Some pages use HTML forms.
HTML forms only support GET and POST natively.
The app still wants PUT and DELETE for clean REST-style handlers.
`method-override` fills that gap.
That allows a form or button to behave like an update or delete action.
This is especially useful for admin tools and content management screens.
Without it, many server-rendered pages would need awkward route workarounds.

## Why route middleware matters

Route middleware is how the app avoids repeating itself.
A route can say `requireAdmin` once instead of checking access inside every controller.
A route can say `assistanceValidation` once instead of validating the same form again and again.
A route can say `requireAuth` once instead of every handler looking at the session manually.
This keeps route files compact.
It also keeps the security policy visible.
It makes the access model easier to audit.

## How query strings are used

Some routes use query strings for filtering and search.
That is common for list pages and API endpoints.
The exhibit API uses category and text search through query parameters.
Query strings are better than path parameters when the filter is optional.
They make the route easier to extend later.
They also allow the same endpoint to support both broad and narrow list views.

## How route names guide the reader

The path name usually tells you the data domain.
The route file name usually matches the controller file name.
The method usually tells you the action.
The middleware usually tells you the access rule.
That means you can infer a lot without opening the controller yet.
If the route file is clean, the whole app is easier to navigate.

## Public to API flow example

1. A visitor opens a page.
2. The page renders server-side.
3. The page includes a browser script.
4. The browser script calls an API endpoint.
5. The API endpoint returns JSON.
6. The script updates the UI or reloads the page.
7. The user sees a faster interaction than a full page refresh.

This pattern appears in the admin tools.
It keeps the user experience simple.
It also keeps the code split between page rendering and live data actions.

## Admin to API flow example

1. The admin page loads with server data.
2. A button click triggers JavaScript.
3. The JavaScript sends fetch to an API route.
4. The route checks permissions.
5. The controller updates the database.
6. The controller returns JSON.
7. The page reloads or updates state.

This is the pattern used in several moderation screens.
It is simple and robust.
It also avoids writing a much larger front-end framework.

## Route debugging checklist

- If the browser shows 404, confirm the path.
- If the browser shows 405, confirm the method.
- If the browser shows 403, confirm the permission middleware.
- If the browser shows validation errors, confirm the form fields.
- If the browser shows JSON but the page expects HTML, confirm the route was called from the right place.
- If the page loads but data is missing, confirm the controller returned the right payload.
- If the route works locally but not on Render, confirm environment and mount settings.
- If a client script fails, confirm the fetch URL.
- If a form fails, confirm method override and body parsing.
- If the route seems dead, confirm it is actually mounted in `app.js`.

## Why pages and APIs are separate

Pages and APIs serve different purposes.
Pages return human-readable HTML.
APIs return machine-readable JSON.
The separation keeps each route simpler.
It also makes admin screens more flexible.
It allows the site to stay server-rendered without losing interactivity.
It gives the browser a clear contract.
It makes testing easier because you know what kind of response to expect.

## Route structure as documentation

A good route file is a tiny architecture document.
You can read it and learn who can access the feature.
You can read it and learn what controller does the work.
You can read it and learn whether uploads or validation are involved.
You can read it and learn whether the feature is public or staff-only.
That is why route files are worth documenting.
They are the shortest path to understanding the app.

## Summary

If `app.js` is the command center, the route folder is the map. The routes tell you where the app goes, who is allowed to go there, and what kind of response the user should expect. When in doubt, start here before digging into controller code.
