const express = require("express");
const cors = require("cors");
const authRouter = require('./routes/auth.route')

const app = express();

app.use(cors());
app.use(express.json())

// authentication route.
app.use('/api/v1/auth' , authRouter)

module.exports = app;
