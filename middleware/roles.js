const ROLES = {
  USER: "user",
  ADMIN: "admin",
  MUSEUM_MANAGER: "museum_manager",
  CURATOR: "curator",
  FRONT_DESK: "front_desk",
  SECURITY_OFFICER: "security_officer",
  MAINTENANCE_TECHNICIAN: "maintenance_technician",
  JANITOR: "janitor",
  EDUCATOR_GUIDE: "educator_guide"
};

const ADMIN_ROLES = [ROLES.ADMIN];
const EMPLOYEE_ROLES = [
  ROLES.MUSEUM_MANAGER,
  ROLES.CURATOR,
  ROLES.FRONT_DESK,
  ROLES.SECURITY_OFFICER,
  ROLES.MAINTENANCE_TECHNICIAN,
  ROLES.JANITOR,
  ROLES.EDUCATOR_GUIDE
];

const permissionsByRole = {
  [ROLES.ADMIN]: ["*"],
  [ROLES.MUSEUM_MANAGER]: [
    "dashboard:role",
    "task:create",
    "task:assign",
    "task:view_any",
    "task:view_own",
    "task:update_own_status",
    "zone:manage",
    "zone:view_assigned"
  ],
  [ROLES.CURATOR]: ["dashboard:role", "task:view_own", "task:update_own_status"],
  [ROLES.FRONT_DESK]: ["dashboard:role", "task:view_own", "task:update_own_status"],
  [ROLES.SECURITY_OFFICER]: ["dashboard:role", "task:view_own", "task:update_own_status"],
  [ROLES.MAINTENANCE_TECHNICIAN]: ["dashboard:role", "task:view_own", "task:update_own_status"],
  [ROLES.JANITOR]: ["dashboard:role", "task:view_own", "task:update_own_status", "zone:view_assigned"],
  [ROLES.EDUCATOR_GUIDE]: ["dashboard:role", "task:view_own", "task:update_own_status"],
  [ROLES.USER]: []
};

const dashboardPathByRole = {
  [ROLES.ADMIN]: "/admin/dashboard",
  [ROLES.MUSEUM_MANAGER]: "/employee/dashboard",
  [ROLES.CURATOR]: "/employee/dashboard",
  [ROLES.FRONT_DESK]: "/employee/dashboard",
  [ROLES.SECURITY_OFFICER]: "/employee/dashboard",
  [ROLES.MAINTENANCE_TECHNICIAN]: "/employee/dashboard",
  [ROLES.JANITOR]: "/employee/dashboard",
  [ROLES.EDUCATOR_GUIDE]: "/employee/dashboard",
  [ROLES.USER]: "/"
};

const deny = (res) => res.status(403).render("404", { pageTitle: "Forbidden", message: "Access denied." });

const normalizeLegacyRole = (role) => (role === "super_admin" ? ROLES.ADMIN : role);

const getRoleFromRequest = (req) => normalizeLegacyRole(req.session?.user?.role || null);

const hasAnyRole = (role, allowedRoles = []) => allowedRoles.includes(role);

const hasPermission = (role, permission) => {
  const normalizedRole = normalizeLegacyRole(role);
  const rolePermissions = permissionsByRole[normalizedRole] || [];
  return rolePermissions.includes("*") || rolePermissions.includes(permission);
};

const isAdminRole = (role) => ADMIN_ROLES.includes(role);

const isEmployeeRole = (role) => EMPLOYEE_ROLES.includes(role);

const getDashboardPathByRole = (role) => dashboardPathByRole[normalizeLegacyRole(role)] || "/";

const requireAdmin = (req, res, next) => {
  const role = getRoleFromRequest(req);
  if (!role || !isAdminRole(role)) {
    return deny(res);
  }
  return next();
};

const requireAnyRole = (allowedRoles = []) => (req, res, next) => {
  const role = getRoleFromRequest(req);
  if (!role || !hasAnyRole(role, allowedRoles)) {
    return deny(res);
  }
  return next();
};

const requirePermission = (permission) => (req, res, next) => {
  const role = getRoleFromRequest(req);
  if (!role || !hasPermission(role, permission)) {
    return deny(res);
  }
  return next();
};

module.exports = {
  ROLES,
  ADMIN_ROLES,
  EMPLOYEE_ROLES,
  permissionsByRole,
  isAdminRole,
  isEmployeeRole,
  hasPermission,
  getDashboardPathByRole,
  requireAdmin,
  requireAnyRole,
  requirePermission
};
