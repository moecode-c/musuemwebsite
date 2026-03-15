const path = require("path");
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
const dotenv = require("dotenv");

dotenv.config();

require("./config/cloudinary");

const { connectDB } = require("./config/db");
const { attachLocals } = require("./middleware/locals");
const { notFoundHandler, errorHandler } = require("./middleware/error");

const { makeT } = require("./utils/i18n");

const pageRoutes = require("./routes/pages");
const authRoutes = require("./routes/auth");
const exhibitRoutes = require("./routes/exhibits");
const productRoutes = require("./routes/products");
const mapRoutes = require("./routes/mapPins");
const ticketRoutes = require("./routes/tickets");
const ticketRequestRoutes = require("./routes/ticketRequests");
const testimonialRoutes = require("./routes/testimonials");
const userRoutes = require("./routes/users");
const cartRoutes = require("./routes/cart");
const newsletterRoutes = require("./routes/newsletter");
const adminRoutes = require("./routes/admin");

const app = express();

connectDB();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "change_this_secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl:
        process.env.MONGODB_URI ||
        "mongodb://127.0.0.1:27017/egyptian_museum",
      ttl: 60 * 60 * 24 * 7
    }),
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7
    }
  })
);

app.get("/lang/:lang", (req, res) => {
  const lang = req.params.lang === "ar" ? "ar" : "en";

  res.cookie("lang", lang, {
    maxAge: 1000 * 60 * 60 * 24 * 365,
    httpOnly: true,
    sameSite: "lax"
  });

  res.cookie("lang_js", lang, {
    maxAge: 1000 * 60 * 60 * 24 * 365,
    httpOnly: false,
    sameSite: "lax"
  });

  res.redirect("back");
});
app.use((req, res, next) => {
  const language = req.cookies.lang || "en";

  res.locals.language = language;
  res.locals.dir = language === "ar" ? "rtl" : "ltr";
  res.locals.t = makeT(language);

  next();
});

app.use(attachLocals);

app.use("/", pageRoutes);
app.use("/auth", authRoutes);
app.use("/api/exhibits", exhibitRoutes);
app.use("/api/products", productRoutes);
app.use("/api/map-pins", mapRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/ticket-requests", ticketRequestRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/users", userRoutes);
app.use("/cart", cartRoutes);
app.use("/newsletter", newsletterRoutes);
app.use("/admin", adminRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});