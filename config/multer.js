const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "public", "assets", "uploads"));
  },
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${unique}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedImages = [".jpg", ".jpeg", ".png", ".webp"];
  const allowedModels = [".glb", ".gltf"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (file.fieldname === "image") {
    return allowedImages.includes(ext) ? cb(null, true) : cb(new Error("Invalid image type"));
  }

  if (file.fieldname === "model") {
    return allowedModels.includes(ext) ? cb(null, true) : cb(new Error("Invalid 3D model type"));
  }

  cb(new Error("Invalid file field"));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
});

const memoryUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
});

module.exports = { upload, memoryUpload };
