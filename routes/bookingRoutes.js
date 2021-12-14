const express = require('express');
const router = express.Router();

const authController = require('../controller/authController');
const bookingController = require('../controller/bookingController')


router.post('/createBooking/:id', authController.protect, bookingController.createBooking);
router.post('/confirmBooking', authController.protect, bookingController.confirmBooking);

module.exports = router;
