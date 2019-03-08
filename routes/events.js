const express = require('express');
const router = express.Router();
const middleware = require('../token-middleware');
const moment = require('moment')
// const assert = require('assert');

const Events = require('../models/Events');

const savedEvents = [];

router.get('/', (req, res) => {
    const exactlyDate = moment(req.query.date, moment.defaultFormat);
    const date = exactlyDate.format('YYYY-MM-DD');
    const dateEvents = {};

    // const start = date.startOf('day').toDate()
    // const end = date.endOf('day').toDate()
    Events.find({'time':{
        $gte: exactlyDate.startOf('day').toDate(),
        $lte: exactlyDate.endOf('day').toDate()
    }}).then(items=>{
        // !savedEvents[date]?
        // savedEvents[date]=[...items]:null;
        // dateEvents[date] = savedEvents[date];

        return res.send({[date]:[...items]});
    });
});

router.post('/', middleware.checkToken, (req, res) => {
    const event = new Events();
    const { time, message, isAsyncLoadEvents } = req.body;

    if (!message || !time) {
        return res.status(400).end();
    }

    event.message = message;
    event.time = time;

    event.save()
        .then((eventItem) => {
            const choisenDate = moment(time).format('YYYY-MM-DD');
            if(isAsyncLoadEvents){
                res.status(201).send({event: eventItem, date: choisenDate})
            }else{
                res.status(201).end()
            }
        })
        .catch(err => {
            if (err)
            return res.status(400).end();
        });
});

module.exports = router;
