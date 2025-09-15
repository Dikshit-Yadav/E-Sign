const path = require("path");
const Document = require("../models/Document");
const User = require("../models/User");
const Court = require("../models/Court");

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
    const docs = await Document.find({ createdBy: userId })
      .populate("createdBy", "email role")
      .populate("signedBy", "email");
    res.json(docs);
  } catch (err) {
    console.error("error fetching documents:", err);
    res.status(500).json({ message: err.message });
  }
};

const getDocumentById = async (req, res) => {
  try {
    // console.log(req.params)
    const doc = await Document.findById(req.params.id)
      .populate("createdBy", "email")
      .populate("signedBy", "email");

    if (!doc) return res.status(404).json({ message: "Document not found" });
    res.json(doc);
  } catch (err) {
    console.error("error fetching document:", err);
    res.status(500).json({ message: err.message });
  }
};

const sendDocumentSign = async (req, res) => {
  try {
    const { officerId } = req.body;
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "document not found" });

    doc.status = "pending-signature";
    doc.assignedOfficer = officerId;
    await doc.save();

    res.json({ message: "document sent for signature", doc });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const UpdateSignDocument = async (req, res) => {
  try {
    const officerId = req.cookies.userId;
    const doc = await Document.findById(req.params.id);

    if (!doc) return res.status(404).json({ message: "Document not found" });
    if (doc.assignedOfficer.toString() !== officerId) {
      return res.status(403).json({ message: "Not authorized to sign this document" });
    }

    doc.status = "signed";
    await doc.save();

    res.json({ message: "Document signed successfully", doc });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const removeDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "document not found" });

    await doc.deleteOne();
    res.json({ message: "document removed " });
  } catch (err) {
    console.error("Error removing document:", err);
    res.status(500).json({ message: err.message });
  }
};

const signDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { signature } = req.body;
    const officerId = req.cookies.userId;
    const updatedDoc = await Document.findByIdAndUpdate(
      id,
      {
        signedBy: {
          officer: officerId,
          signature,
          signedAt: new Date(),
        },
        status: "signed",
      },
      { new: true }
    ).populate("signedBy.officer", "name email");

    res.status(200).json({
      message: "Document signed successfully",
      signedBy: updatedDoc.signedBy,
    });
  } catch (err) {
    console.error("Error signing document:", err);
    res.status(500).json({ message: "Failed to sign document" });
  }
};

const getDocumentPreview = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || id.length !== 24) {
      return res.status(400).json({ message: "Invalid document ID" });
    }

    const doc = await Document.findById(id)
      .populate("createdBy", "name email")
      .populate("signedBy.officer", "name email");

    if (!doc) return res.status(404).send("Document not found");

    const template = doc.templates[0];
    // const baseUrl = `${req.protocol}://${req.get("host")}`;
    // console.log(`${baseUrl} ${doc.signedBy.signature}`);

    let html = `
<html>
  <head>
    <title>Document Preview - ${doc.title}</title>
    <style>
      body {
        font-family: "Times New Roman", serif;
        margin: 50px auto;
        max-width: 800px;
        padding: 40px;
        background: #fff;
        border: 1px solid #ccc;
        box-shadow: 0px 0px 10px rgba(0,0,0,0.15);
      }
      h1 {
        text-align: center;
        text-transform: uppercase;
        font-size: 24px;
        margin-bottom: 30px;
        border-bottom: 2px solid #000;
        padding-bottom: 8px;
      }
      .field {
        margin-bottom: 14px;
        font-size: 16px;
        display: flex;
        justify-content: space-between;
        border-bottom: 1px dashed #bbb;
        padding: 4px 0;
      }
      .label {
        font-weight: bold;
        flex: 0 0 150px;
      }
      .value {
        flex: 1;
        text-align: right;
      }
      .signature-section {
        margin-top: 50px;
        text-align: left;
      }
      .signature-box {
        display: inline-block;
        border-top: 1px solid #000;
        margin-top: 50px;
        padding-top: 5px;
        font-size: 14px;
        text-align: center;
      }
      .signature-section img {
        display: block;
        margin-top: 10px;
        max-width: 180px;
        border: 1px solid #ccc;
        padding: 4px;
        border-radius: 4px;
        background: #fafafa;
      }
    </style>
  </head>
  <body>
    <h1>${doc.title || "Court Document"}</h1>

    <div class="field"><span class="label">Date:</span><span class="value">${doc.createdAt.toISOString().split("T")[0]}</span></div>
    <div class="field"><span class="label">Customer:</span><span class="value">${doc.createdBy?.name || "N/A"}</span></div>
    <div class="field"><span class="label">Amount:</span><span class="value">${template?.amount || "N/A"}</span></div>
    <div class="field"><span class="label">Due Date:</span><span class="value">${template?.dueDate || "N/A"}</span></div>
    <div class="field"><span class="label">Address:</span><span class="value">${template?.address || "N/A"}</span></div>
    <div class="field"><span class="label">Court:</span><span class="value">${template?.court || "N/A"}</span></div>
    <div class="field"><span class="label">Case ID:</span><span class="value">${template?.caseId || "N/A"}</span></div>

    <div class="signature-section">
      <h3>Authorized Signature</h3>
      ${doc.signedBy?.officer
        ? `
            <div class="signature-box">
              <strong>${doc.signedBy.officer.name}</strong><br/>
              <small>Signed on: ${doc.signedBy.signedAt ? new Date(doc.signedBy.signedAt).toLocaleString() : "N/A"}</small>
              <img src="${doc.signedBy.signature}" alt="Signature" />
            </div>
          `
        : "<p>No signature provided yet.</p>"
      }
    </div>
  </body>
</html>
`;


    res.send(html);
  } catch (err) {
    console.error("Error previewing document:", err);
    res.status(500).send("Failed to preview document");
  }
};

const rejectDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "document not found" });

    doc.status = "rejected";
    doc.rejectedDocuments += 1;
    await doc.save();

    res.json({ message: "document rejected", doc });
  } catch (err) {
    console.error("error rejecting document:", err);
    res.status(500).json({ message: err.message });
  }
};

const saveTemplateData = async (req, res) => {
  try {
    const { documentId, templates } = req.body;

    const doc = await Document.findById(documentId);
    if (!doc) return res.status(404).json({ message: "document not found" });

    doc.templates = templates;
     doc.signedBy = {
      officer: null,
      signature: null,
      signedAt: new Date(),
    };
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
      .populate("signedBy", "name email")
      .populate("court")  
      .populate({
        path: 'court',
        populate: { path: 'officers', select: 'name email' }
      });

    // console.log("Document fetched:", doc);
    // console.log("Document Court:", doc.court);
    // console.log("Officers for this court:", doc.court.officers);

    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    if (!doc.court) {
      return res.status(400).json({ message: "This document has no court assigned" });
    }

    if (doc.court.officers.length === 0) {
      return res.status(404).json({ message: "No officers found for this court" });
    }

    res.json(doc.court.officers);
  } catch (err) {
    console.error("Error fetching officers:", err);
    res.status(500).json({ message: err.message });
  }
};


module.exports = {
  saveTemplateData,
  createDocument,
  getAllDocuments,
  getDocumentById,
  signDocument,
  sendDocumentSign,
  rejectDocument,
  removeDocument,
  getAllOfficers,
  UpdateSignDocument,
  getDocumentPreview,
}