const mongoose = require("mongoose");

const dotenv = require("dotenv");
dotenv.config();

const connectToDb = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_DB_URI}/${process.env.DB_NAME}`
    );
  } catch (error) {
    console.log("error", error.message);
    process.exit(1);
  }
};

module.exports = { connectToDb };
