const Traveller = require("../Models/Traveller");
const Guide = require("../Models/Guide");
const Hotel = require("../Models/Hotel");


exports.getModelOnName = async (role, description) => {
  switch (role) {
    case 'Traveller': {
      const traveller = await Traveller.create({
        description
      });
      return traveller;
    }
    case 'Guide': {
      const guide = await Guide.create({
        description
      });
      return guide;
    }
    case 'Hotel': {
      const hotel = await Hotel.create({
        description
      });
      return hotel;
    }
    default: {
      throw new Error("Assertion Failed");
      return NULL;
    }
  }
};
