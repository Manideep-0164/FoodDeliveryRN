const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: {
      type: {
        street: String,
        city: String,
        state: String,
        country: String,
        zip: String,
      },
      required: true,
    },
    menu: {
      type: [
        {
          name: { type: String, required: true },
          description: { type: String, required: true },
          price: { type: Number, required: true },
          image: { type: String, required: true },
        },
      ],
    },
  },
  { versionKey: false }
);

const RestaurantModel = mongoose.model("restaurant", restaurantSchema);

module.exports = { RestaurantModel };
