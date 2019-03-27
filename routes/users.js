const express = require('express');
const router = express.Router();
const passport = require('passport');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const middleware = require('../token-middleware');
const app = express();

router.post('/', (req, res) => {
    const {
        firstname,
        lastname,
        username,
        password
    } = req.body;
    const user = new User();

    if (!username || !password) {
        return res.status(400);
    }


    const hash = crypto.createHmac('sha256', password)
        .update('I love cupcakes')
        .digest('hex');

    user.password = hash;
    user.username = username;
    user.firstname = firstname;
    user.lastname = lastname;

    const token = jwt.sign(
        { username: username },
        process.env.SECRET,
        { expiresIn: '240h' },
    );
    user.save()
        .then(item => res.json({ token: token }))
        .catch(err => res.status(400).end());

});

router.get('/', (req, res, next) => {
    const { username, password } = req.query;
    const currentPasswordHash = crypto.createHmac('sha256', password)
        .update('I love cupcakes')
        .digest('hex');

    User.findOne({ username: username })
        .then((req) => {
            if (username && password) {
                if (username == req.username && currentPasswordHash == req.password) {
                    const token = jwt.sign(
                        { username: username },
                        process.env.SECRET,
                        { expiresIn: '240h' },
                    );
                    return res.json({ token: token });
                } else {
                    res.status(403).end();
                }
            } else {
                res.status(400).end();
            };
        });
});

module.exports = router;
