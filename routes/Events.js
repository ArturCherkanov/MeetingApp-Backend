const express = require("express");
const Data = require("../models/data");
const app = express();
const router = express.Router();
app.use("/api", router);


router.get("/getData", (req, res) => {
    Data.find((err, data) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true, data: data });
    });
});

router.post("/putData", (req, res) => {
    let data = new Data();
    const { time, message } = req.body;
    if (!message || !time) {
        return res.json({
            success: false,
            error: "INVALID INPUTS"
        });
    }

    data.message = message;
    data.time = time;

    data.save(err => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true });
    });
});