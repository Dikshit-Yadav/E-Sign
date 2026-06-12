const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {login, logout, isme} = require("../controllers/authController"); 

const router = express.Router();

router.post("/auth/login", login);

router.post("/logout", logout);

router.get("/isme", authMiddleware,isme);

module.exports = router;
