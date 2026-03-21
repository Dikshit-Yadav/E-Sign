const path = require("path");
const Document = require("../models/Document");
const { Worker } = require("worker_threads");
const User = require("../models/User");
const Court = require("../models/Court");
const redis = require("../redisClient");
const FormData = require("form-data");
const fs = require("fs");
const fetch = require("node-fetch");
const nodemailer = require("nodemailer");

const createDocument = async (req, res) => {
  try {
    const { title, description, createdBy } = req.body;

    const user = await User.findById(createdBy);
    const courtId = user.court;
    // console.log("courtid",courtId);
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
    // console.log(doc._id)
    await Court.findByIdAndUpdate(
      courtId,
      {
        $push: { documents: doc._id },
        $inc: { documentsCount: 1 },
      },
      { new: true }
    );
    res.status(201).json(doc);
  } catch (err) {
    console.error("Error creating document:", err);
    res.status(500).json({ message: err.message });
  }
};

const getAllDocuments = async (req, res) => {
  try {
    const { userId } = req.query;

    const cacheData = await redis.get(`documents:${userId}`);
    if (cacheData) {
      console.log("from cache");
      return res.send(JSON.parse(cacheData));
    }
    console.log("redis miss")


    const docs = await Document.find({ createdBy: userId })
      .populate("createdBy", "email role")
      .populate("signedBy", "email");

    await redis.setEx(`documents:${userId}`, 60, JSON.stringify(docs));
    res.json(docs);
  } catch (err) {
    console.error("error fetching documents:", err);
    res.status(500).json({ message: err.message });
  }
};

const getDocumentById = async (req, res) => {
  try {
    const { id } = req.params;

    const cacheData = await redis.get(`document:${id}`);
    if (cacheData) {
      console.log("from cache");
      return res.send(JSON.parse(cacheData));
    }
    console.log("redis miss")

    const doc = await Document.findById(id)
      .populate("createdBy", "email")
      .populate("signedBy", "email");

    if (!doc) return res.status(404).json({ message: "Document not found" });

    await redis.setEx(`document:${id}`, 60, JSON.stringify(doc));
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
    console.log(signature);
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
    ).populate("signedBy.officer", "name email")
      .populate("createdBy", "name email");

    const doc = updatedDoc.toObject();
    const template = doc.templates[0];
    console.log("template", template)
    const worker = new Worker(path.join(__dirname, "../workers/signDocumentWorker.js"), {
      workerData: {
        doc,
        template,
        emailConfig: {
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        },
      },
    });

    worker.on("message", (msg) => {
      if (!msg.success) {
        console.error("Email worker failed:", msg.error);
      }
    });

    worker.on("error", (err) => {
      console.error("Worker thread error:", err)
    });
    worker.on("exit", (code) => {
      if (code !== 0) console.error(`Worker stopped with exit code ${code}`);
    });

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

    const cacheData = await redis.get(`preview:${id}`);
    if (cacheData) {
      console.log("from cache");
      return res.send(JSON.parse(cacheData));
    }
    console.log("redis miss")

    const doc = await Document.findById(id)
      .populate("createdBy", "name email")
      .populate("signedBy.officer", "name email");

    if (!doc) return res.status(404).send("Document not found");

    const template = doc.templates[0];
    res.render("documentpreview", { doc, template }, async (err, html) => {
      if (err) {
        return res.status(500).send("Render error");
      }
    });

    await redis.setEx(`preview:${id}`, 60, html);


    res.send(html);
  } catch (err) {
    console.error("Error previewing document:", err);
    res.status(500).send("Failed to preview document");
  }
};

const rejectDocument = async (req, res) => {
  try {
    // console.log("params:", req.params);

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
    const { id } = req.params;

    const cacheData = await redis.get(`officers:${id}`);
    if (cacheData) {
      console.log("from cache");
      return res.send(JSON.parse(cacheData));
    }
    console.log("redis miss")

    const doc = await Document.findById(id)
      .populate("createdBy", "name email")
      .populate("readers", "name email")
      .populate("signedBy", "name email")
      .populate("court")
      .populate({
        path: 'court',
        populate: { path: 'officers', select: 'name email' }
      });

    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    if (!doc.court) {
      return res.status(400).json({ message: "This document has no court assigned" });
    }

    if (doc.court.officers.length === 0) {
      return res.status(404).json({ message: "No officers found for this court" });
    }
    await redis.setEx(`officers:${id}`, 60, JSON.stringify(doc.court.officers));

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