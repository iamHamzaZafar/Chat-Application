const express = require("express");
const { signup , verifyEmailController , login } = require("../controllers/auth.controller");
const router = express.Router();

// route to create the user.
router.post("/signup", signup);
// route for the email verification.
router.get('/verify-email', verifyEmailController);
// route for the user login.
router.post('/login' , login);


module.exports = router;
