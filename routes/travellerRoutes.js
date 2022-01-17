const express = require('express');
const router = express.Router();

const authController = require('../controller/authController');
const travellerController = require('../controller/travellerController');

router.post("/createHotelReview/:id", authController.protect, travellerController.createHotelReview);
router.post("/editHotelReview/:id", authController.protect, travellerController.editHotelReview);
router.post("/deleteHotelReview/:id", authController.protect, travellerController.deleteHotelReview);
router.get("/getAllReviews", authController.protect, travellerController.getAllReviews);
router.get("/getTravellerPastBooking", authController.protect, travellerController.getTravellerPastBooking);
router.get("/getTravellerCurrentBooking", authController.protect, travellerController.getTravellerCurrentBooking);
module.exports = router;
