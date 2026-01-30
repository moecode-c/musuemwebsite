const requireAdmin = (req, res, next) => {
  if (!req.session.user || req.session.user.role !== "admin") {
    return res.status(403).render("404", { pageTitle: "Forbidden", message: "Access denied." });
  }
  return next();
};

module.exports = { requireAdmin };
