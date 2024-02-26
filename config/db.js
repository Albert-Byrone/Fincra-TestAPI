const mongoose = require('mongoose');
const database_url = process.env.DATABASE_URL


mongoose.connect(database_url);


mongoose.connection.on("connected", res => {
  console.log("Connected");
})

mongoose.connection.on("error", error => {
  console.log(error);
})