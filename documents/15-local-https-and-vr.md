# Local HTTPS, LAN Testing, and Virtual Tour Behavior

This appendix explains the local HTTPS setup, LAN testing behavior, and the virtual-tour-related files that are a little different from the rest of the app. These areas are worth documenting because they affect how the site is tested on phones, how certificates are handled, and how immersive content is served.

## Local HTTPS behavior

- The app can run in HTTPS mode locally.
- The app expects certificate files when HTTPS is enabled.
- The app should not silently pretend HTTPS is working.
- The app reads certificate paths from the environment.
- The app uses host settings that work on a network.
- The app can be tested from another device on the same LAN.
- The app prints useful network URLs when possible.
- The app uses the same Node server code in both local and container runs.
- The certificate handling belongs in startup, not in controllers.
- The behavior is intentionally strict.

## Why LAN support matters

The museum site is not only for desktop localhost testing.
It may need to be viewed on a phone.
It may need to be shown on a tablet.
It may need to be tested in a room or on a local network.
That means the host and protocol configuration matter.
A server bound to `0.0.0.0` is easier to reach from another device.
A server with valid local HTTPS certificates is easier to test like a real deployment.
This is practical for VR and immersive pages.

## Files involved

- `app.js`
- `certs/`
- `views/virtual-tour/`
- `public/assets/vr/`
- `public/assets/audio/`
- `public/assets/videos/`
- `public/assets/images/vr-panoramas/`
- `public/javascript/virtual-tour.js`
- `public/javascript/localization.js`
- `views/partials/`

## Virtual tour content

The repository contains a virtual tour experience with several media assets.
That includes audio files.
That includes panorama images.
That includes videos.
That includes brochure-style files.
That includes possibly Google Maps or embedded location content.
That means the tour pages are more media-intensive than ordinary content pages.
It also means they deserve special testing attention.

## Why virtual-tour assets are special

- They are often large.
- They are often immersive.
- They are often reused in multiple places.
- They can create bandwidth spikes.
- They may use file paths that are not common elsewhere.
- They may include browser-specific behavior.
- They may have mobile quirks.
- They may rely on direction or locale information.
- They may have their own scripts.
- They may need extra attention on Render.

## What to inspect if the virtual tour is broken

- The file path.
- The static asset mapping.
- The template include.
- The browser console.
- The audio or video file location.
- The panorama image path.
- The language direction.
- The certificate setup.
- The host binding.
- The server logs.

## Why the app serves some files from `views/virtual-tour/`

Those files are part of the tour experience and may be linked directly.
It is unusual, but it is workable.
It helps keep the existing tour content available without moving every file immediately.
The downside is that it creates an extra place to remember when checking bandwidth and duplicates.
That is why the maintenance doc mentions duplicate media.
If the project is cleaned up later, those files may be consolidated.
For now, the docs should reflect the current structure.

## Why Google Maps embeds matter

Some tour pages may rely on embedded maps or external map content.
That means the browser may fetch content that is not purely local.
It also means the page can behave differently if external services are unavailable.
That should be remembered when debugging a tour page.
The page is not only about static assets.
It may also depend on external embedding behavior.

## Why local HTTPS is useful for VR or immersive content

- It matches more realistic deployment behavior.
- It avoids browser security surprises.
- It makes device testing easier.
- It is helpful for phone previews.
- It is useful when the browser expects secure context behavior.
- It can make future production differences smaller.
- It helps when testing embedded or media-heavy pages.
- It helps if the page uses APIs that prefer secure origins.
- It helps keep network testing honest.
- It helps the team trust local results more.

## Common local HTTPS problems

- Missing certificate files.
- Wrong certificate path.
- Wrong environment variable values.
- Host bound only to localhost.
- Browser trust warnings.
- Port conflicts.
- LAN device cannot reach the host.
- File path mismatch for special assets.
- Mixed content warnings.
- External embed not loading.

## How to debug LAN testing

1. Confirm the host is not loopback-only.
2. Confirm the port is open.
3. Confirm the cert files exist.
4. Confirm HTTPS is actually enabled.
5. Confirm the device is on the same network.
6. Confirm the browser trusts the certificate.
7. Confirm the route renders.
8. Confirm static assets load.
9. Confirm the tour script runs.
10. Confirm media files are reachable.

## Why this appendix matters

The local HTTPS and virtual tour story is easy to forget because it is not part of every feature change.
But when it matters, it matters a lot.
A phone test, a VR page, or an immersive tour can fail for reasons that do not affect the rest of the app.
Documenting that separately saves time later.
It also makes the repository feel more complete.
It is another reminder that this is a real museum experience, not just a simple CRUD app.

## Summary

The local HTTPS and virtual tour setup exists so the app can be tested more realistically and so immersive content can behave the way it should on local devices. These pages are media-heavy and network-sensitive, which makes them important to document alongside deployment and bandwidth concerns.
