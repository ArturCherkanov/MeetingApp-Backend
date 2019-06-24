const express = require('express');
const router = express.Router();
const passport = require('passport');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const https = require('https');
const axios = require('axios');

const hashPassword = require('../utils');
const User = require('../models/User');
const middleware = require('../token-middleware');
const app = express();

router.post('/', (req, res) => {
    const {
        firstname,
        lastname,
        username,
        password,
        imgData,
    } = req.body;
    const user = new User();

    if (!username || !password) {
        return res.status(400);
    }


    const hash = hashPassword(password);

    user.password = hash;
    user.username = username;
    user.firstname = firstname;
    user.lastname = lastname;
    user.imgData = imgData;

    const token = jwt.sign(
        { username: username },
        process.env.SECRET,
        { expiresIn: '240h' },
    );
    user.save()
        .then(item => {
            console.log(token);
            return res.json({ token: token }); } )
        .catch(err => {
            console.log(err);
            return res.status(400).end();
        });

});

router.get('/', (req, res, next) => {
    const { username, password } = req.query;
    const currentPasswordHash = hashPassword(password);

    if (username && password) {
        User.findOne({ username: username })
            .then((req) => {
                if (username == req.username && currentPasswordHash == req.password) {
                    const token = jwt.sign(
                        { username: username },
                        process.env.SECRET,
                        { expiresIn: '240h' },
                    );
                    return res.json({ token: token });
                }
                return res.status(400).end();
            })
            .catch(() => res.status(403).end());
    }
});


// router.post('/vk', (req, res, next) => {
//     let code = req.body.code;

//     axios.get('https://oauth.vk.com/access_token?client_id=6995323&client_secret=HotEz0wXby8a0sEqY8Yl&redirect_uri=http://localhost/vk&code=' + code, false, null)
//         .then(res => {
//             const {
//                 user_id,
//                 access_token,
//                 expires_in,
//             } = res.data;

//             User.findOne({ vkId: user_id })
//                 .then((req) => {
//                     if (req.vkId === user_id) {
//                         const token = jwt.sign(
//                             { cipherWord: user_id },
//                             process.env.SECRET,
//                             { expiresIn: expires_in },
//                         )
//                         return res.json({ token: token });
//                     }
//                     const user = new User();

//                     axios.get('https://api.vk.com/method/users.get?user_ids=' + res.data.user_id + '&fields=bdate&access_token=' + res.data.access_token + '&fields=photo_200&v=5.95')
//                         .then((res) => {
//                             const user = new User();
//                             const {
//                                 user_id,
//                                 first_name,
//                                 last_name,
//                                 is_closed,
//                                 can_access_closed,
//                                 photo_200,
//                             } = res.data.response[0];
//                             const token = jwt.sign(
//                                 { cipherWord: user_id },
//                                 process.env.SECRET,
//                                 { expiresIn: expires_in },
//                             );
//                             user.vkId = user_id;
//                             user.firstname = first_name;
//                             user.lastname = last_name;
//                             user.imgData = photo_200;

//                             user.save()
//                                 .then(item => res.json({ token: token }))
//                                 .catch(err => res.status(400).end());
//                             return res.json({ token: token });
//                         });
//                 })

//         })
//         .catch(err => console.log(err));

// });

module.exports = router;
