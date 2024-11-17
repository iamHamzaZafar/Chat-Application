const dotenv = require("dotenv");
const cors = require("cors");
const { connectToDb } = require("./config/dbConnetion");
const app = require('./app')

const port = process.env.PORT || 3000

// enviroment variables configrations
dotenv.config();

// creating the database connection .
connectToDb().then(() => {
  console.log("Database connection successfull!!!");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
