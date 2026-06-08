# Authentication, Sessions, and Roles

This document explains how the app remembers who is logged in and how it decides who is allowed to use protected features. Authentication says who the user is. Roles and permissions say what the user is allowed to do. Sessions carry that identity between requests.

## The three pieces

### Authentication

- Confirms identity.
- Answers the question: who is this?
- Usually starts with login.
- Usually ends with a session user object.
- Controls whether the browser is treated as logged in.
- Is the first step before authorization.

### Sessions

- Persist login state between requests.
- Let the server remember the user.
- Store data in MongoDB in this app.
- Survive process restarts better than memory-only sessions.
- Are read by middleware on each request.
- Are usually saved in a cookie plus a server-side store.

### Roles and permissions

- Determine allowed actions.
- Answer the question: what can this user do?
- Are useful for admin-only screens.
- Are useful for moderation tools.
- Are useful for destructive actions.
- Are easier to maintain than repeated hard-coded checks.

## Files involved

- `middleware/auth.js`
- `middleware/roles.js`
- `routes/auth.js`
- `controllers/authController.js`
- `middleware/locals.js`
- `app.js`
- `models/User.js`
- `views/partials/`
- `views/admin/`

## What the session does

- Stores the logged-in user.
- Lets the browser stay authenticated across requests.
- Enables admin checks.
- Enables user-specific page behavior.
- Lets templates render conditional links.
- Lets logout destroy the user state.
- Lets the app stay simple without JWT in every browser call.
- Makes Express sessions usable for server-rendered views.
- Works with connect-mongo.
- Makes restart behavior friendlier.

## How auth middleware usually works

- A request arrives.
- The middleware looks at `req.session.user`.
- If the user exists, the request continues.
- If the user does not exist, the middleware blocks or redirects.
- Guest middleware does the opposite.
- Guest middleware protects login and register pages from logged-in users.
- Auth middleware protects pages that require a login.
- The logic is simple because the session has already been loaded.

## How role middleware usually works

- The middleware reads the user role from the session.
- The middleware compares it to the required role.
- If the role matches, the request continues.
- If the role does not match, access is denied.
- Some helpers allow any of several roles.
- Some helpers check a specific permission string.
- The route file uses the helper instead of repeating logic.
- The controller does not need to know the full policy.

## Why roles are separated from auth

Auth answers whether the user is signed in.
Roles answer what the signed-in user may do.
That split is important.
A user can be authenticated but still not have admin rights.
A guest can be unauthenticated but still allowed to view public pages.
A manager can be authenticated with different permissions than a basic staff account.
The split keeps the policy accurate.
It also keeps the code easier to evolve.

## Common access patterns

- Guest only: login and register pages.
- Auth only: profile-like pages or user-specific actions.
- Admin only: dashboard, moderation, deletion, and sensitive CRUD.
- Permission based: specific staff task or a narrow action.
- Public: read-only pages and public submission forms.

## What to inspect when login breaks

- Check the login route.
- Check the login controller.
- Check whether the session user is written.
- Check whether the session store is connected.
- Check whether the cookie is being set.
- Check whether the redirect after login is correct.
- Check whether the middleware still thinks the user is a guest.
- Check whether the template expects a different session field.
- Check whether the auth route is mounted correctly.
- Check whether the password hash comparison is working.

## What to inspect when a user is blocked incorrectly

- Check whether the session exists.
- Check whether the user role in the session is correct.
- Check whether the middleware name matches the route use.
- Check whether the route expects admin but the user is regular staff.
- Check whether the user was seeded with the correct role.
- Check whether the current request lost its cookie.
- Check whether the route is using `requireAnyRole` or `requirePermission` unexpectedly.
- Check whether the role string changed in the database.
- Check whether a guest page is still protected by auth middleware.
- Check whether the redirect target is correct.

## Why session storage is important here

The app runs on a real server and often uses server-rendered pages.
That makes cookie-backed session state a good fit.
It also means admin pages and forms can trust the server-side state rather than asking the browser to identify itself every time.
The Mongo-backed store keeps the app scalable enough for this use case.
It is also consistent with the rest of the stack because MongoDB is already a core dependency.

## How the browser sees auth state

- The browser receives a cookie.
- The cookie identifies the session.
- The server reads the session on the next request.
- Locals middleware exposes the current user to templates.
- Templates show or hide UI pieces.
- Client scripts may still call protected APIs.
- The server still enforces the real access rules.
- UI visibility is not the same as authorization.
- Server enforcement is the source of truth.
- That is the safe way to do it.

## Why locals middleware matters

Templates need to know whether a user is logged in.
Templates may also need the user name, role, or language.
The locals middleware saves templates from repeating session checks everywhere.
It also keeps the layout partials cleaner.
It is a bridge between request state and presentation state.
It does not replace auth middleware.
It just makes rendering smarter.

## Typical role workflow in the app

1. A user logs in.
2. The session stores the user object.
3. A protected page is requested.
4. The auth middleware checks the session.
5. The role middleware checks the role.
6. The controller runs if the check passes.
7. The view or JSON response is returned.

This flow is common in the admin area.
It is also common for any staff-only API.

## Typical guest workflow in the app

1. A guest visits a login page.
2. Guest middleware sees no session user.
3. The page renders.
4. If the guest is already logged in, redirect logic may kick in.
5. The browser does not need to see a blocked page.

That behavior keeps the UI tidy.
It also prevents weird navigation loops.

## Why access control belongs in middleware

- It keeps controllers shorter.
- It keeps routes easier to read.
- It reduces duplicate checks.
- It lowers the chance of forgetting a permission check.
- It makes the policy reusable.
- It makes the policy easier to audit.
- It makes future changes safer.
- It keeps the codebase more expressive.
- It matches Express conventions well.
- It lets the app scale beyond one role.

## Password and identity notes

The repository uses bcrypt for password hashing.
That means passwords should never be stored in plain text.
Login compares the submitted password to the stored hash.
Seeded users should therefore be created carefully.
The auth controller should always be the place where password verification occurs.
The session should store only the fields needed for future requests.
The database should remain the source of user identity data.

## Security reminders

- Never trust the browser alone.
- Never rely only on hidden buttons.
- Never assume a page is safe because the UI hides it.
- Always check the server-side middleware.
- Always validate sensitive inputs.
- Always store sessions securely.
- Always keep secrets in environment variables.
- Always verify access on destructive endpoints.
- Always keep role helpers aligned with the session data shape.
- Always remember that presentation is not protection.

## Summary

Authentication, sessions, and roles are the backbone of every protected flow in the app. If they are wrong, the admin dashboard breaks, private pages leak, or users get blocked for no reason. The route layer depends on this middleware, and the templates benefit from it too. This is one of the most important parts of the whole project.
