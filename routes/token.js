const express = require('express');
const router = express.Router();

const middleware = require('../token-middleware');


router.get('/', middleware.checkToken, (req, res) => {
    res.json({token: true})
    })

module.exports = router;
