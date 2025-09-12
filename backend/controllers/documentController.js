const path = require("path");
const Document = require("../models/Document");
const User = require("../models/User");
const Court = require("../models/Court");

const downloadTemplate = (req, res) => {
  const filePath = path.join(__dirname, "../templates", "invoice.docx");
  res.download(filePath, "invoice.docx", (err) => {
    if (err) {
      console.error("Error sending file:", err);
      res.status(500).send("Error downloading template");
    }
  });
};

const createDocument = async (req, res) => {
  try {
    const { title, description, createdBy } = req.body;

    const user = await User.findById(createdBy);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const doc = new Document({
      title,
      description,
      createdBy,
      court: user.court,  
      status: "draft",
      numberOfDocuments: 1,
      rejectedDocuments: 0,
    });

    await doc.save();
    res.status(201).json(doc);
  } catch (err) {
    console.error("Error creating document:", err);
    res.status(500).json({ message: err.message });
  }
};


const getAllDocuments = async (req, res) => {
  try {
    const { userId } = req.query;
    const docs = await Document.find({createdBy: userId})
      .populate("createdBy", "email role")
      .populate("signedBy", "email");
    res.json(docs);
  } catch (err) {
    console.error("Error fetching documents:", err);
    res.status(500).json({ message: err.message });
  }
};

const getDocumentById = async (req, res) => {
  try {
    console.log(req.params)
    const doc = await Document.findById(req.params.id)
      .populate("createdBy", "email")
      .populate("signedBy", "email");

    if (!doc) return res.status(404).json({ message: "Document not found" });
    res.json(doc);
  } catch (err) {
    console.error("Error fetching document:", err);
    res.status(500).json({ message: err.message });
  }
};
const signDocument = async (req, res) => {
  try {
    const { officerId } = req.body;
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    doc.status = "pending-signature";
    doc.assignedOfficer = officerId; 
    await doc.save();

    res.json({ message: "Document sent for signature", doc });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const removeDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    await doc.deleteOne();
    res.json({ message: "Document removed successfully" });
  } catch (err) {
    console.error("Error removing document:", err);
    res.status(500).json({ message: err.message });
  }
};


const rejectDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    doc.status = "rejected";
    doc.rejectedDocuments += 1;
    await doc.save();

    res.json({ message: "Document rejected", doc });
  } catch (err) {
    console.error("Error rejecting document:", err);
    res.status(500).json({ message: err.message });
  }
};

const saveTemplateData = async (req, res) => {
  try {
    const { documentId, templates } = req.body;

    const doc = await Document.findById(documentId);
    if (!doc) return res.status(404).json({ message: "Document not found" });

     doc.templates = templates; 
    await doc.save();

    res.json({ message: "Template data saved", doc });
  } catch (err) {
    console.error("Error saving template data:", err);
    res.status(500).json({ message: err.message });
  }
};

const getAllOfficers = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("readers", "name email")
      .populate("signedBy", "name email");

    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    if (!doc.court) {
      return res.status(400).json({ message: "This document has no court assigned" });
    }

    const officers = await User.find({ role: "officer", court: doc.court })
                               .select("name email");

    res.json(officers);
  } catch (err) {
    console.error("Error fetching officers:", err);
    res.status(500).json({ message: err.message });
  }
};


module.exports = {
  saveTemplateData,
  downloadTemplate,
  createDocument,
  getAllDocuments,
  getDocumentById,
  signDocument,
  rejectDocument,
  removeDocument,
  getAllOfficers,
}