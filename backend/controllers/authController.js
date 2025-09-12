const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const  login=     async (req, res) => {
      try {
        const { email, password, role } = req.body;
        // console.log(req.body);
        // const allUsers = await User.find({});
// console.log("All users in DB:", allUsers);

        const user = await User.findOne({ email });
        // console.log(user)
        if (!user) return res.status(400).json({ message: "Invalid credentials" });
    
       if (user.password !== password) {
      console.log("Incorrect password");
      return res.status(400).json({ message: "Invalid credentials" });
    }
    
        if (user.role !== role) {
          return res.status(403).json({ message: "Role mismatch" });
        }
    
        const token = jwt.sign(
          { id: user._id, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: "1d" }
        );
    
        res.json({
          token,
          user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
      } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message });
      }
    }

module.exports = login;