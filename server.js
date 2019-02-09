require('dotenv').config();

const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const app = express();

// this is our MongoDB database

// connects our back end code with the database
mongoose.connect(
    process.env.dbRoute,
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
app.listen(process.env.API_PORT, () => console.log(`LISTENING ON PORT ${process.env.API_PORT}`));
