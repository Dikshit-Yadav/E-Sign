const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("name email role");
    if (!user) return res.status(404).json({ message: "user not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;