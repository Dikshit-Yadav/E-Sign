const express = require("express");
const router = express.Router();
const Court = require("../models/Court");
const User = require("../models/User");
const nodemailer = require("nodemailer");
const {
  addCourts,
  getCourts,
  courtId,
  getUsers,
  deleteCourt,
  courtDetails,
  createAndAssignUser,
} = require("../controllers/adminController");


router.post("/courts", addCourts);
router.get("/courts", getCourts);
router.get("/courts/:id", courtId);
router.delete("/courts/:id", deleteCourt);
router.get("/users", getUsers);
router.get("/courts/:id/details", courtDetails);
router.post("/courts/:courtId/users", createAndAssignUser);


module.exports = router;