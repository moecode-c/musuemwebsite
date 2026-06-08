# Database Models and Data Design

The models folder defines the shape of the MongoDB data. Each model represents one domain in the museum application. Controllers read and write those models, views consume the data, and seeders populate the collections with sample records.

## Why data modeling matters

- It defines what can be stored.
- It defines what can be queried.
- It defines what the UI can render.
- It defines what the API can return.
- It defines what seeders must insert.
- It defines what controllers can update.
- It defines what validation should expect.
- It defines what admin tools can manage.
- It defines what changes are risky.
- It defines the boundaries of the app.

## The models in the repository

- `User.js`
- `Exhibit.js`
- `Product.js`
- `Order.js`
- `Ticket.js`
- `TicketRequest.js`
- `Testimonial.js`
- `Newsletter.js`
- `Task.js`
- `CleaningZone.js`
- `MapPin.js`

## General model pattern

Most models follow the same basic ideas.
They use Mongoose schemas.
They define fields and types.
They may mark some fields as required.
They may use timestamps.
They may include relationships by ID.
They may store URLs for media.
They may store text fields for display.
They may store status fields for workflows.
They may be referenced by controllers and seeders.
They should stay aligned with the forms and routes.

## Users

- Users represent accounts.
- Users support login.
- Users support roles.
- Users are central to auth.
- Users are central to admin access.
- Users should store the minimal fields the app needs.
- Users may also store profile information.
- Users are used by seeders for test accounts.
- Users are used by middleware to decide access.
- Users are one of the first models to inspect when auth breaks.

## Exhibits

- Exhibits represent museum objects or display items.
- Exhibits store title and description.
- Exhibits store category data.
- Exhibits store era or period details.
- Exhibits store location data.
- Exhibits store image URLs.
- Exhibits store model URLs.
- Exhibits may store x and y coordinates.
- Exhibits support search and filtering.
- Exhibits support admin CRUD.

The exhibit model is especially important because it is tied to media uploads and admin editing. The controller normalizes categories, uploads files, and stores the resulting URLs. The database does not need the raw file itself.

## Products

- Products represent shop items.
- Products store names.
- Products store prices.
- Products store descriptions.
- Products store image URLs.
- Products may store extra shop metadata.
- Products feed the storefront.
- Products feed the cart and order flow.
- Products support admin CRUD.
- Products are often used in the largest purchase-related UI areas.

## Orders

Orders are important because they snapshot purchase data.
The order record should preserve what the customer bought at the time of checkout.
That means orders usually store item name, price, quantity, and customer details.
The order should not depend entirely on the product record still being unchanged later.
That is why the image usually stays on the product instead of being copied into each order.
Orders are historical records.
Orders should be stable.
Orders should be easy to review later.
Orders should survive product edits.
Orders should be simple enough for admin dashboards to display.

## Tickets and ticket requests

- Ticket records capture ticket information.
- Ticket requests capture pre-ticket or request-style submissions.
- The two are related but not identical.
- The app keeps them separate so workflows stay clear.
- Staff can review requests before converting them into final records.
- Visitors can submit request forms without touching admin tools.
- Admin pages can manage both kinds of records.
- Separate models make the business rules easier to express.

## Testimonials

- Testimonials represent feedback.
- Testimonials help build trust.
- Testimonials may require moderation.
- Testimonials are usually public-facing content.
- Testimonials often appear on the home page or a dedicated page.
- Testimonials are useful for social proof.
- Testimonials are a simple but valuable model.
- Testimonials are often seeded for a richer demo experience.

## Newsletter entries

- Newsletter records capture signups or mailing-list style submissions.
- Newsletter data is usually lightweight.
- Newsletter entries help engagement.
- Newsletter data can be reviewed in admin tools.
- Newsletter data may also be used for messaging workflows.
- Newsletter entries need validation to avoid junk data.
- Newsletter entries should stay simple.
- Newsletter data is mostly about contact information and timestamps.

## Tasks

- Tasks support operations.
- Tasks may belong to employees or staff.
- Tasks help manage work inside the museum.
- Tasks are not public content.
- Tasks are more like internal workflow records.
- Tasks fit the admin and operations side of the app.
- Tasks should have clear status fields.
- Tasks are useful in the dashboard.
- Tasks benefit from clean filtering and sorting.
- Tasks are a reminder that this app is not just a storefront.

## Cleaning zones

- Cleaning zones model internal work areas.
- They support staff operations.
- They can be tied to task tracking.
- They are part of the museum management side.
- They are not directly exposed to normal visitors.
- They fit the administrative structure of the project.
- They may include names, labels, or status details.
- They help the operations team organize the site.
- They are another sign that the project has multiple domains.
- They should remain simple and consistent.

## Map pins

- Map pins represent location markers.
- They help navigation or venue maps.
- They may point to physical areas in the museum.
- They may be used by map pages or tours.
- They are useful for visual location content.
- They may store coordinates or labels.
- They fit the museum experience well.
- They are likely part of the location or planning workflow.
- They should use stable field names.
- They should be easy to render on a page or map component.

## Common data design rules

- Keep the schema aligned with the form fields.
- Keep the schema aligned with the controller payload.
- Keep the schema aligned with the template expectations.
- Keep the schema aligned with the seed files.
- Keep the schema aligned with the API responses.
- Keep the schema aligned with the admin UI.
- Keep the schema aligned with the model validation.
- Keep the schema aligned with the deployment assumptions.
- Keep the schema aligned with media URL behavior.
- Keep the schema aligned with how the app actually uses the data.

## Why some values are URLs instead of binaries

The database stores references, not the raw media.
That is better for performance.
It is better for document size.
It is better for backups.
It is better for serving static pages.
It is better for Cloudinary workflows.
It is better for large files.
It is better for the admin dashboard.
It is better for content that may be replaced later.
It is better for historical records such as orders.
It is better for the overall architecture of this project.

## Why some values are snapshotted

Snapshotting protects history.
It prevents old records from changing when the source record changes.
It is especially important for orders and maybe requests.
It preserves what the user saw at the time.
It makes reporting more trustworthy.
It makes admin review more accurate.
It makes later changes safer.
It reduces dependence on mutable catalog content.
It is a good fit for e-commerce style records.
It is one of the reasons orders do not store product images directly.

## What to check when a model feels wrong

- Check the schema definition.
- Check the controller payload.
- Check the route body parsing.
- Check the form field names.
- Check the seed file.
- Check the template fields.
- Check the admin API response.
- Check whether a field should be a URL instead of raw media.
- Check whether a field should be required or optional.
- Check whether the model should be split into multiple records.

## Summary

The models folder is the data contract for the application. If you understand the models, you understand what the app really stores, what it only references, and why some features are more stable than others. This is the right place to look when a page or controller seems to be assuming a field that the database does not actually have.
