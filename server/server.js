process.env.NODE_CONFIG_DIR = __dirname + '/config';
const config = require('config');
const {
    User
} = require('./models/user')

console.log(config.get('LEVEL'));

let newuser = new User({
    fullname: "aminhavasi",
    email: "pa.ahqgmail.com",
    password: "123321"
});

newuser.save().then((user) => {
        console.log('user has been saved');
    }, (err) => {

    }



);