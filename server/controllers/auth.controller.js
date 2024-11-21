const { User } = require("../models/user.model");
const bcrypt = require("bcrypt");
const {
  generateVerificationToken,
} = require("../config/generateVerificationToken");
const validator = require("validator");
const { sendEmail } = require("../config/nodeMailer");
const jwt = require("jsonwebtoken");
const { BlackList } = require("../models/blackList.model");

const signup = async (req, res) => {
  const { username, password, email } = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(401).json({ message: "All fields are required" });
    }

    // Check is email valid.
    const isEmailValid = validator.isEmail(email); //=> true
    if (!isEmailValid) {
      return res.status(401).json({
        message: "Email is not valid",
      });
    }
    // check for the password length.
    if (password.length < 5) {
      return res
        .status(401)
        .json({ message: "Password length should be grater than 5" });
    }
    // check for the user inside the datapase.
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(404).json({
        message: "User already exists with the Email",
      });
    }
    // hash the password.
    const hashedPassword = await bcrypt.hash(password, 10);

    // generate the verification Token.
    const verificationToken = await generateVerificationToken();

    // now user is unique
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      verificationToken,
    });

    await newUser.save();
    // send the email to the user.
    await sendEmail(email, verificationToken);
    res.status(201).json({
      message:
        "Signup successful! Please verify your email to activate your account.",
    });
  } catch (error) {
    console.log("Error", error.message);
    return res.status(501).json({ message: "Internal Server Error" });
  }
};

// verifyEmailController

const verifyEmailController = async (req, res) => {
  const { token, email } = req.query;
  console.log(token, email);
  try {
    const user = await User.findOne({ email, verificationToken: token });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification link." });
    }
    // user found .
    user.isVerified = true;
    user.verificationToken = null; // clear the token.

    // save the user .
    await user.save();

    // return the respomce of success
    res.status(200).json({ message: "Email successfully verified!" });
  } catch (error) {
    console.error("Error verifying email:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// api for the login user.

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ message: "User does not exists with this email" });
    }

    // user found now compare the password.
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Incorrect email or Password" });
    }

    // Convert Mongoose document to plain JavaScript object
    const userObject = user.toObject();
    // logic for if the user is not verfied yet and try to login.
    const isUserVerified = userObject.isVerified;
    if (!isUserVerified) {
      const verificationToken = await generateVerificationToken();
      sendEmail(email, verificationToken);
      res.status(201).json({
        message:
          "Your Account is not verified Please verify your email to activate your account.",
      });
    }
    // password matched.
    delete userObject.password;
    console.log("User details are :", userObject);
    // now create the jwt token.
    const jwtToken = jwt.sign(userObject, process.env.JWT_SECRET, {
      expiresIn: "90d",
    });
    // send this token to the user.
    return res
      .status(201)
      .json({ message: "Login successfull", userObject, jwtToken });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// function to edit the user details;
const editUserDetails = async (req, res) => {
  const { username, password } = req.body;

  const userId = req.user._id; // Assuming `req.user` contains the authenticated user's ID

  try {
    // Fetch the user by ID
    const user = await User.findById(userId); // Correct usage of findById
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if either username or password is provided
    if (!username && !password) {
      return res
        .status(400)
        .json({ message: "Please provide data to update." });
    }

    // Update username if provided
    if (username) {
      user.username = username;
    }

    // Update password if provided
    if (password) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      user.password = hashedPassword;
    }

    // Save the updated user document
    await user.save();

    // Respond to the client
    res.status(200).json({ message: "Profile updated successfully." });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// controller to logout the user
const logoutUser = async (req, res) => {
  const accessToken = req.headers["authorization"]?.replace("Bearer ", "");

  // Check if token is provided
  if (!accessToken) {
    return res.status(400).json({ message: "Token not provided" });
  }

  try {
    // Check if the token is already blacklisted
    const checkIfBlacklisted = await BlackList.findOne({ token: accessToken });
    if (checkIfBlacklisted) {
      console.log("Token already blacklisted");
      return res.status(403).json({ message: "Token already invalidated" });
    }

    // Add token to the blacklist
    const newBlacklist = new BlackList({ token: accessToken });
    await newBlacklist.save();

    // Inform client to clear cookies
    res.setHeader("Clear-Site-Data", '"cookies"');

    // Respond with success
    res.status(200).json({ message: "You have been successfully logged out!" });
  } catch (err) {
    console.error("Error during logout:", err);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  signup,
  verifyEmailController,
  login,
  editUserDetails,
  logoutUser,
};
