const notFoundHandler = (req, res) => {
  res.status(404).render("404", { pageTitle: "Not Found", message: "Page not found." });
};

const errorHandler = (err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).render("500", {
    pageTitle: "Server Error",
    message: err.message || "Unexpected error occurred."
  });
};

module.exports = { notFoundHandler, errorHandler };
