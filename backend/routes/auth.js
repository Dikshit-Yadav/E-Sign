const express = require("express");
const {login, logout} = require("../controllers/authController"); 

const router = express.Router();

router.post("/auth/login", login);

router.post("/auth/logout", logout);

module.exports = router;
