const express = require('express');
const router = express.Router();
const middleware = require('../token-middleware');
const moment = require('moment')
// const assert = require('assert');

const Events = require('../models/Events');
const Rooms = require('../models/Room');

const savedEvents = [];

router.get('/', (req, res) => {
    const exactlyDate = moment(req.query.date, moment.defaultFormat);
    const date = exactlyDate.format('YYYY-MM-DD');
    const dateEvents = {};

    // const start = date.startOf('day').toDate()
    // const end = date.endOf('day').toDate()

    Events.find({
        'timeFrom': {
            $gte: exactlyDate.startOf('day').toDate(),
            $lte: exactlyDate.endOf('day').toDate()
        }
    }).then(items => {

        // !savedEvents[date]?
        // savedEvents[date]=[...items]:null;
        // dateEvents[date] = savedEvents[date];

        return res.send({ [date]: [...items] });
    });
});

router.get('/validate', async (req, res) => {
    const exactlyDate = moment(req.query.date, moment.defaultFormat);
    const date = exactlyDate.format('YYYY-MM-DD');
    // const roomList = [];
    const { userFrom, userTo } = req.query;
    const getRoomsFromDB = await Rooms.find();
    const roomList = getRoomsFromDB.map(elem => elem.name);
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
const validatedRoomArray = [...roomList];

blockedRooms.forEach((blockedRoom, i) => {
    roomList.forEach((room) => {
        if (blockedRoom === room) {
            delete validatedRoomArray[i]
        }
    })
})

res.send(validatedRoomArray.filter(item => item))

res.send(blockedRooms);
    // .$where('room="1104-1"')
    // // .lte(exactlyDate.endOf('day').toDate())
    // .then((events) => {
    //     events =
    //     // let  = []
    //     // let counter = 0;
    //     // for (var room in rooms) {
    //     //     if (room.room !== revertRooms)
    //     //          counter++
    //     // }
    //     // let uniqueRooms = unique(rooms.room)
    //     res.send(rooms)
    // });
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

    // Rooms.findOne({ name: room })
    //     .then((data) => {
    //         Rooms.findOneAndUpdate({ _id: data.id  }, { time: [...data.time, date] });
    //     });

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
