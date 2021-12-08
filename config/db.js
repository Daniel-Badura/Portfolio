// jshint esversion: 9
const mongoose = require('mongoose');
require('dotenv').config({ path: './config/config.env' })

const dburi = process.env.MONGODB_URI;
const connectDB = async () => {
  const conn = await mongoose.connect(dburi, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  });
  console.log(`MongoDB Connected: ${conn.connection.host}`);
};


module.exports = connectDB;