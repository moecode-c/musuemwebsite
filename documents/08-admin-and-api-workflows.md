# Admin Pages and API Workflows

The admin dashboard is a hybrid system. The page itself is usually server-rendered, but the interactions often happen through JSON API calls. That keeps the interface fast, clear, and easy to maintain without turning the project into a full single-page app.

## Core idea

- Render the page on the server.
- Load real data into the template.
- Attach a small browser script.
- Use fetch for action buttons.
- Return JSON from the API.
- Reload or update the page.
- Keep access control on the server.
- Keep the UI small and focused.
- Keep the admin experience responsive.
- Keep the code simple enough to debug.

## Relevant files

- `routes/admin.js`
- `controllers/adminController.js`
- `views/admin/`
- `public/javascript/admin.js`
- `public/javascript/admin-assistance.js`
- `routes/exhibits.js`
- `routes/assistance.js`
- `routes/products.js`
- `routes/orders.js`
- `routes/tickets.js`
- `routes/testimonials.js`

## Server-rendered admin pages

The admin page shell is rendered by the server.
That means the page can show a list, count, or dashboard summary immediately.
The server can also enforce auth and role checks before the page appears.
This is practical because the dashboard should not depend on a large front-end build.
It also keeps the initial load simple.
It also lets the layout stay consistent with the rest of the site.
It also makes localization easier.

## Client-side admin behavior

The browser scripts are intentionally narrow.
A script usually owns one page.
A script listens for clicks or submits.
A script reads dataset attributes.
A script sends fetch requests.
A script handles a success or error state.
A script may reload the page after the action completes.
This style works well for moderation and CRUD screens.
It keeps the admin interface lively without making the project complex.

## Exhibit admin workflow

- The page loads exhibit data.
- The script may fetch exhibit records.
- The page renders cards or list items.
- Buttons can open edit flows or delete flows.
- The exhibits API handles create, update, list, and delete.
- Uploaded images and models go through the media pipeline.
- Category search and filters are handled by the API layer.
- The admin UI stays consistent with the stored data.
- This is the heaviest admin workflow in the project.
- It is also one of the most important.

## Assistance admin workflow

- The assistance page is server-rendered.
- The page can display a list and summary stats.
- The browser script attaches to status buttons.
- The browser script attaches to delete buttons.
- The script sends PUT for status changes.
- The script sends DELETE for removals.
- The controller updates the database.
- The page reloads to reflect the new state.
- The staff user gets quick feedback.
- The server remains the source of truth.

## Why fetch is used here

Fetch lets the admin UI update a single record without re-submitting the whole page.
That makes moderation less clunky.
It also keeps the route contract clear because the browser sends JSON to a JSON endpoint.
It avoids writing unnecessary page logic.
It works well with server-rendered templates.
It works well with dataset attributes.
It works well with status buttons.
It works well with delete confirmation dialogs.
It is a practical fit for this project.

## Why server rendering still matters

Server rendering gives the admin page real data immediately.
It avoids a blank shell while JavaScript is loading.
It is easier to localize.
It is easier to secure.
It is easier to read.
It also means the page still has value even if a client script fails to run.
That is one reason the dashboard is not a full SPA.
The hybrid design gives the best tradeoff for this repository.

## Common admin patterns

- Show a count.
- Show a list.
- Show a status badge.
- Show action buttons.
- Hide dangerous actions behind confirmation.
- Use fetch for a single action.
- Reload after success when needed.
- Return JSON from the API.
- Use clear route names.
- Keep scripts page-specific.

## Permission checks

Admin routes should always be protected.
The UI hiding a button is not enough.
The route should check the role.
The controller should assume the route already protected access.
The API should still refuse a bad request.
This layered approach is safer.
It also makes bugs easier to locate.
When a request is rejected, you can inspect the route file and the middleware first.

## How the admin page gets its data

1. The controller queries MongoDB.
2. The server renders the page.
3. The page receives the records.
4. The browser loads the script.
5. The script binds events.
6. The user clicks a button.
7. Fetch calls the API.
8. The API updates the record.
9. The page refreshes or re-renders.
10. The dashboard shows the new state.

## What to inspect when admin tools fail

- Check the role middleware.
- Check the session user.
- Check the page route.
- Check the API route.
- Check the client script.
- Check the dataset values.
- Check the JSON response.
- Check the controller update logic.
- Check the template field names.
- Check whether the page reloads after success.

## Admin examples in this repo

- Exhibit management.
- Assistance request review.
- Ticket request review.
- Testimonial moderation.
- Order review.
- User management.
- Task tracking.
- Cleaning zone management.
- Map pin management.
- Newsletter review.

## Why the scripts are small

The scripts do not own the business logic.
They only own button wiring and API calls.
That means they stay short and readable.
It also means the server remains the authority.
It also means the page can be reasoned about without a large front-end stack.
It also means the maintenance burden stays low.
If a script gets too large, it probably should be split by page.

## Why the admin page structure is useful

- It is easy to debug.
- It is easy to secure.
- It is easy to localize.
- It is easy to deploy.
- It is easy to read.
- It is easy to extend.
- It is easy to connect to server data.
- It is easy to keep consistent with the public site.
- It is easy to refresh after actions.
- It is a good fit for a content management style app.

## What the API should return

- Success responses should be clear JSON.
- Error responses should be clear JSON.
- Validation errors should be understandable.
- Delete responses should be small.
- Update responses should include the updated record when useful.
- List responses should be sorted or filtered predictably.
- Upload responses should include the saved URLs.
- Status responses should reflect the latest value.
- The browser script should not have to guess.
- The response contract should stay stable.

## Summary

The admin pages are a good example of how the app combines server rendering with lightweight interactivity. The page gives staff a readable view, while the API and browser script handle the actual actions. This pattern keeps the admin area usable, secure, and easy to maintain.
