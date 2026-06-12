const Document = require("../models/Document");
const User = require("../models/User");
const path = require("path");
const redis = require("../redisClient");
const fs = require("fs");
const sharp = require("sharp");
const axios = require("axios");
const FormData = require("form-data");

const getOfficerDocuments = async (req, res) => {
  try {
    const officerId = req.cookies.userId;
    const cacheData = await redis.get(`documents:${officerId}`);
    if (cacheData) {
      console.log("from cache");
      return res.send(JSON.parse(cacheData));
    }
    console.log("redis miss")
    const docs = await Document.find({ assignedOfficer: officerId })
      .populate("createdBy", "name email")
      .sort({ updatedAt: -1 });
      await redis.setEx(`documents:${officerId}`, 60, JSON.stringify(docs));
    res.json(docs);
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: err.message });
  }
};

const uploadSignature = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const officerId = req.cookies.userId;
    const user = await User.findById(officerId);

    if (!user || user.role !== "officer") {
      return res.status(403).json({ message: "Only officers can upload signatures" });
    }

    const filePath = req.file.path;
    const outputDir = path.join(__dirname, "../uploads/signature");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputFilename = `signature-${Date.now()}.png`;
    const outputPath = path.join(outputDir, outputFilename);

    await sharp(filePath)
      .trim()
      .ensureAlpha()
      .linear(1, -128)
      .threshold(128)
      .png()
      .toFile(outputPath);

    fs.unlinkSync(filePath);

    user.signature = `/uploads/signature/${outputFilename}`;
    await user.save();

    res.json({ message: "Signature uploaded successfully", signature: user.signature });
  } catch (err) {
    console.error("Error uploading signature:", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getOfficerDocuments, uploadSignature };