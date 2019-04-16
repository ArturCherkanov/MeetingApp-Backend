const express = require('express');
const router = express.Router();

const middleware = require('../token-middleware');
const User = require('../models/User');

router.get('/', middleware.checkToken, (req, res) => {
    res.json({
        token: true,
        email: req.decoded.username,
        photoPath:'https://pp.userapi.com/M4on1Uicd_sK-hAx2kgAPcMPpnzDH7PS8xV_lQ/qqKPA4ZOEXo.jpg?ava=1'
    });
});


router.get('/list/', (req, res, next) => {
    User.find()
        .then(users => { return userList = users.map(user => { return { name: user.firstname, email: user.username } }); })
        .then(userList => res.send(userList))
});

module.exports = router;
