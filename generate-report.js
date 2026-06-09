/* Generates a print-ready Word report for the Egyptian Museum project. */
const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat, TableOfContents, HeadingLevel,
  BorderStyle, WidthType, ShadingType, VerticalAlign, PageNumber, PageBreak,
} = require("docx");

// ---- palette -------------------------------------------------------------
const GOLD = "8A6518";
const NAVY = "1F3A5F";
const DARK = "2B2B2B";
const HEAD_FILL = "EFE3C8"; // sand for table headers
const BORDER = "CCCCCC";
const CONTENT_W = 9026;     // A4, 1" margins
const TBL_W = 9020;

// ---- helpers -------------------------------------------------------------
const t = (text, opts = {}) => new TextRun({ text, ...opts });

const h1 = (text) => new Paragraph({ heading: HeadingLevel.HEADING_1, children: [t(text)] });
const h2 = (text) => new Paragraph({ heading: HeadingLevel.HEADING_2, children: [t(text)] });
const h3 = (text) => new Paragraph({ heading: HeadingLevel.HEADING_3, children: [t(text)] });

const p = (text, opts = {}) =>
  new Paragraph({ spacing: { after: 120, line: 276 }, children: Array.isArray(text) ? text : [t(text, opts)] });

const bullet = (text, level = 0) =>
  new Paragraph({
    numbering: { reference: "bullets", level },
    spacing: { after: 60, line: 264 },
    children: Array.isArray(text) ? text : [t(text)],
  });

const num = (text) =>
  new Paragraph({ numbering: { reference: "nums", level: 0 }, spacing: { after: 60, line: 264 }, children: [t(text)] });

const cell = (content, { width, fill, bold = false, align } = {}) => {
  const border = { style: BorderStyle.SINGLE, size: 1, color: BORDER };
  const runs = Array.isArray(content) ? content : [t(String(content), { bold })];
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    borders: { top: border, bottom: border, left: border, right: border },
    shading: fill ? { fill, type: ShadingType.CLEAR } : undefined,
    margins: { top: 60, bottom: 60, left: 120, right: 120 },
    verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({ alignment: align, children: runs })],
  });
};

// table(headers[], rows[][], colWidths[])
const table = (headers, rows, colWidths) =>
  new Table({
    width: { size: TBL_W, type: WidthType.DXA },
    columnWidths: colWidths,
    rows: [
      new TableRow({
        tableHeader: true,
        children: headers.map((hdr, i) =>
          cell([t(hdr, { bold: true, color: DARK })], { width: colWidths[i], fill: HEAD_FILL })),
      }),
      ...rows.map((r) =>
        new TableRow({ children: r.map((c, i) => cell(c, { width: colWidths[i] })) })),
    ],
  });

const spacer = (after = 120) => new Paragraph({ spacing: { after }, children: [t("")] });

const divider = () =>
  new Paragraph({
    spacing: { before: 60, after: 180 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: GOLD, space: 1 } },
    children: [t("")],
  });

// ===========================================================================
// CONTENT
// ===========================================================================
const cover = [
  new Paragraph({ spacing: { before: 1800, after: 0 }, alignment: AlignmentType.CENTER,
    children: [t("PROJECT REPORT", { color: GOLD, bold: true, size: 26, allCaps: true })] }),
  new Paragraph({ spacing: { before: 240, after: 0 }, alignment: AlignmentType.CENTER,
    children: [t("The Afterlife Egyptian Museum", { color: NAVY, bold: true, size: 60 })] }),
  new Paragraph({ spacing: { before: 200, after: 0 }, alignment: AlignmentType.CENTER,
    children: [t("A Full-Stack Museum Web Application", { italics: true, size: 30, color: DARK })] }),
  new Paragraph({ spacing: { before: 120, after: 0 }, alignment: AlignmentType.CENTER, border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: GOLD, space: 12 } },
    children: [t("")] }),
  new Paragraph({ spacing: { before: 360, after: 0 }, alignment: AlignmentType.CENTER,
    children: [t("MVC  ·  Node.js  ·  Express  ·  MongoDB  ·  EJS", { size: 24, color: GOLD, bold: true })] }),
  new Paragraph({ spacing: { before: 1600, after: 0 }, alignment: AlignmentType.CENTER,
    children: [t("Bilingual (English / Arabic)  ·  Role-Based Access  ·  E-Commerce  ·  3D & Virtual Tours", { size: 20, color: DARK })] }),
  new Paragraph({ spacing: { before: 1400, after: 0 }, alignment: AlignmentType.CENTER,
    children: [t("Prepared by: Project Team", { size: 22, color: DARK })] }),
  new Paragraph({ spacing: { before: 80, after: 0 }, alignment: AlignmentType.CENTER,
    children: [t("June 2026", { size: 22, color: DARK })] }),
  new Paragraph({ children: [new PageBreak()] }),
];

const toc = [
  new Paragraph({ spacing: { after: 200 }, children: [t("Table of Contents", { bold: true, size: 32, color: NAVY })] }),
  new TableOfContents("Table of Contents", { hyperlink: true, headingStyleRange: "1-2" }),
  new Paragraph({ children: [new PageBreak()] }),
];

const body = [
  // 1. EXECUTIVE SUMMARY
  h1("1. Executive Summary"),
  p("The Afterlife Egyptian Museum is a full-stack web application that brings the experience of a national museum online. It pairs a rich, public visitor-facing website — exhibits, 360° virtual tours, 3D artifact models, mini-games, a souvenir shop, and online ticketing — with a complete staff and administrative back office for content management, order processing, analytics, and day-to-day museum operations."),
  p("The system is built on the Model-View-Controller (MVC) architecture using Node.js and the Express framework, with MongoDB (via Mongoose) for data storage and server-rendered EJS templates for the user interface. It supports bilingual English/Arabic content, role-based access control for nine distinct user types, a session-based authentication system, QR-coded tickets, and a media pipeline for images and 3D models. The codebase is backed by an automated test suite (unit, integration, smoke, and end-to-end) and a continuous-integration pipeline."),
  divider(),

  // 2. OBJECTIVES
  h1("2. Project Objectives"),
  bullet("Deliver an immersive digital museum experience: browsable exhibit collections, 360° virtual tours with audio guides, interactive 3D artifact models, and educational mini-games."),
  bullet("Enable online services for visitors: ticket requests with QR verification and a souvenir shop with cart, checkout, and order tracking."),
  bullet("Provide administrators with full operational control: content management, user management, order handling, and rich statistics and analytics."),
  bullet("Support internal museum operations through role-specific employee dashboards, including task assignment and map-based cleaning-zone management."),
  bullet("Be inclusive and accessible: full English/Arabic localization and an accessibility-assistance request system."),
  bullet("Be reliable and maintainable through automated testing and an automated CI pipeline."),
  divider(),

  // 3. KEY FEATURES (overview)
  h1("3. Key Features at a Glance"),
  h3("Visitor-facing"),
  bullet("Home page with featured exhibits, shop highlights, visitor testimonials, and live Cairo weather."),
  bullet("Three exhibit collections — Pharaoh, Islamic, and Christian — with search, category filtering, pagination, curated historical timelines, and detailed artifact pages featuring 3D models."),
  bullet("Virtual tours (Pharaoh, Islamic, Christian) with audio guides and a downloadable brochure, plus a dedicated VR experience page."),
  bullet("Mini-games: a history Quiz, an Explorer game, and a Pyramid Builder."),
  bullet("Souvenir shop, session-based cart, and a multi-step checkout."),
  bullet("Plan-your-trip page, newsletter subscription, testimonials submission, and an interactive map."),
  h3("Staff & administration"),
  bullet("Secure authentication with nine roles and a fine-grained permission system."),
  bullet("Admin dashboard with live counts and a full statistics & analytics view (six-month trends, revenue, demographics)."),
  bullet("Management screens for exhibits, products, tickets, users, map pins, orders, ticket requests, assistance requests, and newsletter subscribers (with CSV export)."),
  bullet("Employee dashboards tailored to each role, plus manager tools for assigning tasks and cleaning zones."),
  divider(),

  // 4. TECHNOLOGY STACK
  h1("4. Technology Stack"),
  p("The application uses a focused, widely-adopted Node.js stack:"),
  table(
    ["Layer / Area", "Technologies"],
    [
      ["Runtime & Framework", "Node.js (>= 18), Express 4"],
      ["Database", "MongoDB with Mongoose ODM"],
      ["Views / UI", "EJS server-side templates, CSS, vanilla JavaScript"],
      ["Authentication", "express-session, connect-mongo (session store), bcrypt (password hashing)"],
      ["Security", "helmet, express-validator, method-override, cookie-parser"],
      ["Media & Files", "Multer (uploads), Cloudinary (image & 3D-model hosting) with local fallback"],
      ["Utilities", "qrcode (ticket QR), compression, morgan (logging), dotenv"],
      ["3D / Immersive", "@google/model-viewer, three.js"],
      ["Integrations", "Open-Meteo weather API"],
      ["Testing", "Jest, Supertest, Playwright, mongodb-memory-server"],
      ["CI / DevOps", "GitHub Actions, Docker, docker-compose, Render"],
    ],
    [2600, 6420]
  ),
  divider(),

  // 5. ARCHITECTURE
  h1("5. System Architecture"),
  p([t("The project follows the ", {}), t("Model-View-Controller (MVC)", { bold: true }), t(" pattern, separating data, presentation, and logic:", {})]),
  bullet([t("Models", { bold: true }), t(" — Mongoose schemas that define the data and its rules (e.g., User, Exhibit, Product, Order).", {})]),
  bullet([t("Views", { bold: true }), t(" — EJS templates rendered on the server into HTML, with reusable partials (header, navbar, footer) and per-area layouts.", {})]),
  bullet([t("Controllers", { bold: true }), t(" — functions that handle a request, talk to the models, and return either a rendered page or JSON.", {})]),
  bullet([t("Routes", { bold: true }), t(" — map URLs and HTTP methods to controllers, applying authentication, authorization, and validation middleware along the way.", {})]),
  h3("Request lifecycle"),
  num("A browser request enters the Express app (app.js)."),
  num("Global middleware runs: security headers (helmet), compression, request logging (morgan), body and cookie parsing, method override, and static-asset serving."),
  num("The session middleware loads the user's server-side session (stored in MongoDB)."),
  num("A locals middleware attaches the active language/translations, the logged-in user, and the cart to every response."),
  num("The router matches the URL and runs route-specific guards (authentication, role/permission checks, input validation)."),
  num("The controller executes the business logic, reading from or writing to MongoDB through Mongoose."),
  num("The controller renders an EJS view (for pages) or returns JSON (for API/AJAX calls)."),
  num("Errors are caught by a centralized handler — JSON for /api routes, a styled 500 page otherwise; unknown URLs hit a 404 handler."),
  divider(),

  // 6. PROJECT STRUCTURE
  h1("6. Project Structure"),
  p("The repository is organized by responsibility:"),
  new Paragraph({ shading: { fill: "F4F4F4", type: ShadingType.CLEAR }, spacing: { after: 40 }, children: [t("app.js               Application entry point & middleware wiring", { font: "Consolas", size: 18 })] }),
  ...[
    "config/              Database, Cloudinary, and Multer configuration",
    "controllers/         Request handlers (one per resource/area)",
    "middleware/          auth, roles, validation, locals, error handling",
    "models/              Mongoose schemas (12 collections)",
    "routes/              Express routers mapping URLs to controllers",
    "views/               EJS templates (pages + partials + layouts)",
    "public/              Static assets: CSS, client JS, images, 3D models, favicon",
    "utils/               Helpers: i18n, pagination, weather, uploads, async wrapper",
    "seeders/             Scripts to populate the database with sample data",
    "tests/               unit / integration / smoke / e2e + helpers & fixtures",
    ".github/workflows/   CI pipeline (GitHub Actions)",
  ].map((line) => new Paragraph({ shading: { fill: "F4F4F4", type: ShadingType.CLEAR }, spacing: { after: 40 }, children: [t(line, { font: "Consolas", size: 18 })] })),
  divider(),

  // 7. DATA MODELS
  h1("7. Data Model"),
  p("Data is stored across twelve MongoDB collections:"),
  table(
    ["Model", "Purpose", "Key Fields"],
    [
      ["User", "Accounts & roles", "name, email, password (hashed), role"],
      ["Exhibit", "Artifacts/exhibits", "title, category, description, imageUrl, modelUrl, era"],
      ["Product", "Shop items", "name, description, price, imageUrl, stock"],
      ["Order", "Shop purchases", "items[], total, customer, payment, delivery, status, user"],
      ["Ticket", "Ticket pricing", "group, audience, price, description"],
      ["TicketRequest", "Visit bookings", "name, age, email, category, audience, date, timeSlot, status"],
      ["Testimonial", "Visitor reviews", "name, message, rating"],
      ["Newsletter", "Subscribers", "name, phone, email"],
      ["MapPin", "Interactive map", "label, x, y, description, isCommon"],
      ["Task", "Staff tasks", "title, priority, status, assignedTo/By, dueAt, checklist, proofPhotos"],
      ["CleaningZone", "Map cleaning areas", "zoneName, floor, polygon, color, assignedTo"],
      ["AssistanceRequest", "Accessibility help", "name, email, type, date, notes, status"],
    ],
    [1700, 3100, 4220]
  ),
  divider(),

  // 8. FEATURE DETAIL
  h1("8. Features in Detail"),

  h2("8.1 Authentication & Authorization"),
  p("Visitors register and log in with an email and password. Passwords are hashed with bcrypt before storage, and sessions are kept server-side in MongoDB (via connect-mongo) with secure, HTTP-only cookies. After login, users are routed to a dashboard appropriate to their role."),
  p("Authorization is enforced through a layered set of guards and a role-to-permission table:"),
  bullet([t("requireAuth / requireAuthApi", { bold: true }), t(" — protect pages (redirect to login) and AJAX endpoints (401 JSON).", {})]),
  bullet([t("requireGuest", { bold: true }), t(" — keep logged-in users away from the login/register pages.", {})]),
  bullet([t("requireAdmin / requireAnyRole / requirePermission", { bold: true }), t(" — restrict access by role or specific permission.", {})]),
  p("The nine roles and their core capabilities:"),
  table(
    ["Role", "Core Capabilities"],
    [
      ["Admin", "Full access to everything (content, users, orders, analytics, settings)"],
      ["Museum Manager", "Create/assign tasks, manage cleaning zones, view all tasks"],
      ["Curator", "View and update own assigned tasks; view assigned zones"],
      ["Front Desk", "View and update own tasks; handle visitor-facing follow-ups"],
      ["Security Officer", "View and update own patrol/incident tasks"],
      ["Maintenance Technician", "View and update own maintenance tasks"],
      ["Janitor", "View assigned cleaning zones and tasks (completion needs proof)"],
      ["Educator Guide", "View and update own session/tour tasks"],
      ["User (Visitor)", "Browse, book tickets, shop, submit testimonials, manage own dashboard"],
    ],
    [2700, 6320]
  ),

  h2("8.2 Visitor Dashboard"),
  p("Logged-in visitors get a personal dashboard listing their ticket requests — each rendered with a scannable QR code generated server-side — and their order history. The QR code links to a public verification page so museum staff can validate a ticket on arrival."),

  h2("8.3 Shop & E-Commerce"),
  p("The shop presents products grouped into inferred categories (books, souvenirs, replicas, decor) with stock, low-stock, and preorder badges, pagination, and a quick-view. A session-based cart supports add, update-quantity, and remove operations. Checkout is a guided, multi-step flow:"),
  num("Customer enters delivery and contact details (validated on the server)."),
  num("Customer selects payment method and delivery/pickup options."),
  num("The order is persisted to the database, the cart is cleared, and a confirmation page is shown."),
  p("Saved orders appear in both the visitor's dashboard and the admin orders screen, where staff can confirm, fulfill, or cancel them."),

  h2("8.4 Ticketing & QR Verification"),
  p("Ticket pricing is modeled by visitor group (Egyptian, Arab, Foreigner) and audience (adult, student, child, senior). Visitors submit ticket requests with their details and a preferred date/time slot. Each request can be verified via its QR code on a public page, and an administrator can convert a request into an actionable staff task (e.g., for the front desk) in one click."),

  h2("8.5 Administration & Analytics"),
  p("The admin panel opens on a dashboard of live counts (exhibits, products, users, orders, pending orders, assistance requests, and more). A dedicated Statistics & Analytics page uses MongoDB aggregation to present a rolling six-month view, including revenue and average order value, orders by status, users by role, exhibits by category, ticket-request demographics and top nationalities, accessibility-request breakdowns, testimonial rating distribution, and inventory health. Administrators manage every resource and can export newsletter subscribers to CSV."),

  h2("8.6 Museum Operations (Employees)"),
  p("Managers assign tasks to staff with a priority, checklist, due date, target role, and optional cleaning zone, and they draw cleaning zones as polygons on an interactive museum map. Employees see only their own tasks and zones and advance task status through a controlled workflow (new → assigned → in progress → completed → verified). Janitor task completion specifically requires a note or photo proof, enforcing accountability."),

  h2("8.7 Accessibility & Localization"),
  p("Every page is fully bilingual (English and Arabic), driven by a translation dictionary and a language cookie that the user can toggle at any time. Visitors who need support can submit accessibility-assistance requests (wheelchair, listening, visual, or sensory needs), which administrators triage through new / in-progress / resolved states."),

  h2("8.8 Media Pipeline & Integrations"),
  p("Image and 3D-model uploads are handled by Multer and pushed to Cloudinary; if Cloudinary is not configured, the system gracefully falls back to local file storage. Image URLs are normalized with safe fallbacks so broken links never reach the page. The home and plan-trip pages integrate the Open-Meteo API for live Cairo weather, and tickets use server-side QR-code generation."),
  divider(),

  // 9. SECURITY
  h1("9. Security Measures"),
  bullet("Passwords hashed with bcrypt — plaintext passwords are never stored."),
  bullet("Server-side sessions persisted in MongoDB with HTTP-only, same-site cookies."),
  bullet("Security HTTP headers applied via helmet."),
  bullet("Input validation on all write endpoints using express-validator (rejected with 422)."),
  bullet("Role-based access control on every protected route."),
  bullet("Safe-redirect handling and path-traversal guards when resolving local assets."),
  bullet("Upload restrictions: allowed file types and a size limit enforced by Multer."),
  bullet("Optional HTTPS support with configurable TLS certificates."),
  divider(),

  // 10. API OVERVIEW
  h1("10. API & Routes Overview"),
  p("The application exposes server-rendered pages and a JSON API. Representative endpoints:"),
  table(
    ["Resource", "Key Endpoints", "Access"],
    [
      ["Auth", "GET/POST /auth/register, /auth/login, POST /auth/logout", "Public"],
      ["Pages", "/, /about, /exhibits, /shop, /virtual-tour, /games, ...", "Public"],
      ["Exhibits", "GET /api/exhibits; POST/PUT/DELETE /api/exhibits/:id", "Read public / write admin"],
      ["Products", "GET /api/products; POST/PUT/DELETE /api/products/:id", "Read public / write admin"],
      ["Cart", "GET /cart; POST /cart/add; checkout flow", "Add/checkout: logged-in"],
      ["Tickets", "GET /api/tickets; POST /api/ticket-requests", "Requests: logged-in"],
      ["Tasks", "GET/POST/PUT/PATCH/DELETE /api/tasks", "Permission-based (staff)"],
      ["Cleaning Zones", "GET/POST/PUT/PATCH/DELETE /api/cleaning-zones", "Permission-based (staff)"],
      ["Admin", "/admin/dashboard, /admin/analytics, /admin/...", "Admin only"],
    ],
    [1900, 4720, 2400]
  ),
  divider(),

  // 11. TESTING
  h1("11. Testing Strategy"),
  p("The project includes an automated test suite built with Jest, Supertest, and Playwright. Integration and smoke tests run against an in-memory MongoDB (mongodb-memory-server) so they need no external database and make no real external calls."),
  table(
    ["Test Layer", "What It Covers"],
    [
      ["Unit", "Critical middleware in isolation: authorization, authentication, error handling"],
      ["Integration", "The real app + in-memory DB: registration/login, CRUD, validation, and access control"],
      ["Smoke", "App boots, database connects, homepage responds, and all critical endpoints return expected status codes"],
      ["End-to-End", "Browser journeys with Playwright: public browsing, login/logout, and an admin create/edit/delete workflow"],
    ],
    [2200, 6820]
  ),
  spacer(60),
  p([t("Commands: ", { bold: true }), t("npm test", { font: "Consolas", size: 18 }), t(" runs the Jest suites (unit + integration + smoke); ", {}), t("npm run test:e2e", { font: "Consolas", size: 18 }), t(" runs the Playwright end-to-end journeys; ", {}), t("npm run test:coverage", { font: "Consolas", size: 18 }), t(" produces a coverage report.", {})]),
  divider(),

  // 12. CI/CD
  h1("12. Continuous Integration (CI)"),
  p("A GitHub Actions pipeline runs the tests automatically on every push to any branch. It is test-only — there are no deployment steps."),
  bullet("Triggers on a push to any branch; cancels superseded runs on the same branch."),
  bullet("Two parallel jobs: one for the Jest suites (with coverage), one for the Playwright end-to-end tests."),
  bullet("Caches and pre-downloads the in-memory MongoDB binary so runs are fast and reliable."),
  bullet("Uploads the coverage report and the Playwright HTML report as downloadable artifacts on every run."),
  bullet("Each commit receives a clear pass/fail status, surfacing problems immediately."),
  divider(),

  // 13. DEPLOYMENT
  h1("13. Deployment"),
  p("The application is container-ready and configuration-driven:"),
  bullet("Dockerfile and docker-compose for reproducible, containerized runs."),
  bullet("Configuration via environment variables (.env): database URI, session secret, Cloudinary keys, port/host, and HTTPS options."),
  bullet("Render-ready for cloud hosting; supports local HTTPS and LAN access for demos."),
  bullet("Database seeders provide realistic sample data for demonstrations."),
  divider(),

  // 14. FUTURE WORK
  h1("14. Future Enhancements"),
  bullet("Integrate a live online payment gateway at checkout."),
  bullet("Add transactional email (order confirmations, ticket delivery, newsletter sends)."),
  bullet("Expand automated test coverage across all controllers and edge cases."),
  bullet("Introduce full-text search and richer filtering for exhibits and products."),
  bullet("Add real-time staff notifications for new tasks, orders, and assistance requests."),
  divider(),

  // 15. CONCLUSION
  h1("15. Conclusion"),
  p("The Afterlife Egyptian Museum demonstrates a complete, production-style web application: an engaging public experience, full e-commerce and ticketing, a comprehensive administrative back office, and internal operations tooling — all built on a clean MVC foundation with strong security, full localization, automated testing, and continuous integration. It is a cohesive, end-to-end system that balances visitor experience with real operational needs."),
];

// ===========================================================================
// DOCUMENT
// ===========================================================================
const doc = new Document({
  creator: "Project Team",
  title: "The Afterlife Egyptian Museum — Project Report",
  styles: {
    default: { document: { run: { font: "Arial", size: 22, color: DARK } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 30, bold: true, font: "Arial", color: GOLD },
        paragraph: { spacing: { before: 240, after: 140 }, outlineLevel: 0, keepNext: true } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 25, bold: true, font: "Arial", color: NAVY },
        paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 1, keepNext: true } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 22, bold: true, font: "Arial", color: DARK },
        paragraph: { spacing: { before: 140, after: 60 }, outlineLevel: 2, keepNext: true } },
    ],
  },
  numbering: {
    config: [
      { reference: "bullets", levels: [
        { level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 540, hanging: 260 } } } },
        { level: 1, format: LevelFormat.BULLET, text: "◦", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 1080, hanging: 260 } } } },
      ] },
      { reference: "nums", levels: [
        { level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 540, hanging: 300 } } } },
      ] },
    ],
  },
  sections: [{
    properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
    footers: {
      default: new Footer({ children: [new Paragraph({
        border: { top: { style: BorderStyle.SINGLE, size: 4, color: BORDER, space: 6 } },
        tabStops: [{ type: "right", position: CONTENT_W }],
        children: [
          t("The Afterlife Egyptian Museum — Project Report", { size: 16, color: "888888" }),
          t("\tPage ", { size: 16, color: "888888" }),
          new TextRun({ children: [PageNumber.CURRENT], size: 16, color: "888888" }),
        ],
      })] }),
    },
    children: [...cover, ...toc, ...body],
  }],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync("Egyptian-Museum-Project-Report.docx", buffer);
  console.log("Wrote Egyptian-Museum-Project-Report.docx (" + buffer.length + " bytes)");
});
