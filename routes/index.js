const express = require('express');
const router = express.Router();

const eventRoutes = require('./events');
const userRoutes = require('./users');
const tokenRoutes = require('./token');
const roomsRoutes = require('./rooms');


router.use('/events', eventRoutes);
router.use('/users', userRoutes);
router.use('/rooms', roomsRoutes);
router.use('/token', tokenRoutes);

module.exports = router;
