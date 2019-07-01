process.env.NODE_CONFIG_DIR = __dirname + '/config';
const config = require('config');
const express = require('express');
const _ = require('lodash');

const { User } = require('./models/user');
const app = express();
app.use(express.json());

console.log(config.get('LEVEL'));

app.post('/api/users', (req, res) => {
    body = _.pick(req.body, ['fullname', 'email', 'password']);
    let user = new User(body);

    user.save().then(
        user => {
            res.status(200).send(user);
        },
        err => {
            res.status(400).json({
                Error: `${err}`
            });
        }
    );
});

app.listen(config.get('PORT'), () => {
    console.log(`server is running on port ${config.get('PORT')}`);
});
