const express = require('express');
const passport = require('passport');
const crypto = require('crypto');
const User = require('../models/User');
const router = express.Router();

require('../password-config');


router.post('/create', (req, res) => {

    const { username, password } = req.body;
    const user = new User();

    if (!username || !password) {
        return res.json({
            success: false,
            error: 'INVALID INPUTS',
        });
    }

    const secret = 'abcdefg';
    const hash = crypto.createHmac(password, secret);

    user.password = hash;
    user.username = username;

    user.save(err => {
        if (err) {
            return res.json({ success: false,
                error: err });
        }
        return res.json({ success: true });
    });

});




router.get('/login', (req, res, next) => {
    passport.authenticate('token', function (err, user, info) {
        if (err) { return next(err); }
        if (!user) {
            return res.send('test');
        }
        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            return user.username;
        });
    })(req, res, next);
});
