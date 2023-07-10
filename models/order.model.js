const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: { type: String, ref: "user" },
    restaurant: { type: String, ref: "restaurant" },
    items: {
      type: [
        {
          name: { type: String, required: true },
          price: { type: Number, required: true },
          quantity: { type: Number, required: true },
        },
      ],
    },
    totalPrice: { type: Number, required: true },
    deliveryAddress: {
      type: {
        street: String,
        city: String,
        state: String,
        country: String,
        zip: String,
      },
    },
    status: {
      type: String,
      enum: ["placed", "preparing", "on the way", "delivered"],
      default: "placed",
      required: true,
    },
  },

  { versionKey: false }
);

const OrderModel = mongoose.model("order", orderSchema);

module.exports = { OrderModel };
