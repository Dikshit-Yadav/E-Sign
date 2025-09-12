const express = require("express");
const router = express.Router();
const {
  getAllDocuments,
  getDocumentById,
  signDocument,
  rejectDocument,
  saveTemplateData,
  removeDocument,
  getAllOfficers,
} = require("../controllers/documentController");


router.get("/", getAllDocuments);
router.get("/:id", getDocumentById);
router.post("/:id/send", signDocument);
router.put("/:id/reject", rejectDocument);
router.post("/:id/save-template", saveTemplateData);
router.delete("/:id", removeDocument);
router.get("/:id/officers", getAllOfficers);



module.exports = router;
