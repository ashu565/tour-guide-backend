const express = require('express');
const router = express.Router();

const authController = require('../controller/authController');
const hotelManagerController = require('../controller/hotelManagerController');

router.post("/createHotel", authController.protect, hotelManagerController.createHotel);


module.exports = router;
