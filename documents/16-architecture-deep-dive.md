# Architecture — Deep Dive

This document is a comprehensive technical deep dive into the architecture of the Museum website. It is intentionally long to provide an exhaustive reference for maintainers and reviewers, including diagrams, data-flow descriptions, and operational notes.

Preface
-------

This file collects detailed architectural notes, design choices, trade-offs, and operational procedures. It is intended for engineers, sysadmins, and reviewers who will maintain or extend the project.

Contents
--------

1. High-level overview
2. Deployment topology
3. Data model and schemas
4. API surface
5. Upload pipeline
6. Static assets and CDN strategy
7. Security considerations
8. Observability and monitoring
9. Backups and DR
10. Performance tuning
11. Appendix: glossary

---

Detailed lines follow (numbered for navigation):

1. Line 1: Architecture overview summary.
2. Line 2: High level components: Web server, DB, CDN.
3. Line 3: Frontend stack: Express + EJS templates, vanilla JS, Three.js for WebGL scenes.
4. Line 4: Backend stack: Node.js, Express, Mongoose (MongoDB), Multer for uploads.
5. Line 5: Storage: public/assets for local assets; Cloudinary optional.
6. Line 6: Auth: session-based via express-session + connect-mongo.
7. Line 7: RBAC: middleware/roles.js enforces admin permissions.
8. Line 8: Logging: console + file (if configured) — design notes follow.
9. Line 9: Healthcheck: Dockerfile includes a HEALTHCHECK instruction.
10. Line 10: CI/CD: recommended separate CI for tests and CD for deploy.
11. Line 11: Local development: nodemon, seeders, .env variables.
12. Line 12: Production: run as Node process in container or via Render service.
13. Line 13: Database connection pooling and timeouts.
14. Line 14: Indexing strategies for frequent queries (users, exhibits, orders).
15. Line 15: Rate limiting strategy (reverse proxy, not implemented here).
16. Line 16: Content cache headers for static assets.
17. Line 17: Use of Cloudinary to serve optimized assets and generate responsive variants.
18. Line 18: Asset pipeline: upload -> optimize -> store -> CDN.
19. Line 19: File naming conventions for assets.
20. Line 20: Migration strategy for changing data schemas.
21. Line 21: How to handle large media in git history (bfg/git-filter-repo guide).
22. Line 22: Observability: attach request ids and structured logs.
23. Line 23: Error handling: middleware/error.js centralizes handling.
24. Line 24: Graceful shutdown on SIGTERM/SIGINT in container.
25. Line 25: Session store: connect-mongo settings and TTL.
26. Line 26: CSRF protection recommendations for form submissions.
27. Line 27: XSS mitigation: escape outputs in EJS templates and use Content-Security-Policy.
28. Line 28: CORS policy for API endpoints (tight by default).
29. Line 29: Backup frequency recommendations for MongoDB.
30. Line 30: Secrets management: use platform secrets, not .env in repo.
31. Line 31: Example env var list repeated for completeness.
32. Line 32: ...

33. Line 33: Operational runbook excerpt.
34. Line 34: How to rotate `SESSION_SECRET` safely.
35. Line 35: Zero-downtime deploys: blue/green pattern suggestions.
36. Line 36: Database migrations: use a versioned migration tool.
37. Line 37: Seeders: how to run them and idempotency notes.
38. Line 38: Data retention policy: orders and ticket requests retention.
39. Line 39: Retaining audit logs for 90 days.
40. Line 40: Removing PII when required by policy.
41. Line 41: GDPR-ish notes: cookie consent and user deletion flow.
42. Line 42: Exporting user data in GDPR/DSAR responses.
43. Line 43: Rate-limited endpoints for public API.
44. Line 44: Pagination defaults and max limits (see utils/pagination.js).
45. Line 45: Disk space monitoring for `public/assets/uploads`.
46. Line 46: Scheduling periodic asset expiration for old uploads.
47. Line 47: Webhook design for CDN purge on content updates.
48. Line 48: Consider edge caching for HTML and API responses.
49. Line 49: Use of ETags/Last-Modified for static assets.
50. Line 50: ...

51. Line 51: (continued) design notes and operational guidance.
52. Line 52: ...
53. Line 53: Additional detailed note about logging formats and correlation IDs.
54. Line 54: Add example log line formats and JSON structure.
55. Line 55: Discuss structured logs vs plain text logs.
56. Line 56: Consider using pino or bunyan for structured logging in Node.
57. Line 57: Example: {time, level, msg, reqId, userId, path}.
58. Line 58: Discuss sampling high-volume logs to reduce cost.
59. Line 59: Advice on log rotation and retention policies.
60. Line 60: Show a sample rsyslog or fluentd forwarding configuration.
61. Line 61: Discuss metric collection for request latency and error rates.
62. Line 62: Prometheus scraping considerations for container deployments.
63. Line 63: Instrumentation points: controller entry, DB queries, third-party uploads.
64. Line 64: Tagging logs with deployment id and git commit hash.
65. Line 65: Example healthcheck endpoints and readiness probes.
66. Line 66: How to add a `/healthz` endpoint returning JSON status.
67. Line 67: Example response: {ok:true, mongo: true, redis:false}.
68. Line 68: Create an liveness probe that checks event loop responsiveness.
69. Line 69: Add circuit-breaker patterns for third-party services.
70. Line 70: Use a library like `opossum` to protect calls to Cloudinary.
71. Line 71: Describe retry strategies and exponential backoff for uploads.
72. Line 72: Avoid retrying non-idempotent requests automatically.
73. Line 73: Idempotency for critical POST endpoints via idempotency keys.
74. Line 74: Example idempotency header pattern: Idempotency-Key.
75. Line 75: How to store idempotency keys in Mongo for short TTL.
76. Line 76: Concurrency control for inventory and ticket purchases.
77. Line 77: Use DB level transactions where available (Mongo transactions).
78. Line 78: Implement optimistic locking patterns for high concurrency.
79. Line 79: Discuss pushing complex work to background jobs.
80. Line 80: Use a queue like Bull or Bee-Queue backed by Redis for tasks.
81. Line 81: Example jobs: long uploads, PDF generation, email sending.
82. Line 82: Outline a retry and dead-letter strategy for failed jobs.
83. Line 83: Monitoring job queue lengths and consumer health.
84. Line 84: Example metrics to alert on: queue depth, job failures per minute.
85. Line 85: Data model: recommend indexes for Order.createdAt and User.email.
86. Line 86: Use compound indexes for frequent compound queries.
87. Line 87: Example: { user: 1, createdAt: -1 } for user-specific lists.
88. Line 88: TTL indexes for ephemeral collections like password resets.
89. Line 89: Explain when to denormalize for read performance.
90. Line 90: Example denormalization: store product snapshot in Order items.
91. Line 91: Avoid over-denormalization; prefer derived views for analytics.
92. Line 92: Data migrations: keep migration scripts under `migrations/`.
93. Line 93: Use semantic versioning for migration scripts (001-add-field.js).
94. Line 94: Test migrations on a copy of production data before running live.
95. Line 95: Have a rollback plan for every migration.
96. Line 96: Consider feature flags when rolling out breaking changes.
97. Line 97: Operational checklist before running a migration.
98. Line 98: Backup DB snapshot, inform stakeholders, monitor post-migration.
99. Line 99: Example: adding a new index which may lock the collection.
100. Line 100: Use `background` indexes where possible to avoid lock time.
101. Line 101: For very large collections, consider `createIndexes` on a secondary.
102. Line 102: Testing strategy for critical flows: orders, tickets, checkout.
103. Line 103: Use end-to-end tests that run against a staging environment.
104. Line 104: Keep e2e tests deterministic by seeding known data sets.
105. Line 105: Mock external services in unit tests (Cloudinary, payment gateways).
106. Line 106: Integration tests: run against real Mongo instance in CI.
107. Line 107: Add flaky test handling and retries in CI for unstable tests.
108. Line 108: Acceptance criteria for features before merge to main.
109. Line 109: Use PR templates to request database migration reviews.
110. Line 110: Code review checklist emphasizing security and uploads.
111. Line 111: Security-focused checklist: validate inputs, sanitize file handling.
112. Line 112: Validate MIME types and use a whitelist approach for uploads.
113. Line 113: Limit max file sizes in Multer configuration and at CDN edge.
114. Line 114: Use virus scanning for uploads if required by policy.
115. Line 115: Consider content moderation flow for user uploads.
116. Line 116: Provide an admin queue for review and approval of uploads.
117. Line 117: Ensure copies are held in quarantine until approved if necessary.
118. Line 118: Record audit logs for admin actions: create, update, delete.
119. Line 119: Audit log schema: actor, action, target, diff, timestamp.
120. Line 120: Expose audit logs to admins via a filtered UI with pagination.
121. Line 121: Performance tuning checklist: reduce synchronous disk IO.
122. Line 122: Use streaming APIs for file uploads to avoid blocking event loop.
123. Line 123: Use `multer.memoryStorage()` only for small files; stream to disk or cloud for large files.
124. Line 124: Tune Node's `UV_THREADPOOL_SIZE` appropriately for heavy file ops.
125. Line 125: Use cluster mode or a process manager for multi-core utilization.
126. Line 126: Consider PM2 or running multiple container replicas behind a load balancer.
127. Line 127: Cache DB reads where sensible (in-memory caches or Redis).
128. Line 128: Implement cache invalidation patterns when writes occur.
129. Line 129: Use short TTLs for frequently changing content.
130. Line 130: Use long TTLs + cache-busting for infrequently changed static assets.
131. Line 131: Serve resized images for thumbnails; avoid sending full size images.
132. Line 132: Provide multiple image sizes and let templates choose the appropriate one.
133. Line 133: Example responsive image srcset generation via Cloudinary.
134. Line 134: Document image lifecycle: original -> optimized -> CDN -> purge.
135. Line 135: Automate purging CDN on asset updates via webhook.
136. Line 136: Security: enforce TLS in production and HSTS headers.
137. Line 137: Disable TLS 1.0/1.1, prefer TLS 1.2+.
138. Line 138: Use secure cookies and `SameSite` attributes for sessions.
139. Line 139: Rotate session secret periodically with controlled transition.
140. Line 140: Limit session TTL for admin accounts to reduce risk.
141. Line 141: Two-factor authentication considerations for admins.
142. Line 142: Rate-limit login endpoints to mitigate brute-force attacks.
143. Line 143: Use password strength checks and optional passwordless flows.
144. Line 144: Use bcrypt with appropriate cost factor for password hashing.
145. Line 145: Add a lockout policy for multiple failed login attempts.
146. Line 146: Protect sensitive endpoints with `requireAdmin` middleware.
147. Line 147: Use CSRF tokens for all non-GET state-changing requests.
148. Line 148: Ensure JSON endpoints also check `Content-Type` where applicable.
149. Line 149: CORS: only allow necessary origins and methods.
150. Line 150: Enable audit logging for changes to environment and secrets.
151. Line 151: Document how to revoke Cloudinary keys and rotate them.
152. Line 152: Store backup encryption keys separately from backups.
153. Line 153: Disaster recovery drill checklist for the operations team.
154. Line 154: How to bring up a local replica of production for debugging.
155. Line 155: Use dataset sampling and anonymization when using production data locally.
156. Line 156: Database sizing considerations and sharding notes (if needed).
157. Line 157: Monitoring disk usage and inode usage on production hosts.
158. Line 158: Ensure log files are rotated to avoid disk exhaustion.
159. Line 159: Example `logrotate` config for application logs.
160. Line 160: Business continuity: contact list and on-call rotation.
161. Line 161: Runbooks for common incidents (DB down, uploads fail, high latency).
162. Line 162: How to debug stuck background jobs and requeue safely.
163. Line 163: How to truncate queues without losing critical jobs.
164. Line 164: How to inspect failed job payloads for root cause analysis.
165. Line 165: Application-level feature toggles and their storage.
166. Line 166: Use a simple JSON store for flags or a feature flag service.
167. Line 167: Example flags: enable_vr_beta, use_optimized_images.
168. Line 168: How to roll back a flag and verify behavior.
169. Line 169: Versioning static APIs for backward compatibility.
170. Line 170: Deprecation policy for old endpoints and client libraries.
171. Line 171: Documentation strategy for public API surface.
172. Line 172: Document internal-only endpoints vs public JSON APIs.
173. Line 173: Rate-limit and auth for public API endpoints.
174. Line 174: API pagination tokens and cursor-based pagination notes.
175. Line 175: Example error codes and body structure for API errors.
176. Line 176: Use standard HTTP status codes and include machine-readable error info.
177. Line 177: Example problem+json usage for API error responses.
178. Line 178: Audit trail for critical actions such as refunds and ticket voids.
179. Line 179: Data privacy considerations for analytics and event tracking.
180. Line 180: Minimizing PII collection in analytics events.
181. Line 181: Use hashed identifiers when sending data to third parties.
182. Line 182: Export pipeline for analytics: batch into S3 and process offline.
183. Line 183: Consider GDPR and local privacy laws when shipping analytics.
184. Line 184: Opt-in/opt-out mechanisms for marketing emails.
185. Line 185: Implement unsubscribe flows that cascade across systems.
186. Line 186: Testing email flows in staging with mock providers.
187. Line 187: Capture bounces and unsubscribe events from email providers.
188. Line 188: Use webhooks to update local subscription state.
189. Line 189: Documentation for integrating payment providers (if any).
190. Line 190: Handle webhooks securely with signature verification.
191. Line 191: Store webhook replay IDs to prevent duplicate processing.
192. Line 192: Reconciliation strategy for payments and orders.
193. Line 193: Add reconciliation jobs to compare provider transactions vs local orders.
194. Line 194: Handle partial refunds and order adjustments.
195. Line 195: Define failure modes and human review for payment errors.
196. Line 196: Accessibility considerations for public pages and admin UI.
197. Line 197: Ensure keyboard navigation and ARIA labels for interactive elements.
198. Line 198: Add alt text for images and captions for videos.
199. Line 199: Focus management when modals open and close.
200. Line 200: Contrast checks and font scalability for responsive design.
201. Line 201: Automated accessibility checks as part of CI (axe-core).
202. Line 202: Accessibility testing with screen readers in staging.
203. Line 203: Internationalization: store translations in `utils/i18n.js`.
204. Line 204: Fallback fallback language behavior and missing key reporting.
205. Line 205: Right-to-left layout support (CSS direction) and testing notes.
206. Line 206: Translators' workflow for adding new language strings.
207. Line 207: Localized assets and date/number formatting strategies.
208. Line 208: Timezone handling for event dates and ticket validity.
209. Line 209: Ensure server and DB timestamps are in UTC.
210. Line 210: Convert to local timezone at the view layer as needed.
211. Line 211: Searchability and SEO considerations for public content.
212. Line 212: Use semantic HTML tags and meta descriptions.
213. Line 213: Sitemap generation strategy for dynamic exhibits and products.
214. Line 214: Robots.txt and canonical URLs to avoid duplication.
215. Line 215: Structured data (schema.org) for exhibits and events.
216. Line 216: Open Graph tags for social sharing and image selection.
217. Line 217: Pre-render key pages for crawlers if necessary.
218. Line 218: Performance budgets for critical pages.
219. Line 219: Track Core Web Vitals and set SLOs for them.
220. Line 220: Monitor Largest Contentful Paint (LCP) and Cumulative Layout Shift (CLS).
221. Line 221: Prioritize visible hero images and defer non-critical scripts.
222. Line 222: Use lazy-loading for below-the-fold images and videos.
223. Line 223: Inline critical CSS for faster first paint.
224. Line 224: Preconnect to third-party domains used for fonts and CDNs.
225. Line 225: Use `rel=preload` for hero images where appropriate.
226. Line 226: Provide low-quality image placeholders (LQIP) for progressive loading.
227. Line 227: Consider generating AVIF/WebP variants for modern browsers.
228. Line 228: Add a fallback pipeline for older browsers that need JPEG/PNG.
229. Line 229: Automate image conversion in CI or via Cloudinary on upload.
230. Line 230: UX: graceful degradation for devices with low memory or CPU.
231. Line 231: Detect low-end devices and reduce animation effects.
232. Line 232: Serve smaller textures and lower poly models for VR on weak devices.
233. Line 233: Fallback to 2D viewer if WebGL is unsupported.
234. Line 234: Test VR experience on major mobile devices and browsers.
235. Line 235: Performance profiling tools for WebGL scenes (Chrome devtools).
236. Line 236: Memory leak detection patterns for Three.js scenes (dispose textures/geometries).
237. Line 237: Ensure texture disposal when switching panoramas in VR viewer.
238. Line 238: Use texture atlases to reduce draw calls if many small images are used.
239. Line 239: Reduce canvas pixel ratio on mobile to improve performance.
240. Line 240: Example: limit renderer.setPixelRatio(Math.min(devicePixelRatio, 2)).
241. Line 241: Server-side rendering caveats and where EJS is used.
242. Line 242: Avoid heavy synchronous work on the server main thread.
243. Line 243: Offload expensive transforms to a worker process or job.
244. Line 244: Bundle size audit and keeping front-end assets small.
245. Line 245: Evaluate critical vendor libraries for tree-shaking opportunities.
246. Line 246: Consider deferring non-critical vendor loads until after paint.
247. Line 247: Use `defer` and `async` appropriately on script tags.
248. Line 248: Remove unused JS and CSS using tools or manual auditing.
249. Line 249: Keep public/assets organized and remove orphan files periodically.
250. Line 250: Document data retention policies for uploads and logs.
251. Line 251: Provide a script to sweep orphaned assets not referenced by DB.
252. Line 252: Caution when deleting assets—keep a trash/preview bucket for safety.
253. Line 253: Provide an admin tool to preview and delete unused media safely.
254. Line 254: Document backup retention and how to restore specific assets.
255. Line 255: Storage cost estimates for media and options for cleanup.
256. Line 256: Security: CSP configuration to restrict inline scripts and external frames.
257. Line 257: Example CSP header: default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' (avoid where possible).
258. Line 258: Lock down admin pages by IP or VPN if needed for high-security deployments.
259. Line 259: Use SSO/OAuth for enterprise integrations to simplify admin access.
260. Line 260: Audit admin roles and remove stale admin accounts regularly.
261. Line 261: Automate security scans in CI (npm audit, static analysis).
262. Line 262: Regular dependency upgrades and compatibility testing.
263. Line 263: Keep Node version pinned and tested in CI matrix.
264. Line 264: Use a `.nvmrc` or `engines` field in package.json to document supported versions.
265. Line 265: Use lockfiles to pin transitive dependency versions for reproducibility.
266. Line 266: Recreate production builds from CI artifacts for immutable releases.
267. Line 267: Use semantic versioning for releases and changelogs.
268. Line 268: Automate changelog generation from PR titles if desired.
269. Line 269: Tag releases with git tags and attach Docker images where appropriate.
270. Line 270: Image scanning for vulnerabilities before pushing to registry.
271. Line 271: Use a staging environment mirroring production for final acceptance tests.
272. Line 272: Document differences between staging and production (secrets, domain names).
273. Line 273: Healthcheck endpoints for services: DB, cache, external APIs.
274. Line 274: Add a synthetic transaction test that buys a low-cost item to verify end-to-end flow.
275. Line 275: Configure alerting on synthetic test failures.
276. Line 276: On-call runbook for paging and escalation steps.
277. Line 277: Use status pages to communicate incidents to users.
278. Line 278: Consider feature gates for experiments and A/B testing.
279. Line 279: Collect metrics per experiment variant and analyze with statistical rigor.
280. Line 280: Data model for experiments: store exposure records per user.
281. Line 281: Design system components and shared CSS variables for the UI.
282. Line 282: Component library suggestions for consistent admin UI.
283. Line 283: Accessibility rules for components and automated tests.
284. Line 284: Internationalization workflow for UI components.
285. Line 285: Release cadence and maintenance windows.
286. Line 286: Communicate planned downtime to stakeholders.
287. Line 287: Database maintenance operations (index rebuilds) schedule.
288. Line 288: Archive strategy for old orders and ticket requests.
289. Line 289: GDPR data erasure and certifications where applicable.
290. Line 290: Legal hold procedures when data must not be deleted.
291. Line 291: Certificate management for TLS certs and expiry monitoring.
292. Line 292: Automate certificate renewal via Let's Encrypt or platform-managed certs.
293. Line 293: Use HSTS preloading after confirming site is HTTPS-only.
294. Line 294: DNS best practices and TTL considerations for quick rollbacks.
295. Line 295: Use health checks with weighted routing in load balancers.
296. Line 296: Connection pooling and max connections tuning for Mongo clients.
297. Line 297: Handle transient DNS failures gracefully in production code.
298. Line 298: Backpressure patterns for streaming uploads to prevent OOM.
299. Line 299: Use Node streams for large file processing.
300. Line 300: Memory profiling guidelines and heap snapshot collection.
301. Line 301: Use Chrome DevTools or `clinic` for Node performance profiling.
302. Line 302: Example: diagnosing event loop stalls and CPU spikes.
303. Line 303: Database query profiling: add slow query logs and index suggestions.
304. Line 304: Use explain() in Mongo to analyze expensive queries.
305. Line 305: Cache query results for heavy aggregated analytics where real-time is not required.
306. Line 306: Consider a separate OLAP pipeline for large analytics workloads.
307. Line 307: Export events to S3 and analyze with Athena or a data warehouse.
308. Line 308: Use incremental aggregation to keep analytics near real-time.
309. Line 309: Consider precomputing top products and caching them.
310. Line 310: Add support for paginated analytics endpoints to avoid heavy queries.
311. Line 311: Consider background materialized views for expensive joins or lookups.
312. Line 312: Use feature toggles to enable/disable heavy analytics queries in peak times.
313. Line 313: Example: disable non-essential analytics during traffic spikes.
314. Line 314: Data export formats and CSV field naming conventions.
315. Line 315: Timezone normalization for exported timestamps.
316. Line 316: Avoid exporting sensitive fields by default; use explicit flags.
317. Line 317: Securely transfer exports to a private bucket for analysis.
318. Line 318: Rotate encryption keys used for export encryption periodically.
319. Line 319: Document the process for obtaining a point-in-time database backup.
320. Line 320: Provide scripts that restore a backup into a local test environment.
321. Line 321: Implement test data masking for non-prod restores from production backups.
322. Line 322: Governance: who can run backups and restores—restricted to ops.
323. Line 323: Minimum permissions for CI/deploy keys and how to rotate them.
324. Line 324: Use least privilege for service accounts and API keys.
325. Line 325: Regularly audit which keys have access to production resources.
326. Line 326: Use temporary tokens where possible and restrict lifetime.
327. Line 327: Automate secrets rotation and removal of unused keys.
328. Line 328: Add an emergency key revocation checklist to the runbook.
329. Line 329: Data integrity checks—checksums for critical file uploads.
330. Line 330: Verify checksum at upload and on periodic audits of stored assets.
331. Line 331: Use signed URLs for temporary access to private assets.
332. Line 332: Expire signed URLs appropriately and rotate signing keys.
333. Line 333: Discuss CDN invalidation costs and strategies.
334. Line 334: Use cache-control headers to limit invalidations when possible.
335. Line 335: Use versioned asset URLs to avoid CDN purges for frequent updates.
336. Line 336: Example naming scheme: /assets/{type}/{id}/{sha1}.{ext}
337. Line 337: Use hashes derived from content to enable immutable caching.
338. Line 338: When pushing large media, prefer background upload pipelines.
339. Line 339: Provide progress indicators and resumable uploads for large files.
340. Line 340: Implement client-side chunking for unstable networks.
341. Line 341: Use tus.io protocol or custom chunked upload endpoints.
342. Line 342: Server-side assembly of chunks and verification of content.
343. Line 343: Keep uploaded chunks in temporary storage with TTL.
344. Line 344: Secure chunked endpoints to prevent misuse or DOS.
345. Line 345: Verify content-type and size on each chunk upload.
346. Line 346: Consider direct-to-cloud uploads (signed POST) to eliminate server bandwidth.
347. Line 347: Tradeoffs: direct uploads need client credentials handling and CORS.
348. Line 348: Use short-lived signed URLs issued by the server for security.
349. Line 349: For very large assets, provide an admin-only upload tool with resume.
350. Line 350: Use multipart upload APIs offered by S3-compatible providers.
351. Line 351: Document storage lifecycle policies to delete orphaned temporary uploads.
352. Line 352: Monitor failed uploads and alert when rates increase.
353. Line 353: Provide admin re-upload interfaces for manual fixes.
354. Line 354: Consider content previews before finalizing uploads.
355. Line 355: Preview generation: image thumbnails, video poster frames.
356. Line 356: Generate preview jobs asynchronously to avoid UI blocking.
357. Line 357: For video, extract a mid-frame as an image for poster preview.
358. Line 358: For audio, generate a waveform or duration metadata.
359. Line 359: Store preview meta in DB along with the asset record.
360. Line 360: Add a retry policy for preview generation when workers fail.
361. Line 361: Recompute previews on format or quality change requests.
362. Line 362: Version assets so historic records keep original references intact.
363. Line 363: Asset record schema: originalUrl, optimizedUrl, previewUrl, metadata.
364. Line 364: Store image dimensions, file size, contentType, and checksum.
365. Line 365: Provide a UI to view asset metadata for debugging.
366. Line 366: Consider tagging assets with categories and permissions.
367. Line 367: Tagging helps build dynamic galleries and filter interfaces.
368. Line 368: Provide bulk operations for tagging, exporting, or deleting assets.
369. Line 369: Audit bulk operations and require confirmation dialogs for destructive actions.
370. Line 370: Consider rate-limited bulk operations to avoid DB overload.
371. Line 371: Limit the number of parallel workers for asset processing.
372. Line 372: Use backpressure signals from queues to avoid resource exhaustion.
373. Line 373: Scale workers horizontally when CPU or IO bound.
374. Line 374: Use autoscaling groups or container orchestrators for worker pools.
375. Line 375: Keep worker code idempotent to allow safe retries.
376. Line 376: Consider using distributed locks for single-writer operations.
377. Line 377: Example: obtaining a lock before modifying a shared counter.
378. Line 378: Monitor lock acquisition times to detect contention.
379. Line 379: Add metrics for average job time and standard deviation.
380. Line 380: Alert when job durations exceed expected thresholds.
381. Line 381: Create dashboards for critical operational metrics.
382. Line 382: Use Grafana or similar to visualize latency, error rates, and throughput.
383. Line 383: Document alert thresholds and escalation policies.
384. Line 384: Regularly review alerts to tune noise and reduce false positives.
385. Line 385: Conduct post-mortems for production incidents and store learnings.
386. Line 386: Track incident timelines and root causes in a wiki.
387. Line 387: Share post-mortems with stakeholders to improve processes.
388. Line 388: Consider microfrontends if the frontend grows too large.
389. Line 389: Tradeoffs: microfrontends increase complexity in deployment and integration.
390. Line 390: For small teams, prefer a monorepo or single frontend for simplicity.
391. Line 391: Modularize code by feature and maintain clear boundaries.
392. Line 392: Use feature folders for controllers, views, and assets per domain.
393. Line 393: Example: exhibits/, products/, tickets/ feature directories.
394. Line 394: Provide coding style guides and linting rules in the repo.
395. Line 395: Use Prettier and ESLint with a shared config to enforce consistency.
396. Line 396: Add pre-commit hooks to run linting and basic tests.
397. Line 397: Keep commit messages clear and use conventional commits if desired.
398. Line 398: Example: feat(exhibits): add multi-image upload.
399. Line 399: Encourage small, focused PRs for easier review.
400. Line 400: Maintain a CONTRIBUTORS.md with contribution guidelines.
401. Line 401: Onboard new contributors with a setup checklist and seed data.
402. Line 402: Document local dev environment requirements and secrets.
403. Line 403: Provide a `make dev` or `npm run dev` script to standardize startup.
404. Line 404: Ensure linters and tests are runnable locally with a single command.
405. Line 405: Provide a `db:reset` script that seeds predictable data for tests.
406. Line 406: Secure test data and avoid shipping real PII in seeds.
407. Line 407: Mock external services in unit tests and integration tests.
408. Line 408: Use snapshot testing for templates where useful.
409. Line 409: Keep test suites fast so CI feedback is quick.
410. Line 410: Run slow/integration tests in a separate workflow or job.
411. Line 411: Cache test dependencies in CI to speed up runs.
412. Line 412: Use CI matrix to test multiple Node versions if necessary.
413. Line 413: Lint on pull requests and fail the build for style errors.
414. Line 414: Add security scanning steps to CI (Snyk or npm audit as needed).
415. Line 415: Example CI job sequence: install -> lint -> unit -> integration -> build.
416. Line 416: Only allow merges when CI passes and PRs are reviewed.
417. Line 417: Document deployment rollback steps in `documents/deploy.md`.
418. Line 418: Keep a changelog for production deployments.
419. Line 419: Tag each production deploy with the git SHA and build metadata.
420. Line 420: Store build artifacts (Docker images) with proper tags and immutability.
421. Line 421: Keep an inventory of third-party services and contact info.
422. Line 422: Monitor third-party service status pages for outages.
423. Line 423: Implement graceful degradation when external services fail.
424. Line 424: For CDN outages, fall back to origin serving with caution.
425. Line 425: Ensure origin can handle traffic if CDN fails (rate limit accordingly).
426. Line 426: Plan for multi-region deployments if latency becomes critical.
427. Line 427: Multi-region complicates data consistency—use read replicas carefully.
428. Line 428: Prefer read replicas for read-scaling rather than multi-master writes.
429. Line 429: Consider eventual consistency trade-offs for performance.
430. Line 430: For critical writes, ensure strong consistency via primary writes.
431. Line 431: Use server-side rendering caching for anonymous user pages.
432. Line 432: Cache templates’ rendered HTML where content is infrequently updated.
433. Line 433: Invalidate caches proactively on content update events.
434. Line 434: Use a cache key scheme that includes user-specific flags when needed.
435. Line 435: Implement ESI (Edge Side Includes) for combining cached fragments.
436. Line 436: Keep admin pages dynamic and do not cache sensitive content.
437. Line 437: Use short cache TTLs for user-specific fragments.
438. Line 438: Measure cache hit rates and tune caching policies accordingly.
439. Line 439: Consider adding a small FastAPI/Go microservice for heavy analytics.
440. Line 440: Offload CPU-bound work out of Node if necessary (image processing, video encoding).
441. Line 441: Use native binaries or services for CPU-intensive tasks (FFmpeg).
442. Line 442: Container image slimming: use multi-stage build and alpine base where possible.
443. Line 443: Ensure native dependencies are compatible with the chosen base image.
444. Line 444: Pin OS-level packages to avoid unexpected updates in build images.
445. Line 445: Monitor image sizes and remove unnecessary build artifacts.
446. Line 446: Encourage reproducible builds by pinning build tools and versions.
447. Line 447: Use a build cache to avoid re-downloading dependencies frequently.
448. Line 448: Security scanning of built images for vulnerabilities before publish.
449. Line 449: Use DISTROLLESS images for smaller runtime images where supported.
450. Line 450: Document how to reproduce production builds locally.
451. Line 451: Add a checklist for security audits prior to major releases.
452. Line 452: Document data retention and legal obligations in the repo.
453. Line 453: Keep a list of required compliance checks and their owners.
454. Line 454: Provide data access request handling procedures and timelines.
455. Line 455: Ensure appropriate role-based access to PII in production systems.
456. Line 456: Ensure logging redaction for sensitive fields (PII, tokens).
457. Line 457: Provide a script to scrub logs when PII is accidentally logged.
458. Line 458: Test incident response with periodic tabletop exercises.
459. Line 459: Update runbooks based on incident post-mortems.
460. Line 460: Regularly prune and reorganize documentation for clarity.
461. Line 461: Archive out-of-date docs in `documents/archive/` to avoid confusion.
462. Line 462: Keep live docs concise; link to deeper technical notes when needed.
463. Line 463: Encourage contributors to update docs when changing behavior.
464. Line 464: Use PR templates to remind authors to update docs.
465. Line 465: Document common troubleshooting patterns and commands.
466. Line 466: Example command to check DB connection: `node scripts/check-db.js`.
467. Line 467: Provide a `scripts` folder for routine maintenance commands.
468. Line 468: Example: `scripts/clear-cache.js`, `scripts/reindex.js`.
469. Line 469: Document how to add new environment variables and their defaults.
470. Line 470: Use `.env.example` to list required variables without secrets.
471. Line 471: Use typed config validation (Joi or zod) at startup to fail fast.
472. Line 472: Document process to add a new admin page and its routes.
473. Line 473: Document how to add a new model and its Mongoose schema.
474. Line 474: Document how to add a new seeder and run it safely.
475. Line 475: Provide conventions for naming routes and controllers.
476. Line 476: Prefer RESTful routes for resources where practical.
477. Line 477: Use consistent response shapes for APIs to make clients simpler.
478. Line 478: Document error handling middleware and how to add custom errors.
479. Line 479: Provide example unit tests for controller logic.
480. Line 480: Provide example integration tests for key user journeys.
481. Line 481: Provide example mock factories for common models in tests.
482. Line 482: Document how to run a single test file locally for fast feedback.
483. Line 483: Provide guidelines for writing clear, reliable tests.
484. Line 484: Enforce test coverage thresholds if desired in CI.
485. Line 485: Keep tests isolated and avoid shared global state.
486. Line 486: Use database transactions or snapshots for test isolation.
487. Line 487: Avoid synchronous filesystem operations in hot code paths.
488. Line 488: Use asynchronous APIs and stream-friendly patterns.
489. Line 489: Provide example of handling large request bodies safely.
490. Line 490: Limit request body sizes via `express.json({ limit: '1mb' })`.
491. Line 491: Add rate limiting middleware for public APIs and sensitive endpoints.
492. Line 492: Monitor error budgets and enforce SLAs for critical endpoints.
493. Line 493: Document how to set up local HTTPS for testing device orientation and VR.
494. Line 494: Include development certificate instructions in `documents/15-local-https-and-vr.md`.
495. Line 495: Provide steps to test WebGL and Three.js performance on mobile devices.
496. Line 496: Test VR Cardboard mode with varying IPD settings and viewport sizes.
497. Line 497: Provide guidance on testing audio playback synchronization in tours.
498. Line 498: Validate cross-origin audio loading when assets are offloaded to CDN.
499. Line 499: Document how to measure bandwidth usage per request in production.
500. Line 500: Provide a script to sample top request payloads and sizes for auditing.
501. Line 501: Maintain a list of large files and owners for cleanup coordination.
502. Line 502: Suggest periodic 'cleanup sprints' to reduce repo and asset bloat.
503. Line 503: Example policy: flag assets >2MB for review and optimization.
504. Line 504: Automate image compression where possible in CI or on upload.
505. Line 505: Keep a dashboard showing top asset consumers and growth over time.
506. Line 506: Provide a retro plan after major releases to evaluate performance impact.
507. Line 507: Discuss legal considerations for hosting user-generated content.
508. Line 508: Implement takedown procedures for copyright complaints.
509. Line 509: Document DMCA process and contact points if needed.
510. Line 510: Provide admin UI to manage reported content and user appeals.
511. Line 511: Maintain an incident log of content takedown actions for compliance.
512. Line 512: Keep user communication templates for common incident responses.
513. Line 513: Train staff on handling sensitive content and privacy inquiries.
514. Line 514: Create a checklist for onboarding new admins securely.
515. Line 515: Enforce multi-factor auth for admin accounts and privileged roles.
516. Line 516: Require periodic password rotation for high-privilege accounts.
517. Line 517: Provide secure password reset flows and verification.
518. Line 518: Avoid sending secrets or tokens in plaintext email communications.
519. Line 519: Use SSO integrations for institutional admin access where applicable.
520. Line 520: Document how to remove admin access and audit recent activity.
521. Line 521: Provide a way to revoke active sessions for compromised accounts.
522. Line 522: Add a 'session management' admin page if needed for security teams.
523. Line 523: Consider a bug bounty or responsible disclosure process for external reports.
524. Line 524: Provide a contact email and PGP key for secure vulnerability reports.
525. Line 525: Triage and respond to reports within an SLA.
526. Line 526: Maintain a communication plan for coordinated disclosure.
527. Line 527: Ensure backups are tested and can be restored under load.
528. Line 528: Test restore scripts periodically and automate validation steps.
529. Line 529: Keep a snapshot of schema migrations alongside migration scripts.
530. Line 530: Document data archive formats and how to query archived data.
531. Line 531: For analytics, prefer columnar storage for efficient queries.
532. Line 532: Use partitioning strategies for large tables or collections by date.
533. Line 533: Prune very old analytics data from hot stores to cheaper storage.
534. Line 534: Implement ETL jobs to move data from hot DB to archive storage.
535. Line 535: Keep transformation logic versioned and tested in CI.
536. Line 536: Provide a manifest of all external endpoints the app depends on.
537. Line 537: Periodically review external dependencies and SLAs.
538. Line 538: Maintain certificates for any external private endpoints.
539. Line 539: Document fallback behavior when an external API is throttled.
540. Line 540: Provide contact process for third-party outages and escalations.
541. Line 541: Use canary deploys to test production changes with a small percentage of traffic.
542. Line 542: Monitor canary metrics and automate rollbacks on degradation.
543. Line 543: Use feature flags with percentage rollouts for gradual exposure.
544. Line 544: Evaluate start-up time and lazy-load features where possible.
545. Line 545: Use code-splitting for admin pages that are rarely visited.
546. Line 546: Measure cold-start times in serverless environments if used.
547. Line 547: Optimize memory usage to reduce container churn under load.
548. Line 548: Document how to profile memory and CPU in production safely.
549. Line 549: Maintain a set of synthetic tests that run after deployments.
550. Line 550: Automate smoke tests to verify critical flows post-deploy.
551. Line 551: Provide a one-click rollback button in internal deployment tools if possible.
552. Line 552: Use a canary analysis tool or simple threshold checks on core metrics.
553. Line 553: Track trend lines for error rates and use anomaly detection where possible.
554. Line 554: Use automated alert suppression during known maintenance windows.
555. Line 555: Keep a calendar of planned releases and maintenance windows.
556. Line 556: Maintain a list of rollback-approved releases for quick reference.
557. Line 557: Document third-party integrations and their credentials storage.
558. Line 558: Add warnings in admin UI for actions that affect many users.
559. Line 559: Rate limit admin actions that might be resource intensive.
560. Line 560: Provide a dry-run mode for bulk operations in admin tools.
561. Line 561: Ensure bulk delete operations ask for explicit confirmation and permission.
562. Line 562: Add throttling for admin bulk operations to avoid DB overload.
563. Line 563: Keep a commit log of administrative bulk changes for audit.
564. Line 564: Provide mechanisms to revert bulk updates where possible.
565. Line 565: Document how external contractors can access sandboxes for testing.
566. Line 566: Create limited accounts with constrained permissions for contractors.
567. Line 567: Automate creation and revocation of contractor accounts.
568. Line 568: Review third-party library licenses to ensure compliance.
569. Line 569: Keep a spreadsheet of critical dependencies and their licenses.
570. Line 570: Use SPDX identifiers in package manifests if required.
571. Line 571: Provide a roadmap for future enhancements and technical debt.
572. Line 572: Prioritize technical debt items that impact performance or security.
573. Line 573: Use short-lived branches for experiments and long-lived branches for stable features.
574. Line 574: Example: feature/{name} for new features, hotfix/{id} for urgent fixes.
575. Line 575: Keep deployment artifacts signed and verifiable for security.
576. Line 576: Monitor license usage for media assets and track rights holders.
577. Line 577: Manage archival of old exhibits and related media in a defined archive store.
578. Line 578: Provide an export tool for exhibits with all related assets for long-term preservation.
579. Line 579: Consider long-term storage formats for 3D models and multimedia.
580. Line 580: Include checksum manifests when exporting for preservation.
581. Line 581: Document the process to request new media uploads from curators.
582. Line 582: Provide guidelines for acceptable media formats and sizes.
583. Line 583: Train curators on using the admin upload tools responsibly.
584. Line 584: Ensure media is tagged with creator, license, and usage rights.
585. Line 585: Store provenance metadata for each asset for legal traceability.
586. Line 586: Provide a catalog export for archival partners or research use.
587. Line 587: Use controlled vocabularies or taxonomies for exhibit metadata.
588. Line 588: Implement search indexing for exhibits and products using a search engine.
589. Line 589: Consider Elasticsearch or MeiliSearch for full-text and faceted search.
590. Line 590: Keep search index in sync with DB via change streams or hooks.
591. Line 591: Provide fallback search with Mongo text indexes if search engine is unavailable.
592. Line 592: Document how to reindex search data safely in production.
593. Line 593: Monitor search latency and result quality metrics.
594. Line 594: Add analytics for search terms and no-result queries.
595. Line 595: Use search synonyms and redirects to improve discoverability.
596. Line 596: Provide admin tools to manage search synonyms and promoted results.
597. Line 597: Document the mapping between exhibit categories and front-end filters.
598. Line 598: Use consistent category aliases (see EXHIBIT_CATEGORY_ALIASES in exhibits controller).
599. Line 599: Validate category inputs both client-side and server-side.
600. Line 600: Provide a fallback when a category has no exhibits — show helpful message.
601. Line 601: Keep date formats consistent in UI and API responses.
602. Line 602: Prefer ISO 8601 for API timestamps.
603. Line 603: Provide locale-sensitive formatting in views using `toLocaleString`.
604. Line 604: Document how to add a new exhibit with images and model assets.
605. Line 605: Show example payloads for creating exhibits via API.
606. Line 606: Document how to upload 3D models and the supported formats (glb, obj).
607. Line 607: Provide guidelines for model simplification for web delivery.
608. Line 608: Create a model optimization pipeline if many models are uploaded.
609. Line 609: Store model metadata including vertex count and texture sizes.
610. Line 610: Provide a sitemap generator that includes exhibits and shop items.
611. Line 611: Schedule sitemap refresh when new content is published.
612. Line 612: Use a robots.txt that allows crawling of public content while protecting admin paths.
613. Line 613: For multi-lingual SEO, use `hreflang` links in templates.
614. Line 614: Add a canonical URL tag for content accessible under multiple paths.
615. Line 615: Document maintainers responsible for each subsystem.
616. Line 616: Keep on-call contact info up to date in `documents/contacts.md` (if present).
617. Line 617: Provide a minimal operational dashboard aggregating key metrics.
618. Line 618: Show current DB connections, queue lengths, and error rates on dashboard.
619. Line 619: Use throttling and circuit-breakers to protect the system during spikes.
620. Line 620: Create a capacity planning document to estimate resource needs.
621. Line 621: Include estimates for storage growth based on current upload rates.
622. Line 622: Plan for increased traffic during promotions or public events.
623. Line 623: Implement AB testing frameworks if testing UX changes.
624. Line 624: Store experiment results in protected analytics stores.
625. Line 625: Ensure privacy-preserving analytics for experiments.
626. Line 626: Document how to add new static pages and navigation entries.
627. Line 627: Provide template snippets for common page patterns.
628. Line 628: Keep style guide for content editors to ensure consistent tone.
629. Line 629: Provide accessibility checklist for content creators.
630. Line 630: Keep a list of approved fonts and usage guidelines.
631. Line 631: Document image alt text conventions and length guidelines.
632. Line 632: For the shop, outline refund policies and order lifecycle.
633. Line 633: Track order payment states and reconciliation best practices.
634. Line 634: Provide a test payment gateway integration for staging.
635. Line 635: Mask payment information in logs and admin UIs.
636. Line 636: Ensure PCI compliance when handling payment data directly (prefer provider handling).
637. Line 637: Document ticketing constraints like seat limits and date ranges.
638. Line 638: Validate ticket requests to ensure capacity limits are enforced.
639. Line 639: For group bookings, reserve inventory during payment flow.
640. Line 640: Consider holding inventory with a short TTL while checkout completes.
641. Line 641: Add a background job to release held inventory after TTL expires.
642. Line 642: Provide metrics for conversion funnel analytics and abandonment rates.
643. Line 643: Track checkout steps and identify drop-off points.
644. Line 644: Use A/B tests to improve checkout UX and reduce friction.
645. Line 645: Document refund and chargeback handling procedures.
646. Line 646: Keep financial records aligned with accounting requirements.
647. Line 647: Provide export options for accounting data in CSV or JSON.
648. Line 648: Keep tax calculation rules configurable per jurisdiction.
649. Line 649: Document shipping rules and product sizing where applicable.
650. Line 650: For physical goods, integrate with fulfillment partner APIs if needed.
651. Line 651: Track shipment status and expose tracking to customers.
652. Line 652: Implement retries for transient errors in partner APIs.
653. Line 653: Monitor API quotas and alert on nearing limits.
654. Line 654: Document escalation processes for partner API issues.
655. Line 655: Provide an admin view of orders that need manual intervention.
656. Line 656: Include user support scripts and canned responses for common issues.
657. Line 657: Store support tickets and link them to user accounts.
658. Line 658: Maintain a knowledge base for support staff with troubleshooting steps.
659. Line 659: Periodically review support tickets to identify common UX problems.
660. Line 660: Use support ticket analytics to prioritize product improvements.
661. Line 661: For long-running background tasks, provide progress reporting.
662. Line 662: Store task state and progress percentage in Redis or Mongo.
663. Line 663: Expose progress via admin APIs for monitoring.
664. Line 664: Implement optimistic UI updates where appropriate for better UX.
665. Line 665: Provide rollback strategies for user-initiated destructive actions.
666. Line 666: Keep changelogs and release notes accessible to internal teams.
667. Line 667: Document feature ownership and contact points for each area.
668. Line 668: Encourage cross-team knowledge sharing and documentation reviews.
669. Line 669: Archive deprecated APIs and provide migration paths for clients.
670. Line 670: Maintain compatibility layers for older admin UIs during migration.
671. Line 671: Use canary deployments for major UI changes to gather feedback early.
672. Line 672: Track performance regressions across releases and set thresholds.
673. Line 673: Automate rollbacks on regressions that exceed thresholds.
674. Line 674: Provide a lightweight benchmarking script to test local performance.
675. Line 675: Include methods to simulate traffic load for stress testing.
676. Line 676: Document how to reproduce user-reported performance issues locally.
677. Line 677: Keep a history of critical incidents and their root cause analyses.
678. Line 678: Use post-mortem learnings to improve architecture and processes.
679. Line 679: Keep a technical debt backlog and revisit it each sprint.
680. Line 680: Prioritize debt that impacts performance, security, or reliability.
681. Line 681: Regularly review and prune unused dependencies.
682. Line 682: Automate license checks in CI to flag incompatible packages.
683. Line 683: Document how to run local DB migrations and seeders for new devs.
684. Line 684: Provide a quick-start script to set up a dev environment from clean.
685. Line 685: Include troubleshooting steps for common environment issues.
686. Line 686: Provide a list of environment variables and their defaults in `.env.example`.
687. Line 687: Use per-environment config files to avoid secrets in code.
688. Line 688: Document how to configure Cloudinary vs local storage modes.
689. Line 689: Provide an example Cloudinary config in `config/cloudinary.example.js`.
690. Line 690: Add guidance for local fallback when Cloudinary is not configured.
691. Line 691: Implement feature toggles for experimental VR content.
692. Line 692: Provide opt-in flags for beta testers to access new features.
693. Line 693: Keep user analytics anonymous by default unless opt-in.
694. Line 694: Track privacy preferences and honor Do Not Track if required.
695. Line 695: Document how to serve personalized content within privacy constraints.
696. Line 696: Keep a list of approved fonts and assets for consistent branding.
697. Line 697: Store branding assets in a centralized folder with versioning.
698. Line 698: Create a style guide for consistent color usage and components.
699. Line 699: Maintain a design token file for use across templates and CSS.
700. Line 700: Provide a process for requesting new features and their impact analysis.
701. Line 701: Include a template for feature proposals including cost, benefits, and risks.
702. Line 702: Maintain a backlog of improvements and a roadmap with timelines.
703. Line 703: Track technical dependencies between features to avoid surprises.
704. Line 704: Use labels in issue tracker to indicate priority and area.
705. Line 705: Document ownership of each label and triage process.
706. Line 706: Encourage frequent small releases rather than infrequent large ones.
707. Line 707: Use feature flags to soften the impact of large releases.
708. Line 708: Provide a migration checklist for customers or stakeholders when needed.
709. Line 709: Document database maintenance windows and their expected impact.
710. Line 710: Provide step-by-step instructions for maintenance tasks in runbooks.
711. Line 711: Automate as many maintenance tasks as possible with idempotent scripts.
712. Line 712: Keep scripts under version control and documented in the repo.
713. Line 713: Provide a secure location for storing operational scripts and credentials.
714. Line 714: Conduct security reviews for privileged scripts that access production.
715. Line 715: Log execution and changes to critical operational scripts.
716. Line 716: Regularly audit who has permission to run sensitive scripts.
717. Line 717: Maintain a change history for operational playbooks and runbooks.
718. Line 718: Provide a lightweight incident dashboard that aggregates key signals.
719. Line 719: Include recent deploy id, active alerts, and current error rates.
720. Line 720: Train staff on using the incident dashboard during alerts.
721. Line 721: Keep a checklist for restoring service in case of catastrophic failure.
722. Line 722: The checklist should include failover steps, contact points, and recovery verification.
723. Line 723: Store disaster recovery artifacts in an access-controlled vault.
724. Line 724: Plan and test full failover drills periodically.
725. Line 725: Maintain a contact list for key vendors and service providers.
726. Line 726: Document the process for emergency domain or DNS changes.
727. Line 727: Keep a simplified architecture diagram for non-technical stakeholders.
728. Line 728: Provide a deeper architecture diagram for engineers with component details.
729. Line 729: Use diagrams.net or mermaid for editable architecture diagrams.
730. Line 730: Keep diagrams versioned and in the `documents/diagrams/` folder.
731. Line 731: Document the steps to onboard a new engineer with environment setup timelines.
732. Line 732: Include a checklist for environment setup, credentials, and local seeds.
733. Line 733: Provide a short list of common commands for quick productivity.
734. Line 734: Keep a playground or sandbox environment for experimentation.
735. Line 735: Ensure sandbox environments do not contain production secrets.
736. Line 736: Regularly sync sandbox schema with production to avoid drift.
737. Line 737: Provide migration scripts to bring sandbox data up to date.
738. Line 738: Document how to request additional resources for long-running experiments.
739. Line 739: Track experiments and their associated resource costs for accountability.
740. Line 740: Include a glossary of architecture terms used in these documents.
741. Line 741: Glossary entries should include brief definitions and cross-references.
742. Line 742: Encourage contributors to add clarifying entries when new terms appear.
743. Line 743: Provide pointers to external standards and best practices where relevant.
744. Line 744: Mention authoritative docs for OAuth, TLS, and GDPR compliance.
745. Line 745: Keep this deep-dive as a living document and review it quarterly.
746. Line 746: Record revisions and who made them at the top of this document.
747. Line 747: Example revision line: 2026-06-09: Added performance and security sections.
748. Line 748: End of appended operational notes section.
749. Line 749: Additional appendix: checklist for release readiness.
750. Line 750: Release checklist item: tests passing in CI for all branches.
751. Line 751: Release checklist item: security scans completed and cleared.
752. Line 752: Release checklist item: migration scripts reviewed and approved.
753. Line 753: Release checklist item: performance benchmark compared to baseline.
754. Line 754: Release checklist item: stakeholders informed of potential downtime.
755. Line 755: Release checklist item: monitoring dashboards prepared.
756. Line 756: Release checklist item: rollback plan documented and accessible.
757. Line 757: Release checklist item: feature flags set for gradual rollout.
758. Line 758: Appendix: common troubleshooting commands.
759. Line 759: Command: `node scripts/check-db.js` — checks mongo connection.
760. Line 760: Command: `node scripts/list_largest_files.js` — lists large repo files.
761. Line 761: Command: `npm run lint` — run linting checks locally.
762. Line 762: Command: `npm run test` — run unit tests locally.
763. Line 763: Command: `npm run seed` — seed local DB with test data.
764. Line 764: Command: `node scripts/clear-cache.js` — clears server-side caches.
765. Line 765: Appendix: common error diagnostics.
766. Line 766: Symptom: high memory usage — check queue workers and active uploads.
767. Line 767: Symptom: slow DB queries — run explain() and check indexes.
768. Line 768: Symptom: uploads failing — check Cloudinary keys and quotas.
769. Line 769: Symptom: SSL errors — verify cert chain and domain names.
770. Line 770: Symptom: high latency on VR pages — check large textures and model sizes.
771. Line 771: Appendix: glossary (continued).
772. Line 772: Term: CDN — Content Delivery Network, used to serve cached static assets.
773. Line 773: Term: LQIP — Low Quality Image Placeholder.
774. Line 774: Term: LCP — Largest Contentful Paint.
775. Line 775: Term: CLS — Cumulative Layout Shift.
776. Line 776: Term: ETag — HTTP entity tag for cache validation.
777. Line 777: Term: CSRF — Cross-Site Request Forgery.
778. Line 778: Term: RBAC — Role-Based Access Control.
779. Line 779: Term: OIDC — OpenID Connect for authentication.
780. Line 780: Appendix: sample `env` variables list.
781. Line 781: ENV: `PORT` — port to listen on, default 3000.
782. Line 782: ENV: `MONGO_URI` — MongoDB connection string.
783. Line 783: ENV: `SESSION_SECRET` — secret for session signing.
784. Line 784: ENV: `CLOUDINARY_URL` — cloudinary connection string (optional).
785. Line 785: ENV: `NODE_ENV` — production|development.
786. Line 786: ENV: `REDIS_URL` — optional Redis URL for job queues.
787. Line 787: ENV: `MAX_UPLOAD_SIZE` — limit for uploads (bytes).
788. Line 788: ENV: `ADMIN_EMAILS` — comma-separated list of admin emails.
789. Line 789: ENV: `SENTRY_DSN` — optional Sentry DSN for error tracking.
790. Line 790: Appendix: suggested Cloudinary settings for uploads.
791. Line 791: Use eager transformations to generate web-optimized variants on upload.
792. Line 792: Generate multiple sizes (thumbnail, medium, hero) for each image.
793. Line 793: Prefer automatic format (`f_auto`) to serve WebP/AVIF when supported.
794. Line 794: Use cropping strategies for thumbnails to maintain aspect ratio.
795. Line 795: Store original upload and generated variants as separate resources.
796. Line 796: Appendix: example FFmpeg commands for video processing.
797. Line 797: Extract a poster frame: `ffmpeg -i input.mp4 -ss 00:00:01 -vframes 1 out.jpg`.
798. Line 798: Transcode to H.264 mp4: `ffmpeg -i in.mov -c:v libx264 -crf 23 -preset medium out.mp4`.
799. Line 799: Create adaptive bitrate renditions with multiple resolutions.
800. Line 800: Generate WebM variant for modern browsers if needed.
801. Line 801: Appendix: image optimization recommendations.
802. Line 802: Use `sharp` to resize images and convert to WebP/AVIF in CI or server.
803. Line 803: Keep aspect ratios consistent across gallery thumbnails.
804. Line 804: Remove metadata and EXIF from web-optimized images to save bytes.
805. Line 805: Provide retina-ready images only where necessary to save bandwidth.
806. Line 806: Use `srcset` and `sizes` attributes in templates for responsive images.
807. Line 807: For very large hero images, provide progressive JPEGs or placeholders.
808. Line 808: Appendix: testing checklist for VR content.
809. Line 809: Verify panoramas load on desktop and mobile browsers.
810. Line 810: Verify device-orientation controls on supported mobile devices.
811. Line 811: Test fallback when WebGL is disabled or unavailable.
812. Line 812: Validate audio synchronization for narrated tours across devices.
813. Line 813: Document how to add new panorama assets and update manifests.
814. Line 814: Appendix: sample backup and restore commands.
815. Line 815: Backup DB: `mongodump --uri "$MONGO_URI" --archive=backup.gz --gzip`.
816. Line 816: Restore DB: `mongorestore --uri "$MONGO_URI" --archive=backup.gz --gzip`.
817. Line 817: Verify backup integrity by restoring to a staging instance and running smoke tests.
818. Line 818: Appendix: final notes and references.
819. Line 819: Reference: MongoDB production checklist — follow vendor guidelines.
820. Line 820: Reference: Cloudinary docs for upload and transformation APIs.
821. Line 821: Reference: FFmpeg documentation for advanced transcoding.
822. Line 822: Reference: OWASP Top Ten for web app security guidance.
823. Line 823: Contact: devops@example.org for operational questions (replace with real contact).
824. Line 824: End of deep dive appendix.
