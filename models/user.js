/*jshint esversion: 9 */

const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Pole użytkownik nie może być puste']
    },
    email: {
        type: String,
        required: [true, 'Pole email nie może być puste']
    },
    password: {
        type: String,
        required: [true, 'Pole hasło nie może być puste']
    }
});

module.exports= mongoose.model('User', userSchema);