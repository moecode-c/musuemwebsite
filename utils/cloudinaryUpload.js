const { Readable } = require("stream");
const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");
const { cloudinary, cloudinaryConfigured } = require("../config/cloudinary");

const sanitizeFolder = (folder) =>
  String(folder || "")
    .replace(/\\/g, "/")
    .split("/")
    .filter((segment) => segment && segment !== "." && segment !== "..")
    .join("/");

const resolveFileExtension = (options = {}) => {
  const fromName = path.extname(options.originalFilename || "").toLowerCase();
  if (fromName) return fromName;

  if (options.resource_type === "image") return ".jpg";
  if (options.resource_type === "raw") return ".bin";
  return ".dat";
};

const uploadBufferToLocal = async (buffer, options = {}) => {
  const relativeFolder = sanitizeFolder(options.folder || "misc");
  const uploadsRoot = path.join(__dirname, "..", "public", "assets", "uploads");
  const folderPath = path.join(uploadsRoot, ...relativeFolder.split("/").filter(Boolean));
  await fs.mkdir(folderPath, { recursive: true });

  const extension = resolveFileExtension(options);
  const fileName = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}${extension}`;
  const fullFilePath = path.join(folderPath, fileName);

  await fs.writeFile(fullFilePath, buffer);

  const publicFolder = relativeFolder ? `${relativeFolder}/` : "";
  const publicUrl = `/assets/uploads/${publicFolder}${fileName}`;

  return {
    secure_url: publicUrl,
    url: publicUrl,
    public_id: fileName,
    resource_type: options.resource_type || "raw"
  };
};

const uploadBufferToCloudinary = (buffer, options = {}) =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      return resolve(result);
    });

    Readable.from(buffer).pipe(uploadStream);
  });

const uploadBuffer = async (buffer, options = {}) => {
  if (!Buffer.isBuffer(buffer)) {
    throw new Error("Upload buffer is required.");
  }

  const requireCloudinary = Boolean(options.requireCloudinary);
  const uploadOptions = { ...options };
  delete uploadOptions.requireCloudinary;

  if (!cloudinaryConfigured) {
    if (requireCloudinary) {
      throw new Error("Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.");
    }
    return uploadBufferToLocal(buffer, uploadOptions);
  }

  try {
    return await uploadBufferToCloudinary(buffer, uploadOptions);
  } catch (error) {
    if (requireCloudinary) {
      throw new Error(`Cloudinary upload failed: ${error.message}`);
    }
    console.warn("Cloudinary upload failed, using local upload fallback:", error.message);
    return uploadBufferToLocal(buffer, uploadOptions);
  }
};

module.exports = { uploadBuffer };
