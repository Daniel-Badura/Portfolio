const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WidoczekSchema = new Schema({
    name: String,
    rating: String, 
    description: String,
    location: String
})

module.exports = mongoose.model('Widoczek', WidoczekSchema);
