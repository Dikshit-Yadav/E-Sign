const express = require("express");
const Court = require("../models/Court");
const User = require("../models/User");
const nodemailer = require("nodemailer");
const Document = require("../models/Document");

const users = async (req, res) => {
  try {
    const { role, email, password } = req.body;

    const newUser = new User({ role, email, password });
    await newUser.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Court E-Sign" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Court E-Sign Account",
      html: `
        <h3>Welcome to Court E-Sign</h3>
        <p>Your login credentials:</p>
        <ul>
          <li><b>Email:</b> ${email}</li>
          <li><b>Password:</b> ${password}</li>
          <li><b>Role:</b> ${role}</li>
        </ul>
        <p>Please login .</p>
      `,
    });

    res.status(201).json({ message: "User created & email sent", user: newUser });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

const addCourts = async (req, res) => {
  // console.log(req.body);
  const { courtName, courtDesc, courtLocation } = req.body;
  if (!courtName || !courtLocation) {
    return res.status(400).json({ message: "court  and location required." });
  }

  try {
    const newCourt = new Court({
      courtName,
      courtDesc,
      courtLocation,
    });
    await newCourt.save();
    res.status(201).json({ message: "court added", court: newCourt });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getCourts = async (req, res) => {
  try {
    const courts = await Court.find().populate("officers")
      .populate("readers");
    console.log(courts)

    const courtsWithCounts = courts.map(court => ({
      _id: court._id,
      courtName: court.courtName,
      courtDesc: court.courtDesc,
      courtLocation: court.courtLocation,
      createdAt: court.createdAt,
      officersCount: court.officers ? court.officers.length : 0,
      readersCount: court.readers ? court.readers.length : 0,
      documentsCount: court.documents ? court.documents.length : 0,
    }));

    res.json(courtsWithCounts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const courtId = async (req, res) => {
  try {
    const court = await Court.findById(req.params.id)
      .populate("officers")
      .populate("readers");

    if (!court) return res.status(404).json({ message: "Court not found" });

    res.json(court);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteCourt = async (req, res) => {
  try {
    const deletedCourt = await Court.findByIdAndDelete(req.params.id);
    if (!deletedCourt) return res.status(404).json({ message: "court not found" });

    res.json({ message: "court deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const { role } = req.query;

    let filter = {};
    if (role) {
      filter.role = role;
    }

    const users = await User.find(filter).select("name email role");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const courtDetails = async (req, res) => {
  try {
    const court = await Court.findById(req.params.id)
      .populate("officers", "email role")
      .populate("readers", "email role");

    if (!court) return res.status(404).json({ message: "court not found" });

    const docsCount = await Document.countDocuments({ court: court._id });

    res.json({
      message: "Court details fetched successfully",
      court: {
        ...court.toObject(),
        documents: docsCount,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createAndAssignUser = async (req, res) => {
  try {
    const { courtId } = req.params;
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "invalid email" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "email already in" });
    }

    const newUser = new User({ name, email, password, role });

    await newUser.save();

    const court = await Court.findById(courtId);
    if (!court) return res.status(404).json({ message: "court not found" });

    if (role === "officer") {
      court.officers.push(newUser._id);
    } else if (role === "reader") {
      court.readers.push(newUser._id);
    } else {
      return res.status(400).json({ message: "invalid role" });
    }

    newUser.court = court._id;
    await court.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Court E-Sign" <${process.env.EMAIL_USER}>`,
      to: newUser.email,
      subject: `You have been assigned as ${role}`,
      html: `
        <h3>Hello ${newUser.name || "Officer"},</h3>
        <p>You have been assigned as an <b>${role}</b> to the court:</p>
        <ul>
          <li><b>Email:</b> ${newUser.email}</li>
          <li><b>Court Name:</b> ${court.courtName}</li>
          <li><b>Location:</b> ${court.courtLocation}</li>
        </ul>
        <p>Please log in to the system to access your account.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    });

    res.status(201).json({
      message: `${role} created and assigned successfully`,
      user: newUser,
      court,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

const getCourtUsers = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newUser = new User({ name, email, password, role });
    await newUser.save();

    const court = await Court.findById(req.params.id);
    if (!court) return res.status(404).json({ message: "court not found" });

    if (role === "officer") {
      court.officers.push(newUser._id);
      court.officerCount = court.officers.length;
    } else if (role === "reader") {
      court.readers.push(newUser._id);
      court.readerCount = court.readers.length;
    }

    await court.save();

    res.status(201).json({
      message: "User created & assigned to court",
      user: newUser,
      court,
    });
  } catch (err) {
    console.error("error in assigning user:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

module.exports = {
  addCourts,
  getCourts,
  courtId,
  getUsers,
  deleteCourt,
  courtDetails,
  createAndAssignUser,
  getCourtUsers
}