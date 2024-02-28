const mongoose = require('mongoose');
const database_url = process.env.DATABASE_URL





const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/ticket");
    console.log("Database connected");
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
}


module.exports = connectDB;