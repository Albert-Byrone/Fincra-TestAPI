const express = require("express");


// Load the environment
require('dotenv').config();

// Set up database
require("./config/db")
const bodyParser = require('body-parser');
const userRouters = require('./routes/user.routes');


const app = express();
const port = process.env.PORT || 3000;


// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use the user routes
app.use('/users', userRouters);


app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`)
});

