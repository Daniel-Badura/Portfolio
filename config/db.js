// jshint esversion: 9
const mongoose = require('mongoose');
require('dotenv').config({ path: './config/config.env' })

const dburl =
  process.env.MONGODB_URI || "mongodb://localhost:27017/portfolio";
const dburl2 = process.env.MONGODB_URI || "mongodb://localhost:27017/portfolio";
const connectDB = async () => {
  const conn = await mongoose.connect(dburl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  });
  console.log(`MongoDB Connected: ${conn.connection.host}`);
};


module.exports = connectDB;