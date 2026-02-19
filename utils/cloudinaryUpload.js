const { Readable } = require("stream");
const { cloudinary, cloudinaryConfigured } = require("../config/cloudinary");

const uploadBuffer = (buffer, options = {}) =>
  new Promise((resolve, reject) => {
    if (!cloudinaryConfigured) {
      return reject(new Error("Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET."));
    }

    const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      return resolve(result);
    });

    Readable.from(buffer).pipe(uploadStream);
  });

module.exports = { uploadBuffer };
