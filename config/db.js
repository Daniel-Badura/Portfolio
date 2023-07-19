// jshint esversion: 9
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI, {});
  console.log(`MongoDB Connected: ${conn.connection.host}`);
};
module.exports = connectDB;
