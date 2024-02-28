const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");

const userRoute = require("./routes/user.routes")
const ticketRoute = require("./routes/ticket.routes")
const commentRoute = require("./routes/comment.routes")

const logger = require('./utils/logger'); // Adjust the path as necessary
const { info } = require("console");

// Load the environment
require('dotenv').config();

// Set up database
connectDB();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



const port = process.env.PORT || 3000;

app.use("/users", userRoute);
app.use("/tickets", ticketRoute);
app.use("/comments", commentRoute);




app.listen(port, () => {
  logger.info(`Example app listening on http://localhost:${port}`)
});


module.exports = app;
