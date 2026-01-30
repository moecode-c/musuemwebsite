const { getTranslations } = require("../utils/i18n");

const attachLocals = (req, res, next) => {
  const language = req.session.language || "en";
  res.locals.language = language;
  res.locals.t = getTranslations(language);
  res.locals.user = req.session.user || null;
  res.locals.cart = req.session.cart || { items: [], total: 0 };
  res.locals.authLinksHtml = req.session.user
    ? `
      <a href="/admin/dashboard" class="nav-link">${res.locals.t.nav.dashboard}</a>
      <form class="inline-form" action="/auth/logout" method="post">
        <button class="nav-link" type="submit">Logout</button>
      </form>
    `
    : `
      <a href="/login" class="nav-link">${res.locals.t.nav.login}</a>
      <a href="/register" class="nav-link">${res.locals.t.nav.register}</a>
    `;
  next();
};

module.exports = { attachLocals };
