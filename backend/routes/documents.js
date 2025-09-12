const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  downloadTemplate,
  createDocument,
  getAllDocuments,
  getDocumentById,
  signDocument,
  rejectDocument,
  saveTemplateData,
  removeDocument,
  getAllOfficers,
} = require("../controllers/documentController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

router.get("/templates/invoice.docx", downloadTemplate);
router.post("/", upload.single("template"), createDocument);
router.get("/", getAllDocuments);//done
router.get("/:id", getDocumentById);//done
router.post("/:id/send", signDocument);//done

router.put("/:id/reject", rejectDocument);
router.post("/:id/save-template", saveTemplateData);//done

router.delete("/:id", removeDocument);//done
router.get("/:id/officers", getAllOfficers);//done



module.exports = router;
