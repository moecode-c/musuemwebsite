const path = require("path");
const fs = require("fs");
const os = require("os");
const http = require("http");
const https = require("https");
const express = require("express");
const mongoose = require("mongoose");
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

const { configureDns, connectDB, getMongoUri } = require("./config/db");
const { attachLocals } = require("./middleware/locals");
const { notFoundHandler, errorHandler } = require("./middleware/error");

const pageRoutes = require("./routes/pages");
const authRoutes = require("./routes/auth");
const exhibitRoutes = require("./routes/exhibits");
const productRoutes = require("./routes/products");
const mapRoutes = require("./routes/mapPins");
const ticketRoutes = require("./routes/tickets");
const ticketRequestRoutes = require("./routes/ticketRequests");
const testimonialRoutes = require("./routes/testimonials");
const userRoutes = require("./routes/users");
const orderRoutes = require("./routes/orders");
const assistanceRoutes = require("./routes/assistance");
const taskRoutes = require("./routes/tasks");
const cleaningZoneRoutes = require("./routes/cleaningZones");
const cartRoutes = require("./routes/cart");
const newsletterRoutes = require("./routes/newsletter");
const adminRoutes = require("./routes/admin");

const app = express();
configureDns();
const mongoUri = getMongoUri();
const dbConnectPromise = connectDB();

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
app.use("/vendor/fontawesome", express.static(path.join(__dirname, "node_modules", "@fortawesome", "fontawesome-free")));
app.use("/vendor/model-viewer", express.static(path.join(__dirname, "node_modules", "@google", "model-viewer", "dist")));
app.use("/vendor/three", express.static(path.join(__dirname, "node_modules", "three")));

app.get("/audio/pharoahVirtualaudio.mp3", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "virtual-tour", "pharoahVirtualaudio.mp3"));
});

app.get("/audio/islamicVirtualaudio.mp3", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "virtual-tour", "islamicVirtualaudio.mp3"));
});

app.get("/audio/christianVirtualaudio.mp3", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "virtual-tour", "ChrtistianVirtualaudio.mp3"));
});

app.get("/virtual-tour/Afterlife-museum-brochure.pdf", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "virtual-tour", "Afterlife-museum-brochure.pdf"));
});

app.use(
  session({
    secret: process.env.SESSION_SECRET || "change_this_secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      clientPromise: dbConnectPromise.then(() => mongoose.connection.getClient()),
      ttl: 60 * 60 * 24 * 7
    }),
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7
    }
  })
);

const resolveSafeReturnTo = (rawPath) => {
  if (typeof rawPath !== "string") return "/";

  const trimmed = rawPath.trim();
  if (!trimmed.startsWith("/")) return "/";
  if (trimmed.startsWith("//") || trimmed.startsWith("/\\")) return "/";

  return trimmed;
};

app.get("/lang/:lang", (req, res) => {
  const lang = req.params.lang === "ar" ? "ar" : "en";
  const returnTo = resolveSafeReturnTo(req.query.returnTo || req.get("Referrer") || "/");

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

  res.redirect(returnTo);
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
app.use("/api/orders", orderRoutes);
app.use("/api/assistance", assistanceRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/cleaning-zones", cleaningZoneRoutes);
app.use("/cart", cartRoutes);
app.use("/newsletter", newsletterRoutes);
app.use("/admin", adminRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const startPort = Number(process.env.PORT) || 3000;
const startHost = process.env.HOST || "0.0.0.0";

const resolveProjectPath = (targetPath) => {
  if (!targetPath || typeof targetPath !== "string") return null;
  return path.isAbsolute(targetPath) ? targetPath : path.join(__dirname, targetPath);
};

const getTlsOptions = () => {
  if (process.env.HTTPS !== "true") return null;

  const keyPath = resolveProjectPath(process.env.SSL_KEY_PATH || "certs/localhost-key.pem");
  const certPath = resolveProjectPath(process.env.SSL_CERT_PATH || "certs/localhost.pem");

  if (!keyPath || !certPath || !fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
    throw new Error([
      "HTTPS is enabled but SSL certificate files were not found.",
      `Expected key: ${keyPath}`,
      `Expected cert: ${certPath}`,
      "Generate certificates and set SSL_KEY_PATH and SSL_CERT_PATH correctly."
    ].join("\n"));
  }

  try {
    return {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath)
    };
  } catch (error) {
    throw new Error(`Failed to read HTTPS certificate files: ${error.message}`);
  }
};

const getLanAddresses = () => {
  const interfaces = os.networkInterfaces();
  const addresses = [];

  Object.values(interfaces).forEach((entries) => {
    (entries || []).forEach((entry) => {
      if (!entry || entry.internal || entry.family !== "IPv4") return;
      addresses.push(entry.address);
    });
  });

  return [...new Set(addresses)];
};

const startServer = (port, tlsOptions, host) => {
  const protocol = tlsOptions ? "https" : "http";
  const server = tlsOptions ? https.createServer(tlsOptions, app) : http.createServer(app);

  server.listen(port, host, () => {
    console.log(`Server running on ${protocol}://localhost:${port}`);

    if (host === "0.0.0.0" || host === "::") {
      const lanAddresses = getLanAddresses();
      lanAddresses.forEach((address) => {
        console.log(`Server running on ${protocol}://${address}:${port}`);
      });
    } else if (host !== "localhost" && host !== "127.0.0.1") {
      console.log(`Server running on ${protocol}://${host}:${port}`);
    }
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      const nextPort = port + 1;
      console.warn(`Port ${port} is in use. Trying ${nextPort}...`);
      startServer(nextPort, tlsOptions, host);
      return;
    }

    throw error;
  });
};

const bootstrap = async () => {
  try {
    await dbConnectPromise;
    const tlsOptions = getTlsOptions();
    startServer(startPort, tlsOptions, startHost);
  } catch (error) {
    console.error(error.message || error);
    process.exit(1);
  }
};

bootstrap();
