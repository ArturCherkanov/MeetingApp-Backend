const express = require('express');
const router = express.Router();
const middleware = require('../token-middleware');
const moment = require('moment')


const Events = require('../models/Events');
const Rooms = require('../models/Room');

const savedEvents = [];

router.get('/', (req, res) => {
    const exactlyDate = moment(req.query.date, moment.defaultFormat);
    const date = exactlyDate.format('YYYY-MM-DD');
    Events.find({
        'timeFrom': {
            $gte: exactlyDate.startOf('day').toDate(),
            $lte: exactlyDate.endOf('day').toDate()
        }
    }).then(items => {
        return res.send({ [date]: [...items] });
    });
});

router.get('/validate', async (req, res) => {
    const exactlyDate = moment(req.query.date, moment.defaultFormat);
    const date = exactlyDate.format('YYYY-MM-DD');
    const { userFrom, userTo } = req.query;
    // It's just a variable - name it as noun, not verb (e.g. allRooms)
    const getRoomsFromDB = await Rooms.find();
    const roomList = getRoomsFromDB.map(elem => elem.name);
    // The same
    const getBlockedEventFromDB = await Events.find({
        $nor: [{
            $and: [{
                'timeFrom': {
                    $gt: userFrom,
                }
            },
            {
                'timeTo': {
                    $gt: userTo,
                }
            }]
        },
        {
            $and: [{
                'timeFrom': {
                    $lt: userFrom,
                }
            },
            {
                'timeTo': {
                    $lt: userTo,
                }
            }]
        }
    ]
    });

const blockedRooms = getBlockedEventFromDB.map((event) => event.room)
// May be use Array#filter here?
const validatedRoomArray = [...roomList];

blockedRooms.forEach((blockedRoom, i) => {
    roomList.forEach((room) => {
        if (blockedRoom === room) {
            delete validatedRoomArray[i]
        }
    })
})

// ?? res.send 2 times?
res.send(validatedRoomArray.filter(item => item))

res.send(blockedRooms);

});

router.post('/', middleware.checkToken, (req, res) => {
    const event = new Events();
    const Room = new Rooms();

    const { eventData, isAsyncLoadEvents } = req.body;
    const { date, message, name, room, users } = eventData

    if (!message || !date || !name || !room || !users) {
        return res.status(400).end();
    }


    event.message = message;
    event.timeFrom = date.from;
    event.timeTo = date.to
    event.users = users;
    event.name = name;
    event.room = room;

    event.save()
        .then((eventItem) => {
            let choisenDate = moment(eventItem.timeFrom).format('YYYY-MM-DD');
            if (isAsyncLoadEvents) {
                res.status(201).send({ event: eventItem, date: choisenDate })
            } else {
                res.status(201).end()
            }
        })
        .catch(err => {
            if (err)
                return res.status(400).end();
        });
});

module.exports = router;
