const { getDashboardPathByRole } = require("./roles");

const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  return next();
};

// For AJAX/fetch endpoints: respond with 401 JSON instead of redirecting,
// so the client can handle it (e.g. send the user to /login).
const requireAuthApi = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Please log in to continue.", redirect: "/login" });
  }
  return next();
};

const requireGuest = (req, res, next) => {
  if (req.session.user) {
    return res.redirect(getDashboardPathByRole(req.session.user.role));
  }
  return next();
};

module.exports = { requireAuth, requireAuthApi, requireGuest };
