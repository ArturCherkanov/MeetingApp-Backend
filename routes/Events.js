const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const assert = require("assert");

const Events = require("../models/Events");

router.get("/get", (req, res) => {
    Events.find((err, data) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true, data: data });
    });
});


router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json())

router.post("/putData", (req, res) => {
    const event = new Events(),
    { time, message } = req.body;
    
    if (!message || !time) {
        return res.json({
            success: false,
            error: "INVALID INPUTS"
        });
    }

    event.message = message;
    event.time = time;

    saveEventPromise = event.save();

    assert.ok(saveEventPromise instanceof Promise)

    saveEventPromise.then(()=>{return res.json({ success: true })}).catch(err => {
        if (err) return res.json({ success: false, error: err });
        });
})

module.exports = router;