const express = require('express');
const router = express.Router();

const middleware = require('../token-middleware');
const User = require('../models/User');

router.get('/', middleware.checkToken, (req, res) => {
    let imgPath;
    User.findOne({ username: req.decoded.username })
        .then(user => {
            // imgPath = user.imgData.data.url;
            res.json({
                isLoggedIn: true,
                lastname: user.lastname,
                firstname: user.firstname,
                email: req.decoded.username,
                photoPath: user.imgData,
            });
        })
        .catch(err => {
            console.log('test', err);
            res.status(401).end();
        });
});


router.get('/list/', (req, res, next) => {
    User.find()
        .then(users => userList = users.map(user => ({ name: user.firstname, email: user.username })))
        .then(userList => res.send(userList));
});
router.get('/update/', middleware.checkToken, (req, res) => {
    console.log(JSON.parse(req.query.data))
    let query = JSON.parse(req.query.data)
    User.findOneAndUpdate({ username: req.decoded.username }, { $set: query })
        .then(user => {
            const imgPath = user.imgData.data.url;
            res.json(query)
        }
        );})
    module.exports = router;
