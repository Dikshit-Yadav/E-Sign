const express = require("express");
const multer = require("multer");
const router = express.Router();
const cache =require("../middlewares/cachMiddleware");
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

router.get("/", cache(`documents:${req.query.userId}`), getAllDocuments);
router.post("/", upload.single("template"), createDocument);
router.get("/:id",cache((req)=>`document:${req.params.id}`), getDocumentById);
router.post("/:id/send", sendDocumentSign);
router.put("/:id/sign",signDocument);
router.put("/:id/reject", rejectDocument);
router.post("/:id/save-template", saveTemplateData);
router.delete("/:id", removeDocument);
router.get("/:id/officers",cache((req)=>`offcers:${req.params.id}`), getAllOfficers);
router.get("/:id/preview",cache((req)=>`preview:${req.params.id}`), getDocumentPreview);


module.exports = router;