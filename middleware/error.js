const notFoundHandler = (req, res) => {
  res.status(404).render("404", { pageTitle: "Not Found", message: "Page not found." });
};

const errorHandler = (err, req, res, next) => {
  console.error(err);
  const status = err.status || (err.name === "MulterError" ? 400 : 500);
  const message = err.message || "Unexpected error occurred.";

  if (req.originalUrl.startsWith("/api/")) {
    return res.status(status).json({ message });
  }

  res.status(status).render("500", {
    pageTitle: "Server Error",
    message
  });
};

module.exports = { notFoundHandler, errorHandler };
