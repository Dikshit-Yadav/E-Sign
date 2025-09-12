const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema(
  {
    readers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    court: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Court",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    signedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

     assignedOfficer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    status: {
      type: String,
      enum: ["draft", "pending-signature", "signed", "rejected"],
      default: "draft",
    },

    numberOfDocuments: {
      type: Number,
      default: 0,
    },

    rejectedDocuments: {
      type: Number,
      default: 0,
    },

    templates: [
      {
        date: String,
        customer: String,
        amount: String,
        dueDate: String,
        address: String,
        court: String,
        caseId: String,
      },
    ],

  },

  { timestamps: true }
);

module.exports = mongoose.model("Document", DocumentSchema);
