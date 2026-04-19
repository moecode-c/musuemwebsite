const { v2: cloudinary } = require("cloudinary");

const requiredEnv = [
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET"
];

const missing = requiredEnv.filter((key) => !process.env[key]);
const isProduction = process.env.NODE_ENV === "production";

if (missing.length > 0 && isProduction) {
  throw new Error(`Missing Cloudinary environment variables: ${missing.join(", ")}`);
}

const cloudinaryConfigured = missing.length === 0;

if (cloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

  console.log("Cloudinary connected");
} else {
  console.warn(
    `Cloudinary is not configured. Missing: ${missing.join(", ")}. Upload features are disabled.`
  );
}

module.exports = { cloudinary, cloudinaryConfigured };
