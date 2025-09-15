const express = require("express");
const multer = require("multer");
const router = express.Router();
const {
  getAllDocuments,
  getDocumentById,
  signDocument,
  sendDocumentSign,
  rejectDocument,
  saveTemplateData,
  removeDocument,
  getAllOfficers,
  createDocument,
  getDocumentPreview,
} = require("../controllers/documentController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

router.get("/", getAllDocuments);
router.post("/", upload.single("template"), createDocument);
router.get("/:id", getDocumentById);
router.post("/:id/send", sendDocumentSign);
router.put("/:id/sign",signDocument);
router.put("/:id/reject", rejectDocument);
router.post("/:id/save-template", saveTemplateData);
router.delete("/:id", removeDocument);
router.get("/:id/officers", getAllOfficers);
router.get("/:id/preview", getDocumentPreview);


module.exports = router;