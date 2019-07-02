const validator = require('validator');
const bcrypt = require('bcryptjs');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const config = require('config')

const {
    mongoose
} = require('./../db/mongoose');
const tokenoption = {
    type: String,
    required: true
}

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
        trim: true,
        validate: {
            validator: validator.isEmail,
            message: '{value} is not valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: tokenoption,
        token: tokenoption
    }]
});
userschema.methods.toJSON = function () {
    let user = this;
    let body = user.toObject();

    return _.pick(body, ['_id', 'fullname', 'email']);
};
userschema.statics.findbycredentials = function (email, password) {
    let User = this;
    return User.findOne({
        email
    }).then((user) => {
        if (!user) {
            return Promise.reject();
        }
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    resolve(user);
                } else {
                    reject();
                }
            });
        });
    });

}
userschema.methods.generateauthtoken = function () {
    let user = this;
    let access = 'auth';

    let token = jwt.sign({
        _id: user._id.toHexString(),
        access
    }, config.get('JWT_SECRET')).toString();

    user.tokens.push({
        access,
        token
    });
    return user.save().then(() => {
        return token;
    });

}

userschema.pre('save', function (next) {
    let user = this;
    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

let User = mongoose.model('User', userschema);

module.exports = {
    User
};