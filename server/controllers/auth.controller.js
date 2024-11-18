const { User } = require("../models/user.model");
const bcrypt = require("bcrypt");
const {
  generateVerificationToken,
} = require("../config/generateVerificationToken");
const validator = require("validator");
const { sendEmail } = require("../config/nodeMailer");

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

module.exports = { signup };
