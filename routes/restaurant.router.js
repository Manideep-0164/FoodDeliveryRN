const express = require("express");
const restaurantRouter = express.Router();
require("dotenv").config();
const { RestaurantModel } = require("../models/restaurant.model");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

restaurantRouter.get("/restaurants", async (req, res) => {
  try {
    const restaurants = await RestaurantModel.find();
    if (!restaurants[0])
      return res.status(404).json({ message: "Restaurants not found" });

    res.status(200).json({ restaurants: restaurants });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Something went wrong, please try again later" });
    console.log(error);
  }
});

restaurantRouter.get("/restaurants/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const restaurant = await RestaurantModel.findOne({ _id: id });
    if (!restaurant)
      return res.status(404).json({ message: "Restaurant not found" });

    res.status(200).json({ restaurant: restaurant });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Something went wrong, please try again later" });
    console.log(error);
  }
});

restaurantRouter.post("/restaurants/add", async (req, res) => {
  const payload = req.body;
  try {
    const restaurant = await RestaurantModel.findOne({ name: payload.name });
    if (restaurant)
      return res
        .status(200)
        .json({ message: "Restaurant with name already exists" });

    const restaurants = new RestaurantModel(payload);
    await restaurants.save();

    res.status(200).json({ message: "Restaurant created" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Something went wrong, please try again later" });
    console.log(error);
  }
});

restaurantRouter.get("/restaurants/:id/menu", async (req, res) => {
  const { id } = req.params;
  try {
    const restaurant = await RestaurantModel.findOne({ _id: id });
    if (!restaurant)
      return res.status(404).json({ message: "Restaurant not found" });

    res.status(201).json({ menu: restaurant.menu });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Something went wrong, please try again later" });
    console.log(error);
  }
});

// restaurantRouter.get("/restaurants/:Resid/menu/:Menuid", async (req, res) => {
//   const { Resid, Menuid } = req.params;
//   try {
//     const restaurant = await RestaurantModel.findOne({ _id: Resid });
//     if (!restaurant)
//       return res.status(404).json({ message: "Restaurant not found" });

//     const menu = await RestaurantModel.findOne({ _id: Menuid });
//     if (!menu) return res.status(404).json({ message: "menu not found" });

//     res.status(202).json({ menu: menu });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ error: "Something went wrong, please try again later" });
//     console.log(error);
//   }
// });

module.exports = { restaurantRouter };
