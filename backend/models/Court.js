const mongoose = require("mongoose");

const CourtSchema = new mongoose.Schema({
  courtName: { type: String, required: true },
  courtDesc: { type: String },
  courtLocation: { type: String },
  officers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  readers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  documents: { type: Number, default: 0 },
  officerCount: { type: Number, default: 0 },
  readerCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Court", CourtSchema);
