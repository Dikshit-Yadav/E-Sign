const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "officer", "reader"], 
    required: true,
  },
  court: { type: mongoose.Schema.Types.ObjectId, ref: "Court", default: null },
  signature: { type: String, default: null }
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
