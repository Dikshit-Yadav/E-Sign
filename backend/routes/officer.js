const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadSignature");
const User = require("../models/User");
const { getOfficerDocuments, uploadSignature} = require("../controllers/officerController");
const { UpdateSignDocument, rejectDocument} = require("../controllers/documentController");


router.get("/documents", getOfficerDocuments);
router.put("/documents/:id/sign", UpdateSignDocument);
router.put("/documents/:id/reject", rejectDocument);
router.post("/upload-signature", upload.single("signature"), uploadSignature);


module.exports = router;
