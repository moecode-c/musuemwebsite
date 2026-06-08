# Cart, Orders, Tickets, and Visitor Requests

This section explains the business workflows that sit between the public site and the admin dashboard. The app handles shopping, checkout, ticketing, and request-style submissions. Those flows are related, but each one serves a different purpose and should keep its own data shape.

## Main workflows

- Cart browsing.
- Cart updates.
- Checkout.
- Order creation.
- Ticket display.
- Ticket requests.
- Assistance requests.
- Testimonials.
- Newsletter signups.
- Admin review of submitted records.

## Why these flows are separate

The museum site is not only a content site.
It also has real visitor interactions.
Some interactions are temporary.
Some are final.
Some are requests.
Some are confirmations.
Some are public.
Some are moderation-driven.
The app keeps these paths separate so the business rules stay understandable.
That makes it easier to maintain the code and easier to show the right thing in the UI.

## Cart behavior

- The cart is usually session-driven.
- The cart belongs to the current browser session.
- The cart stores items selected by the visitor.
- The cart can be updated without creating an order yet.
- The cart is temporary state.
- The cart is the bridge between browsing and checkout.
- The cart controller reads and mutates that temporary state.
- The cart view shows the current contents.
- The cart should be easy to reset.
- The cart should not be treated as a historical record.

## Order behavior

- Orders are durable records.
- Orders are created after checkout.
- Orders should preserve item snapshots.
- Orders should preserve customer details.
- Orders should preserve pricing at purchase time.
- Orders should not depend on future product edits.
- Orders should be easy for admins to review.
- Orders should be sorted and displayed clearly.
- Orders should be smaller and more stable than the full product catalog.
- Orders are a historical business record.

## Why order items are snapshotted

If the cart points to a product that later changes, the old order should still reflect what the buyer actually purchased.
That is why order items usually store name, quantity, and price.
That is also why images are not necessarily duplicated into the order model.
The product record remains the source of truth for catalog media.
The order record remains the source of truth for the purchase snapshot.
This separation protects history.
It also keeps the order model lighter.

## Ticket content versus ticket request content

- Ticket records are final or more operational.
- Ticket requests are visitor submissions that may need review.
- The two models support different states of the same domain.
- One is closer to a managed record.
- The other is closer to a submission form.
- Keeping both makes the workflow easier to express.
- Admin staff can review request data before accepting it.
- Public visitors can submit requests without admin access.
- The separation keeps routes and controllers clearer.
- The separation keeps the database more understandable.

## Assistance requests

Assistance requests are a great example of a simple public submission flow.
The visitor fills a form.
The browser sends the form.
The route validates it.
The controller creates the record.
The admin page later shows the request list.
Admins can update status or delete entries.
The request is a public entry point, but the management flow is admin-only.
That split is exactly what this app does well.

## Testimonials and newsletter signups

- Testimonials represent public feedback.
- Testimonials may need moderation.
- Newsletter signups represent engagement data.
- Newsletter signups may feed marketing or contact workflows.
- Both can be simple forms.
- Both can be reviewed in admin tools.
- Both help the museum feel active and trustworthy.
- Both are content rather than infrastructure.
- Both are better when the validation is strict.
- Both are better when the admin list is easy to scan.

## Common controller responsibilities in this area

- Read the form or session state.
- Validate the request.
- Build the database payload.
- Create the record.
- Update the record.
- Delete the record.
- Return JSON or redirect.
- Keep the data shape stable.
- Keep the admin UI in sync.
- Avoid storing temporary browser state as permanent data.

## How admin tools interact with these records

The admin dashboard often renders the initial record list server-side.
It may also use fetch for status changes or deletions.
That approach is useful for tickets, assistance requests, and testimonials.
It keeps the page simple.
It lets the staff see current data without a full reload for every action.
It also keeps the server in charge of the final data change.

## Typical user flow examples

### Cart to order

1. Visitor adds products.
2. Visitor reviews cart.
3. Visitor checks out.
4. Controller snapshots item data.
5. Order document is created.
6. Admin can later review the order.

### Request to review

1. Visitor submits a request form.
2. Controller validates input.
3. Record is created.
4. Admin sees the record list.
5. Admin updates status or removes the record.

### Ticket workflow

1. Visitor sees ticket content or submits a ticket-related form.
2. Route sends request to controller.
3. Controller stores or updates the data.
4. Admin screens review the output.
5. Status can be changed if needed.

## What to inspect when a commerce flow fails

- Check the cart session.
- Check the route file.
- Check the controller input.
- Check the model field names.
- Check the order snapshot logic.
- Check the browser form payload.
- Check the admin template.
- Check the client-side script.
- Check the validation middleware.
- Check the redirect or JSON response.

## What to inspect when a request list is empty

- Confirm the form posts to the right route.
- Confirm the route is mounted.
- Confirm validation is not rejecting the input.
- Confirm the controller creates the document.
- Confirm the admin page is querying the right collection.
- Confirm the session or role check is not blocking the page.
- Confirm the seed data exists if the page depends on it.
- Confirm the browser is not hitting the wrong API URL.
- Confirm the record is not being deleted immediately by logic elsewhere.
- Confirm the admin template is using the correct field names.

## Why these records matter to the museum

- They support visitor engagement.
- They support revenue.
- They support planning.
- They support moderation.
- They support operations.
- They support customer service.
- They support content trust.
- They support internal staff work.
- They give the site useful business behavior beyond content pages.
- They make the application feel like a real platform.

## Data stability rules

- Keep orders historical.
- Keep carts temporary.
- Keep requests reviewable.
- Keep tickets clearly named.
- Keep testimonials easy to moderate.
- Keep newsletter signups simple.
- Keep the admin list and the database model aligned.
- Keep status values stable.
- Keep snapshot fields explicit.
- Keep public submissions separate from admin actions.

## Summary

The cart, order, ticket, and request workflows are where the museum site becomes more than a static presentation layer. They show how the app manages temporary state, permanent records, visitor submissions, and admin moderation. If the public site feels easy to use, this section is a big reason why.
