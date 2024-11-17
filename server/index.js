const dotenv = require("dotenv");
const cors = require("cors");
const { connectToDb } = require("./config/dbConnetion");



// enviroment variables configrations
dotenv.config();

// creating the database connection .
connectToDb().then(() => {
  console.log("Database connection successfull!!!");
});
