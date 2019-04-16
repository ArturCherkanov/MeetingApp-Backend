const express = require('express');
const router = express.Router();

const eventRoutes = require('./events');
const authRoutes = require('./auth');
const userRoutes = require('./user');
const roomsRoutes = require('./rooms');


router.use('/events', eventRoutes);
router.use('/user', userRoutes);
router.use('/rooms', roomsRoutes);
router.use('/auth', authRoutes);

module.exports = router;
