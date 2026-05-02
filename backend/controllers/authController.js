const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    const role = user.role;
    console.log(role)
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    if (user.password !== password) {
      console.log("Incorrect password");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // if (user.role !== role) {
    //   return res.status(403).json({ message: "Role mismatch" });
    // }

    const token = jwt.sign(
      { id: user._id, role: role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("userId", user._id.toString(), {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000
    });

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: role }
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message });
  }
}

const logout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    res.clearCookie("role", {
     httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    res.clearCookie("userId", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ message: "Logout failed" });
  }
};

module.exports = { login, logout };
