// jshint esversion: 9
const mongoose = require('mongoose');


const dburl =
  process.env.MONGO_URL || "mongodb+srv://dandeusz:dandeusz@cluster0.3t3pj.mongodb.net/Portfolio?retryWrites=true&w=majoritya";
const dburl2 = process.env.MONGO_URL || "mongodb://localhost:27017/portfolio";
const connectDB = async () => {
  const conn = await mongoose.connect(dburl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  });
  console.log(`MongoDB Connected: ${conn.connection.host}`);
};


module.exports = connectDB;