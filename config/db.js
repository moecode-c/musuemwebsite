const mongoose = require("mongoose");
const dns = require("dns");

const DEFAULT_LOCAL_MONGO_URI = "mongodb://127.0.0.1:27017/egyptian_museum";

const configureDns = () => {
  if (!process.env.DNS_SERVERS) {
    return;
  }

  const servers = process.env.DNS_SERVERS
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (!servers.length) {
    return;
  }

  dns.setServers(servers);
};

const getMongoUri = () => {
  return process.env.MONGODB_URI_DIRECT || process.env.MONGODB_URI || DEFAULT_LOCAL_MONGO_URI;
};

const connectDB = async () => {
  configureDns();
  const mongoUri = getMongoUri();
  try {
    await mongoose.connect(mongoUri, { autoIndex: true });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    throw error;
  }
};

module.exports = { configureDns, connectDB, getMongoUri };
