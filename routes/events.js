const express = require('express');
const router = express.Router();
const middleware = require('../token-middleware');
const moment = require('moment');
const CONFIG = require('../settings');
const CalendarAPI = require('node-google-calendar');

const Events = require('../models/Events');
const Rooms = require('../models/Room');

const savedEvents = [];

let params = {
    showHidden: true
};
let cal = new CalendarAPI(CONFIG);

cal.CalendarList.list(params)
    .then(resp => {
        console.log(resp);
    }).catch(err => {
        console.log(err.message);
    });

router.get('/', (req, res) => {
    const exactlyDate = moment(req.query.date, moment.defaultFormat);
    const date = exactlyDate.format('YYYY-MM-DD');
    Events.find({
        'timeFrom': {
            $gte: exactlyDate.startOf('day').toDate(),
            $lte: exactlyDate.endOf('day').toDate(),
        },
    }).then(items => res.send({ [date]: [...items] }));
});

router.get('/validate', async (req, res) => {
    const exactlyDate = moment(req.query.date, moment.defaultFormat);
    const date = exactlyDate.format('YYYY-MM-DD');
    const { userFrom, userTo } = req.query;
    console.log(userFrom, userTo);
    // It's just a variable - name it as noun, not verb (e.g. allRooms)
    const getRoomsFromDB = await Rooms.find();
    const roomList = getRoomsFromDB.map(elem => elem.name);
    // The same
    const getBlockedEventFromDB = await Events.find({
        $nor: [{
            'timeTo': {
                $lt: userFrom,
            },
        },
        {
            'timeFrom': {
                $gt: userTo,
            },
        },
        ],
    });

    await console.log(getBlockedEventFromDB);
    const blockedRooms = getBlockedEventFromDB.map((event) => event.room);

    const validatedRoomArray = [...roomList];

    roomList.forEach((room, i) => {
        blockedRooms.forEach((blockedRoom) => {
            if (blockedRoom === room) {
                delete validatedRoomArray[i];
            }
        });
    });

    res.send(validatedRoomArray.filter(item => item));

});

router.post('/', middleware.checkToken, (req, res) => {
    const event = new Events();
    const Room = new Rooms();

    const { eventData, isAsyncLoadEvents } = req.body;
    const { date, message, name, room, users } = eventData;

    if (!message || !date || !name || !room || !users) {
        return res.status(400).end();
    }


    event.message = message;
    event.timeFrom = date.from;
    event.timeTo = date.to;
    event.users = users;
    event.name = name;
    event.room = room;

    event.save()
        .then((eventItem) => {
            let choisenDate = moment(eventItem.timeFrom).format('YYYY-MM-DD');
            if (isAsyncLoadEvents) {
                res.status(201).send({
                    event: eventItem,
                    date: choisenDate
                });
            } else {
                res.status(201).end();
            }
        })
        .catch(err => {
            if (err) { return res.status(400).end(); }
        });
});

module.exports = router;


