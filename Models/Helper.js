const Traveller = require("../Models/Traveller");
const Guide = require("../Models/Guide");
const HotelManager = require("../Models/HotelManager");



exports.getModelOnName = (role) => {
  switch (role) {
    case 'Traveller': {
      return Traveller;
    }
    case 'Guide': {
      return Guide;
    }
    case 'Hotel': {
      return HotelManager;
    }
    default: {
      throw new Error("Assertion Failed");
      return NULL;
    }
  }
};
