const express = require('express');
const router = express.Router();
const middleware = require('../token-middleware');
// const assert = require('assert');

const Events = require('../models/Events');

router.get('/', (req, res) => {
    Events.find((err, data) => {
        if (err) {return res.status(400).end()};
        return res.json({ data: data });
    });
});

router.post('/', middleware.checkToken, (req, res) => {
    const event = new Events(),
        { time, message } = req.body;

    if (!message || !time) {
        return res.status(400).end();
    }

    event.message = message;
    event.time = time;

    // saveEventPromise = event.save();

    // assert.ok(saveEventPromise instanceof Promise);

    event.save().then(() => res.status(201)).catch(err => {
        if (err) return res.status(400).end();
    });
});

module.exports = router;
