const express = require("express");
const {
  signup,
  verifyEmailController,
  login,
  editUserDetails
} = require("../controllers/auth.controller");
const { isAuthenticated } = require("../middlewares/isLoggedin");
const router = express.Router();

// route to create the user.
router.post("/signup", signup);
// route for the email verification.
router.get("/verify-email", verifyEmailController);
// route for the user login.
router.post("/login", login);
// route to edit the profile.
router.put("/edit-profile/:id", isAuthenticated, editUserDetails);

module.exports = router;
