const express = require('express');
const router = express.Router();

const authController = require('../controller/authController');
const hotelManagerController = require('../controller/hotelManagerController');

router.post(
    '/createHotel',
    authController.protect,
    hotelManagerController.createHotel
);
router.post(
    '/editHotel/:id',
    authController.protect,
    hotelManagerController.editHotel
);
router.post(
    '/deleteHotel/:id',
    authController.protect,
    hotelManagerController.deleteHotel
);
router.get(
    '/getAllHotels',
    authController.protect,
    hotelManagerController.getAllHotels
);

module.exports = router;
