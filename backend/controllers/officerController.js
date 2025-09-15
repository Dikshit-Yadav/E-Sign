const Document = require("../models/Document");
const User = require("../models/User");

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

const uploadSignature = async (req, res) => {
  try {
   const officerId = req.cookies.userId;
    const user = await User.findById(officerId);

    if (!user || user.role !== "officer") {
      return res.status(403).json({ message: "Only officers can upload signatures" });
    }

    user.signature = `/uploads/signatures/${req.file.filename}`;
    await user.save();

    res.json({ message: "Signature uploaded successfully", signature: user.signature });
  } catch (err) {
    console.error("Error uploading signature:", err);
    res.status(500).json({ message: err.message });
  }
};




module.exports = { getOfficerDocuments, uploadSignature};
