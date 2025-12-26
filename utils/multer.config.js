const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const fs = require("fs");

// ABSOLUTE PATH (VERY IMPORTANT)
const uploadDir = path.join(__dirname, "../public/uploads");

// create folder if not exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadDir); // ✅ absolute path
  },
  filename: function(req, file, cb) {
    crypto.randomBytes(12, function(err, name) {
      if (err) return cb(err);
      const filename = name.toString("hex") + path.extname(file.originalname);
      cb(null, filename);
    });
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/gif"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, PNG, GIF allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }
});

module.exports = upload;
