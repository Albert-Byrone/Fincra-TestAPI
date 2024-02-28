const mongoose = require('mongoose');
const database_url = process.env.DATABASE_URL

require('dotenv').config();



const connectDB = async () => {
  try {
    // mongodb://localhost:27017/ticket

    // console.log(process.env.DB_USER)
    // console.log(process.env.DB_PASSWORD)


    // mongodb+srv://albertbyrone:HFlTToyvmeZWJ3t4@cluster0.s4an1wg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
    await mongoose.connect('mongodb+srv://albertbyrone:HFlTToyvmeZWJ3t4@cluster0.s4an1wg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
    console.log("Database connected");
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
}


module.exports = connectDB;