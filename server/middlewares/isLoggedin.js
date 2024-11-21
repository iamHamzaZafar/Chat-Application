const jwt = require("jsonwebtoken");
const { BlackList } = require("../models/blackList.model");

const isAuthenticated = async (req, res, next) => {
  try {
    // Ensure the Authorization header exists and extract the token
    const token = req.headers["authorization"]?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "Not authorized, token missing" });
    }

    // check token is already blacklisted or not.
    const isBlackListed = await BlackList.findOne({ token: token });
    if (isBlackListed) {
      return res
        .status(401)
        .json({ message: "This session has expired. Please login" });
    }
    // Verify the token
    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verifyToken;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Handle invalid or expired tokens
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

module.exports = { isAuthenticated };
