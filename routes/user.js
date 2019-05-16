const express = require('express');
const router = express.Router();

const middleware = require('../token-middleware');
const User = require('../models/User');

router.get('/', middleware.checkToken, (req, res) => {
    let imgPath;
    User.findOne({ username: req.decoded.username })
        .then(user => { imgPath = user.imgData.data.url;
            res.json({
                isLoggedIn: true,
                email: req.decoded.username,
                photoPath: imgPath,
            });
            })
        .catch(err=>{console.log(err)})
});


router.get('/list/', (req, res, next) => {
    User.find()
        .then(users => userList = users.map(user => { return { name: user.firstname, email: user.username } }))
        .then(userList => res.send(userList));
});

module.exports = router;
