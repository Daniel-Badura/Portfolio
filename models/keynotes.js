// jshint esversion: 9

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const keynotesSchema = new Schema({
  score: Number,
  record: [
      {
        type: Schema.Types.ObjectId,
        ref: "Record",
      }
  ],
});

module.exports = mongoose.model("Keynotes", keynotesSchema);
