const express = require("express");
const router = express.Router();
const Court = require("../models/Court");
const User = require("../models/User");
const nodemailer = require("nodemailer");
const {
    // users,
    addCourts,
    getCourts,
    courtId,
    getUsers,
    deleteCourt,
    addOfficer,
      addReader,
      courtDetails,
      createAndAssignUser,
      getCourtUsers
} = require("../controllers/adminController");


// router.post("/users", users);
router.post("/courts", addCourts);
router.get("/courts", getCourts);//done
router.get("/courts/:id", courtId);//done
// router.post("/courts/:id/users", getCourtUsers);
router.delete("/courts/:id", deleteCourt);
router.get("/users", getUsers);//done
// router.post("/courts/:id/add-officer", addOfficer);
// router.post("/courts/:id/add-reader", addReader);
router.get("/courts/:id/details", courtDetails); //done
router.post("/courts/:courtId/users", createAndAssignUser);//done


module.exports = router;