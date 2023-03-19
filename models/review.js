// jshint esversion: 9
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const reviewSchema = new Schema({
    body:String,
    rating:Number,
    author: String
});

module.exports = mongoose.model('Review', reviewSchema);