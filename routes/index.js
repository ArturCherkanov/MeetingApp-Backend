const express = require("express");
const router = express.Router();

const eventRoutes = require('./events');
// const userRoutes = require('./Users');

router.use('/events', eventRoutes);
// router.use('/users', userRoutes);

module.exports = router;