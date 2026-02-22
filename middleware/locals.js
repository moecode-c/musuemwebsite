const { getTranslations } = require("../utils/i18n");

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
  const language = req.session.language || "en";
  
  res.locals.language = language;
res.locals.t = getTranslations(language);
res.locals.dir = language === "ar" ? "rtl" : "ltr";

  
  res.locals.user = req.session.user || null;
  res.locals.cart = req.session.cart || { items: [], total: 0 };
  res.locals.pageCss = resolvePageCss(req.path);
  res.locals.authSectionHtml = req.session.user
    ? `
      <div class="nav-item">
        <button class="nav-link nav-trigger" type="button"><i class="nav-icon fas fa-user"></i>Account</button>
        <div class="dropdown">
          ${req.session.user.role === "admin" ? '<a href="/admin/dashboard" class="dropdown-link"><i class="dropdown-icon fas fa-gauge"></i>Dashboard</a>' : ""}
          <form class="inline-form" action="/auth/logout" method="post">
            <button class="dropdown-link dropdown-button" type="submit"><i class="dropdown-icon fas fa-right-from-bracket"></i>Logout</button>
          </form>
        </div>
      </div>
    `
    : `
      <div class="nav-item">
        <button class="nav-link nav-trigger" type="button"><i class="nav-icon fas fa-user"></i>Register/Login</button>
        <div class="dropdown">
          <a href="/register" class="dropdown-link"><i class="dropdown-icon fas fa-user-plus"></i>Register</a>
          <a href="/login" class="dropdown-link"><i class="dropdown-icon fas fa-right-to-bracket"></i>Login</a>
        </div>
      </div>
    `;
  next();
};

module.exports = { attachLocals };
