require('dotenv').config();

const mongoose = require('mongoose');
const express = require('express');
// var redis = require("redis");
// var client = redis.createClient();
const bodyParser = require('body-parser');
const passport = require('passport');
const app = express();
const server = require('http').createServer(app)
const io = require('socket.io')(server);
const jwt = require('jsonwebtoken');
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const moment = require('moment');

var connectedUsersStore = {}
// this is our MongoDB database

// connects our back end code with the database
mongoose.connect(
    'mongodb://localhost/Events',
    { useNewUrlParser: true }
).then(console.log('MongoDB has started')).catch(e => console.log(e));
mongoose.set('useCreateIndex', true);
const db = mongoose.connection;

db.once('open', () => console.log('connected to the database'));

db.on('error', () => console.error('MongoDB connection error:'));
const routes = require('./routes');



app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use('/api', routes);


// launch our backend into a port
io.on('connection', (socket) => {
    socket.on('join', (data) => {
        const token = jwt.decode(data.token)
        if (token) {
            console.log(connectedUsersStore)
            connectedUsersStore = { ...connectedUsersStore, [token.username]: socket.id }
            socket.join(data.token);
        }
    });


    socket.on('sendUsers', (req) => {
        req.users.forEach(element => {
            let [, email] = element.split('/');
            console.log(!!connectedUsersStore[email])
            if (connectedUsersStore[email]) {
                console.log(connectedUsersStore[email])
                let href='text='+req.name+'&dates='+moment(req.timeFrom).format('YYYYMMDDHHMM')+'/'+moment(req.timeTo).format('YYYYMMDDHHMM')+'&details='+req.message;
                console.log(href)
                
                io.to(connectedUsersStore[email]).emit('sendNotification', { active: true, href:[req.name,+moment(req.timeFrom).format('YYYYMMDDHHMM'),+moment(req.timeTo).format('YYYYMMDDHHMM'),req.message], msg: 'You have a new meeting \"' + req.name + '\" from: ' + req.date })
            }
        });
    })
});


server.listen(3001, function () {
    console.log('listening on *:3001');
});
