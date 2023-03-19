// jshint esversion: 9

const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recordSchema = new Schema({
  user: { type: String, required: true },
  record: [{type: Schema.Types.Mixed}]
});

module.exports = mongoose.model("Record", recordSchema);
