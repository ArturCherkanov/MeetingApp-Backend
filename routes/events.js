const express = require("express");
const router = express.Router();
// const bodyParser = require("body-parser");
const assert = require("assert");

const Events = require("../models/Events");
// to do 
router.get("/", (req, res) => {
    Events.find((err, data) => {
        if (err) return res.status(400).end();
        return res.status(201).end(res.json({data: data}));
    });
});

router.post("/", (req, res) => {
    const event = new Events(),
    { time, message } = req.body;
    
    if (!message || !time) {
        return res.status(400).end();
    }

    event.message = message;
    event.time = time;

    saveEventPromise = event.save();

    assert.ok(saveEventPromise instanceof Promise)

    saveEventPromise.then(()=>{return res.status(201)}).catch(err => {
        if (err) return res.status(400).end();
        });
})

module.exports = router;