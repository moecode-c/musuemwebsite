const { Readable } = require("stream");
const { cloudinary } = require("../config/cloudinary");

const uploadBuffer = (buffer, options = {}) =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      return resolve(result);
    });

    Readable.from(buffer).pipe(uploadStream);
  });

module.exports = { uploadBuffer };
