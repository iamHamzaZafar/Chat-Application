const express = require("express");
const { signup } = require("../controllers/auth.controller");
const router = express.Router();

// route to create the user.
router.post("/signup", signup);

module.exports = router;
