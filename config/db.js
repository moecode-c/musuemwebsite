const mongoose = require("mongoose");
const dns = require("dns");

const configureDns = () => {
  const servers = process.env.DNS_SERVERS
    ? process.env.DNS_SERVERS.split(",").map((s) => s.trim()).filter(Boolean)
    : ["8.8.8.8", "1.1.1.1"];
  if (servers.length) {
    dns.setServers(servers);
  }
};

const connectDB = async () => {
  configureDns();
  const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/egyptian_museum";
  try {
    await mongoose.connect(mongoUri, { autoIndex: true });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = { connectDB };
