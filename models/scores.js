// jshint esversion: 9

const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const scoreSchema = new Schema({
  user: { type: String, required: true },
  score: Number
});

module.exports = mongoose.model("Score", scoreSchema);
