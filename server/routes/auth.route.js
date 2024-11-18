const express = require("express");
const { signup , verifyEmailController } = require("../controllers/auth.controller");
const router = express.Router();

// route to create the user.
router.post("/signup", signup);
// route for the email verification.
router.get('/verify-email', verifyEmailController);
module.exports = router;
