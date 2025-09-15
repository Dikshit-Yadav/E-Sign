const multer = require("multer");
const path = require("path");


const fs = require("fs");
const uploadDir = path.join(__dirname, "../uploads/signatures");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); 
  },
  filename: function (req, file, cb) {
    cb(
      null,
      "signature-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/png", "image/jpeg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PNG/JPEG images allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
