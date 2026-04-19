const { getTranslations } = require("../utils/i18n");
const { isAdminRole, isEmployeeRole, getDashboardPathByRole } = require("./roles");

const resolvePageCss = (path) => {
  if (path.startsWith("/admin")) {
    return "admin";
  }
  const map = {
    "/": "home",
    "/about": "about",
    "/mission": "mission",
    "/accessibility": "accessibility",
    "/newsletter": "newsletter",
    "/location": "location",
    "/exhibits": "exhibits",
    "/virtual-tour": "virtual-tour",
    "/games": "games",
    "/shop": "shop",
    "/cart": "cart",
    "/checkout": "checkout",
    "/login": "login",
    "/register": "register",
    "/testimonials": "testimonials",
    "/plan-trip": "plan-trip"
  };
  if (path.startsWith("/virtual-tour")) {
    return "virtual-tour";
  }
  if (path.startsWith("/games")) {
    return "games";
  }
  return map[path] || "page";
};

const attachLocals = (req, res, next) => {
  const language = req.cookies.lang || "en";
  const translations = getTranslations(language);
  const nav = translations?.nav || {};

  res.locals.language = language;
  res.locals.t = translations;
  // Keep page direction stable in LTR even when translated content is Arabic.
  res.locals.dir = "ltr";

  
  res.locals.user = req.session.user || null;
  res.locals.isAdminRole = isAdminRole;
  res.locals.isEmployeeRole = isEmployeeRole;
  res.locals.getDashboardPathByRole = getDashboardPathByRole;
  res.locals.cart = req.session.cart || { items: [], total: 0 };
  res.locals.pageCss = resolvePageCss(req.path);
  res.locals.currentPathWithQuery = req.originalUrl || req.path || "/";

  const accountLabel = nav.account || "Account";
  const dashboardLabel = nav.dashboard || "Dashboard";
  const logoutLabel = nav.logout || "Logout";
  const registerLabel = nav.register || "Register";
  const loginLabel = nav.login || "Login";
  const registerLoginLabel = `${registerLabel}/${loginLabel}`;

  const dashboardPath = req.session.user ? getDashboardPathByRole(req.session.user.role) : "/";
  const showDashboardLink = req.session.user && (isAdminRole(req.session.user.role) || isEmployeeRole(req.session.user.role));
  res.locals.authSectionHtml = req.session.user
    ? `
      <div class="nav-item">
        <button class="nav-link nav-trigger" type="button"><i class="nav-icon fas fa-user"></i>${accountLabel}</button>
        <div class="dropdown">
          ${showDashboardLink ? `<a href="${dashboardPath}" class="dropdown-link"><i class="dropdown-icon fas fa-gauge"></i>${dashboardLabel}</a>` : ""}
          <form class="inline-form" action="/auth/logout" method="post">
            <button class="dropdown-link dropdown-button" type="submit"><i class="dropdown-icon fas fa-right-from-bracket"></i>${logoutLabel}</button>
          </form>
        </div>
      </div>
    `
    : `
      <div class="nav-item">
        <button class="nav-link nav-trigger" type="button"><i class="nav-icon fas fa-user"></i>${registerLoginLabel}</button>
        <div class="dropdown">
          <a href="/register" class="dropdown-link"><i class="dropdown-icon fas fa-user-plus"></i>${registerLabel}</a>
          <a href="/login" class="dropdown-link"><i class="dropdown-icon fas fa-right-to-bracket"></i>${loginLabel}</a>
        </div>
      </div>
    `;
  next();
};

module.exports = { attachLocals };
