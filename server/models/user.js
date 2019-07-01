const validator = require('validator')
const {
    mongoose
} = require('./../db/mongoose');

let userschema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        minlength: 3,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 6,
        trim: true,
        validate: {
            validator: validator.isEmail,
            message: '{value} is not valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6,

    }
});

let User = mongoose.model('User', userschema);

module.exports = {
    User
};