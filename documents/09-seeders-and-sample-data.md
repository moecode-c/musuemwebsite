# Seeders and Sample Data

Seeders are the repeatable data-loading scripts for the project. They exist so a blank database can become a usable museum site without manually entering every record. For a content-rich app like this one, seeders are essential.

## What seeders do

- Clear selected collections.
- Insert sample records.
- Provide demo content.
- Make development easier.
- Make demos possible.
- Make screenshots easier.
- Make testing easier.
- Make new environments usable.
- Keep sample data consistent.
- Support the `seed` script in `package.json`.

## Why seeders matter here

The museum app has many content types.
There are exhibits.
There are products.
There are users.
There are tickets.
There are testimonials.
There are newsletter records.
There are map pins.
There are tasks.
There are cleaning zones.
There are request-style records.
Without seeders, a fresh database would feel empty.
That would make the site harder to explore.
It would also make admin screens harder to test.

## Main seeder files

- `seeders/seedAll.js`
- `seeders/users.seed.js`
- `seeders/exhibits.seed.js`
- `seeders/products.seed.js`
- `seeders/tickets.seed.js`
- `seeders/ticketRequests.seed.js`
- `seeders/testimonials.seed.js`
- `seeders/newsletter.seed.js`
- `seeders/mapPins.seed.js`
- `seeders/tasks.seed.js`
- `seeders/cleaningZones.seed.js`

## How the seeder entrypoint works

The entrypoint loads environment variables.
It connects to MongoDB.
It clears the collections it owns.
It calls the individual seed functions.
It waits for each one to finish.
It logs progress.
It exits when complete.
This makes the process repeatable.
It also makes resets predictable.
It is not a migration system.
It is a content population system.

## What a seed file usually contains

- A list of sample objects.
- The model or collection target.
- A clear insert step.
- Sometimes a clear delete step first.
- Sometimes references to related records.
- Sometimes role data.
- Sometimes demo media URLs.
- Sometimes dates or status fields.
- Enough realism to exercise the UI.
- Enough simplicity to read quickly.

## Why destructive deletes are okay in seeders

Seeders are intentionally reset-oriented.
That is the point.
They are not for production editing.
They are for creating a known state.
If you need to start over, a delete-first approach is useful.
It keeps old demo records from mixing with new ones.
It keeps the sample set clean.
It keeps the app predictable after a reset.
That is especially helpful for local development.

## Why seed data should match real field names

Seeders should follow the same field names the controllers use.
That way the sample data actually exercises the app.
If a required field is missing in a seed, the model may reject it.
If a field name is wrong, the page may render incorrectly.
If a relation is wrong, an admin screen may look broken.
If a category value is wrong, filters may not work.
Seeders are therefore part of the contract of the app.

## Users and roles in seeds

User seed data is important because auth and roles depend on it.
A clean database with no users is not enough to test the app.
Seeded users can represent admin or staff accounts.
Seeded users can also represent ordinary users.
That makes it possible to test guest flows, protected flows, and admin flows.
If roles change, seed data should change too.
If login changes, seed data should change too.
If passwords are hashed differently, seeds should change accordingly.

## Content seed data

- Exhibits should look like real museum entries.
- Products should look like real shop items.
- Tickets should look like real ticket entries.
- Testimonials should sound like believable feedback.
- Newsletter entries should be simple and realistic.
- Map pins should make sense on the site.
- Tasks should reflect real operational work.
- Cleaning zones should reflect real staff organization.
- Request data should look like real submissions.
- The goal is usefulness, not perfect truth.

## Why seeders help the admin dashboard

The admin dashboard often expects data to exist.
If there are no records, the page may look empty or boring.
Seeders make the page useful right away.
They let staff explore moderation tools.
They let you test list sorting and search.
They let you test delete and update buttons.
They let you confirm that counts and badges still render.
That is why seeders are a development productivity tool, not just a database script.

## Typical seed workflow

1. Connect to MongoDB.
2. Clear the target collections.
3. Insert sample documents.
4. Verify relationships and references.
5. Open the app.
6. Browse the public pages.
7. Open the admin dashboard.
8. Confirm the tables and cards have data.
9. Confirm auth still works.
10. Confirm the app is usable.

## What to watch out for in seeders

- Duplicated IDs.
- Invalid role names.
- Missing required fields.
- Bad media URLs.
- Mismatched categories.
- Broken text encoding.
- Dates in the wrong format.
- Passwords that are not hashed when the app expects hashes.
- Reference values that do not match the target collection.
- Seed order that depends on data that has not been inserted yet.

## Why some seed data may be repeated

Some collections are used by several pages.
It can be useful to seed enough variety that different views look realistic.
That does not mean every record must be unique in every field.
It means the app should feel alive enough to test.
A little repetition is okay.
The main goal is coverage.
If a page can show multiple states, the seeds should include those states.

## Seeders and deployment

Seeders are most often a development or setup task.
They can also be useful after a fresh staging or test environment is created.
They are not usually part of every production deploy.
If you run them in production, you should know exactly what they delete.
That is why the seed scripts live separately from the normal app runtime.
They are support utilities.
They are not business logic.

## Seeders and the package scripts

The package file exposes a `seed` command.
That makes the seeding entrypoint easy to remember.
It also makes onboarding easier.
You do not have to guess which file to run.
The script points directly to the seed workflow.
That is good repository hygiene.
It keeps the setup path short.
It also helps documentation stay honest.

## How to update seeders safely

- Keep them in sync with schema changes.
- Keep demo data realistic.
- Keep names readable.
- Keep references valid.
- Keep media URLs usable.
- Keep roles aligned with auth code.
- Keep the content broad enough for the UI.
- Keep the delete-first behavior intentional.
- Keep the seeding order stable.
- Keep the final log messages clear.

## When to rerun seeds

- After a clean install.
- After a database reset.
- After a model shape changes.
- After a test environment is rebuilt.
- After a local demo needs data.
- After a migration-like change in content shape.
- After you want to inspect admin screens quickly.
- After you want to verify auth with sample users.
- After a feature depends on existing content.
- After the app appears empty for no obvious reason.

## Summary

Seeders are one of the simplest tools in the repo, but they make the rest of the application much easier to use. They create the content that powers the public site, the admin pages, and many testing flows. If the database looks empty, the seeders are the first place to check.
