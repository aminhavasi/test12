process.env.NODE_CONFIG_DIR = __dirname + '/config';

const express = require('express');
const _ = require('lodash');
const config = require('config');

const {
    User
} = require('./models/user');

const app = express();
app.use(express.json());

app.post('/api/users', (req, res) => {
    let body = _.pick(req.body, ['fullname', 'email', 'password']);

    let newuser = new User(body);



    newuser.save().then((user) => {
        res.status(200).send(user);
    }, (err) => {
        res.status(400).json({
            Error: `something went wrong${err}`
        });
    });

});
app.post('/api/login', (req, res) => {
    const body = _.pick(req.body, ['email', 'password']);
    User.findbycredentials(body.email, body.password).then((user) => {
        user.generateauthtoken().then((token) => {
            res.header('x-auth', token).status(200).send(token);


        }, (err) => {
            res.status(400).json({
                Error: `somethingwent wrong ${err}`
            })

        })
    })

});

app.listen(config.get('PORT'), () => {
    console.log(`server is running on port ${config.get('PORT')}`);
})
