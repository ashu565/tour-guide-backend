const Traveller = require("../Models/Traveller");
const Guide = require("../Models/Guide");
const Hotel = require("../Models/Hotel");


exports.getModelOnName = (role) => {
  switch (role) {
    case 'Traveller': {
      return Traveller;
    }
    case 'Guide': {
      return Guide;
    }
    case 'Hotel': {
      return Hotel;
    }
    default: {
      throw new Error("Assertion Failed");
      return NULL;
    }
  }
};
