const express = require('express');
const router = express.Router();

const Room = require('../models/Room')

router.get('/', (req, res) => {
    if (req.params.dateFrom && req.params.dateFrom) {
        return false;
    }
    Room.find()
        .then(rooms => res.send(rooms))
        .catch(err => res.status(400).end(0))
})

module.exports = router
