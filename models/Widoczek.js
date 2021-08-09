// jshint esversion: 9

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WidoczekSchema = new Schema({
  name: String,
  image: String,
  price: Number,
  description: String,
  location: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

module.exports = mongoose.model("Widoczek", WidoczekSchema);
