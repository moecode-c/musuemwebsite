const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  return next();
};

const requireGuest = (req, res, next) => {
  if (req.session.user) {
    return res.redirect("/");
  }
  return next();
};

module.exports = { requireAuth, requireGuest };
