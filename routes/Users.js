const express = require("express");
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require("../models/User");
require('../password-config');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

router.post("/create", (req, res) => {

    let { username, password } = req.body,
        user = new User();

    if (!username || !password) {
        return res.json({
            success: false,
            error: "INVALID INPUTS"
        });
    }

    let salt = bcrypt.genSaltSync(10),
        hash = bcrypt.hashSync(password, salt);

    user.password = hash;
    user.username = username;

    user.save(err => {
        if (err) {
            return res.json({ success: false, error: err });
        }
        return res.json({ success: true });
    });

});



app.use(passport.initialize());

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
