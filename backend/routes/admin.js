const express = require("express");
const cache = require("../middlewares/cachMiddleware");
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
  documents,
} = require("../controllers/adminController");


router.post("/courts", addCourts);
router.get("/courts", cache("courts"),getCourts);
router.get("/courts/:id",cache(`court:${req.params.id}`), courtId);
router.get("/documents",cache("documents"),
  documents);
router.delete("/courts/:id", deleteCourt);
router.get("/users", getUsers);
router.get("/courts/:id/details",cache("courtDetails:"+req.params.id), courtDetails);
router.post("/courts/:courtId/users", createAndAssignUser);


module.exports = router;