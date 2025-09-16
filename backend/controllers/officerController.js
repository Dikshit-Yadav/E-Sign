const Document = require("../models/Document");
const User = require("../models/User");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");

const getOfficerDocuments = async (req, res) => {
  try {
   const officerId = req.cookies.userId;
    // console.log(officerId);
    const docs = await Document.find({ assignedOfficer: officerId })
      .populate("createdBy", "name email")
      .sort({ updatedAt: -1 });
      // console.log(docs)
    res.json(docs);
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: err.message });
  }
};

// const uploadSignature = async (req, res) => {
//   try {
//    const officerId = req.cookies.userId;
//     const user = await User.findById(officerId);

//     if (!user || user.role !== "officer") {
//       return res.status(403).json({ message: "Only officers can upload signatures" });
//     }

//     user.signature = `/uploads/signatures/${req.file.filename}`;
//     await user.save();

//     res.json({ message: "Signature uploaded successfully", signature: user.signature });
//   } catch (err) {
//     console.error("Error uploading signature:", err);
//     res.status(500).json({ message: err.message });
//   }
// };



const uploadSignature = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const officerId = req.cookies.userId;
    const user = await User.findById(officerId);
    if (!user || user.role !== "officer") {
      return res.status(403).json({ message: "Only officers can upload signatures" });
    }

    const filePath = req.file.path;
    const fileStream = fs.createReadStream(filePath);
    const formData = new FormData();
    formData.append("image", fileStream, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
      knownLength: req.file.size,
    });

    const response = await axios.post("http://localhost:5000/remove-bg", formData, {
      headers: formData.getHeaders(),
      responseType: "arraybuffer",
    });

    const outputDir = path.join(__dirname, "../uploads/signature");
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const outputFilename = `signature-${Date.now()}.png`;
    const outputPath = path.join(outputDir, outputFilename);
    fs.writeFileSync(outputPath, Buffer.from(response.data));

    fs.unlinkSync(filePath);

    user.signature = `/uploads/signature/${outputFilename}`;
    await user.save();
    res.json({ success: true, message: "Signature uploaded successfully", signature: user.signature });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};




module.exports = { getOfficerDocuments, uploadSignature};
