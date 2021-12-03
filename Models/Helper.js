const Traveller = require("../Models/Traveller");
const Guide = require("../Models/Guide");
const Hotel = require("../Models/Hotel");


exports.getModelOnName = async (role,description) => {
    console.log(name);
    switch (role) {
      case 'Traveller': {
        const traveller = await Traveller.create({
             description
        });
        return traveller;
        break;
      }
      case 'guide': {
        const guide = await Guide.create({
              description
        });
        return guide;
        break;
      }
      case 'hotel': {
        const hotel = await Hotel.create({
              description
        });
        return hotel;
        break;
      }
      default: {
          throw new Error("Assertion Failed");
          return NULL;
      }
    }
};
