const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const fs = require("fs");

// ABSOLUTE PATH (VERY IMPORTANT)
const uploadDir = path.join(__dirname, "../public/uploads");

// Create folder if not exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    crypto.randomBytes(12, function(err, name) {
      if (err) return cb(err);
      const filename =
        name.toString("hex") + path.extname(file.originalname).toLowerCase();
      cb(null, filename);
    });
  }
});

// ✅ ALLOW IMAGE + DOCUMENT FILES
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    // Images
    "image/jpeg",
    "image/png",
    "image/gif",

    // Documents
    "application/pdf",
    "application/msword", // .doc
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document" // .docx
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only images (JPG, PNG, GIF) and documents (PDF, DOC, DOCX) are allowed"
      ),
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50 MB
  }
});

module.exports = upload;
