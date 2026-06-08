# Localization and Language Handling

This appendix explains the app’s language behavior and how the UI changes when Arabic or English is active. The project uses server-rendered templates, client scripts, and shared helpers to keep language-aware behavior practical without making the front-end architecture complicated.

## The language system in short

- The app stores a language choice.
- Templates read the language from locals.
- Some labels are rendered directly in EJS.
- Some browser strings come from page-specific payloads.
- Some client scripts choose Arabic or English text at runtime.
- The document direction can change.
- Shared partials can react to the active language.
- The front-end should not force one direction globally.
- The UI should feel native in both languages.
- The language system should stay simple and predictable.

## Relevant files

- `middleware/locals.js`
- `utils/i18n.js`
- `public/javascript/localization.js`
- `views/partials/`
- `views/shop/`
- `views/home.ejs`
- `views/about/`
- `views/admin/`
- `app.js`

## Why this matters

A museum site often has audiences who expect language switching and right-to-left support.
That means the page direction cannot be an afterthought.
It also means buttons and labels should not be hard-coded in a way that breaks the Arabic layout.
It also means dynamic browser text should be aware of locale.
The app handles this with a relatively light system.
That is good because the site is already large enough in other ways.

## How direction is handled

- English usually uses LTR.
- Arabic usually uses RTL.
- The document direction should follow the active language.
- The body may need a language-specific class.
- A script can adjust direction after the page loads.
- Layout components should be tested in both directions.
- Cards, hero text, and buttons may move differently in RTL.
- Navbar and footer should still feel balanced.
- Direction changes should not break the page structure.
- The browser should not be forced into one layout globally.

## Why shared partials matter

The navbar and footer are reused across many pages.
If their labels are written in one place, the app stays easier to maintain.
If they are copied into every page, the app becomes fragile.
Shared partials therefore matter more than they might appear to at first glance.
They are also where language-aware UI text often shows up.
If the shared partial is wrong, many pages are wrong at once.
That makes the partials a good place to centralize localization behavior.

## Browser string handling

Some client-side scripts need text for alerts, buttons, or messages.
Those strings should not rely on one hard-coded language.
The project uses page-scoped payloads or fallback strings where needed.
That makes the browser behavior flexible.
It keeps the scripts from being tightly coupled to one visible label.
It also keeps the JavaScript easier to reuse.
That is especially useful for admin scripts and multi-language public pages.

## How the server helps

- It passes language information to the template.
- It can choose translated text directly in EJS.
- It can pick the correct navigation labels.
- It can render the correct page heading.
- It can prepare a small JSON payload for the browser.
- It can keep the first render coherent.
- It can help client scripts by supplying locale context.
- It can keep the language choice consistent across views.
- It can preserve the selected locale in cookies or locals.
- It can avoid leaving the browser to guess.

## How the client helps

The client can update direction after the page loads.
The client can adjust runtime strings.
The client can keep the page interactive.
The client can read the active language from the document.
The client can show localized alerts.
The client can react to content loaded from the server.
The client can do all of this without becoming a full app framework.
That is a practical balance for this repository.

## Typical localization pain points

- Direction switches not applying.
- Shared partials still showing English only.
- Client messages not matching the page language.
- Some headings translated while others are not.
- Layout spacing breaking in RTL.
- Form messages using the wrong direction.
- Icons or margins feeling reversed.
- Dynamic text missing a locale fallback.
- One page using a different pattern than the rest.
- Browser scripts ignoring the active language.

## What to inspect when language looks wrong

- The language cookie.
- The locals middleware.
- The template branch.
- The shared partial.
- The browser localization script.
- The page-scoped payload.
- The CSS direction rules.
- The layout wrapper.
- The admin page labels.
- The route that changes language.

## Why English fallbacks still matter

Not every dynamic string will always have a translated value.
That is normal.
The app should still show a readable fallback.
English fallbacks are useful when the UI is incomplete or when a new label has not been translated yet.
A fallback is better than an empty button or broken alert.
That keeps the app usable while translation work continues.
It also keeps development moving.

## Localization and admin pages

Admin pages also need language-aware labels.
Status badges, button text, empty states, and messages may all need translation.
A dashboard should not feel like a different application just because it is internal.
It should still respect the selected language.
That improves consistency.
It also improves accessibility and staff usability.
The admin pages should follow the same pattern as the public pages wherever possible.

## Localization and content pages

- Home page hero text may change.
- Shop headings may change.
- About page labels may change.
- Exhibit section labels may change.
- Accessibility text may change.
- Form messages may change.
- Navigation labels may change.
- Footer text may change.
- Button labels may change.
- Empty states may change.

## Summary

Localization in this app is deliberate but lightweight. The server renders most of the language-specific content, and the browser adjusts only where a dynamic message or direction change is needed. That keeps the UI readable in both Arabic and English without making the project harder to maintain.
