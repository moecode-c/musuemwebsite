# Museum Employee Management Plan (RBAC + Task Mapping)

## 1) Goal
Build a dedicated employee management system in the existing Express MVC app with:
- Multi-role RBAC
- Employee task assignment
- Janitor cleaning assignments on map polygons
- Separate dashboard per role
- Strict separation from admin dashboard for non-admin users

This plan preserves current public/customer flows (including TicketRequest) and adds internal employee operations in parallel.

## 2) Role Set (v1)
- `museum_manager` (staff operations + assignment)
- `curator`
- `front_desk`
- `security_officer`
- `maintenance_technician`
- `janitor`
- `educator_guide` (optional in first release)

## 3) Permission Matrix (core actions)
Define action-level permissions in `middleware/roles.js` and stop using only binary admin checks.

- `dashboard:admin`
- `dashboard:role`
- `task:create`
- `task:assign`
- `task:view_any`
- `task:view_own`
- `task:update_own_status`
- `zone:manage`
- `zone:view_assigned`

Rule baseline:
- `admin`: all actions
- `museum_manager`: all task/zone ops except role-system internals
- non-admin employees: own dashboard + own tasks only
- `janitor`: `zone:view_assigned` + janitor task completion workflow

## 4) Data Domains

### 4.1 Task Domain (new)
Create:
- `models/Task.js`
- `controllers/tasksController.js`
- `routes/tasks.js`

Suggested fields:
- `title`, `description`, `priority`
- `status`: `new | assigned | in_progress | completed | verified`
- `dueAt`
- `assignedBy` (User ref)
- `assignedTo` (User ref)
- `roleTarget` (role enum fallback)
- `zoneId` (CleaningZone ref, nullable)
- `checklist` (array)
- `proofPhotos` (array)
- `completionNote`
- `audit` timestamps/events

### 4.2 Cleaning Zone Domain (new, polygon)
Create:
- `models/CleaningZone.js`
- `controllers/cleaningZonesController.js`
- `routes/cleaningZones.js`

Suggested fields:
- `zoneName`
- `floor`
- `polygon` (array of `{ x, y }` points)
- `isActive`
- assignment metadata (`assignedTo`, `assignedBy`, `assignedAt`)

## 5) Route and Middleware Changes
Update foundation files for role expansion:
- `models/User.js`
- `middleware/roles.js`
- `middleware/locals.js`
- `controllers/authController.js`
- `middleware/validation.js`

Mount new modules in `app.js` and guard with permission middleware.

## 6) Dashboard Strategy (separate pages per role)
Create dedicated employee dashboard views:
- `views/employee/janitor-dashboard.ejs`
- `views/employee/curator-dashboard.ejs`
- `views/employee/security-dashboard.ejs`
- `views/employee/frontdesk-dashboard.ejs`
- `views/employee/technician-dashboard.ejs`
- `views/employee/manager-dashboard.ejs`
- `views/employee/educator-dashboard.ejs`

Routing options:
- extend `routes/pages.js`, or
- add `routes/employee.js` (cleaner isolation)

Hard rule: non-admin roles cannot access admin dashboard routes/views.

## 7) Janitor Map Workflow (polygon assignment)
1. Manager/Admin draws polygon zone on map UI.
2. Manager/Admin assigns zone + janitor + due window.
3. Janitor dashboard shows only assigned zones highlighted.
4. Janitor marks tasks complete with note/photo proof.
5. Manager verifies completion.

Implementation targets:
- extend `public/javascript/map.js` for polygon draw/edit
- add focused employee map script (for example `public/javascript/employee-map.js`)

## 8) TicketRequest Relationship
Keep `TicketRequest` as customer-facing flow.

Optional integration:
- Add conversion action in `controllers/ticketRequestsController.js` to create internal `Task` from selected requests.

## 9) Phased Execution Roadmap

### Phase 1 — RBAC Foundation
- Expand role enums and validation
- Add permission matrix and action guards
- Enforce role-based login redirect + dashboard access gates

### Phase 2 — Task Module
- Implement Task model/controller/routes
- Build create/assign/list/update APIs and views for manager/admin
- Add ownership checks (`view_own`, `update_own_status`)

### Phase 3 — Cleaning Zones (Polygon)
- Implement zone model/controller/routes
- Add polygon draw/edit UI for admin/manager
- Link tasks to zones

### Phase 4 — Role Dashboards
- Build separate role dashboard pages
- Add role-specific widgets and task lists
- Ensure admin navigation is hidden/blocked for non-admin roles

### Phase 5 — Seed + Hardening
- Seed users for each role
- Seed sample zones/tasks
- Add access-control regression checks

## 10) Verification Checklist
- Auth/RBAC: each role lands on correct dashboard; admin routes blocked for non-admin users.
- Task flow: manager creates/assigns; assignee sees only own tasks; invalid transitions blocked.
- Janitor map: assigned zones visible only to assigned janitor; completion proof works.
- Security: direct URL/API access checks deny unauthorized role or cross-user access.
- Regression: public pages, TicketRequest checkout flow, and existing admin map remain functional.

## 11) Key Decisions (locked)
- Use a **new `Task` model** (do not merge into `TicketRequest`).
- Use **polygon-based `CleaningZone` model** (not pin-only).
- Use **separate dashboard page per role** with shared RBAC middleware.

## 12) Out-of-Scope for v1
- Shift scheduling/calendar engine
- Real-time websocket notifications
- Mobile app
- Advanced analytics dashboards
