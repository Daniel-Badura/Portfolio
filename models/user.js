/*jshint esversion: 9 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Pole użytkownik nie może być puste'],
        unique: true
    },
    email: {
        type: String,
        required: [true, 'Pole email nie może być puste'],
        unique: true
    },
    recordings: [{
        type: Array,
    }
    ]
    
    // password: {
    //     type: String,
    //     required: [true, 'Pole hasło nie może być puste']
    // }
});
UserSchema.plugin(passportLocalMongoose);

module.exports= mongoose.model('User', UserSchema);