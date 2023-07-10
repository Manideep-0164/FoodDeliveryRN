const express = require("express");
const orderRouter = express.Router();
require("dotenv").config();
const { OrderModel } = require("../models/order.model");

orderRouter.post("/orders", async (req, res) => {
  const payload = req.body;
  try {
    const prices = payload.items.map((item) => item.price * item.quantity);
    let sum = 0;
    prices.forEach((price) => {
      sum += price;
    });
    payload.totalPrice = sum;

    const newOrder = new OrderModel(payload);
    await newOrder.save();

    res.status(201).json({ message: "Order Placed" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Something went wrong, please try again later" });
    console.log(error);
  }
});

orderRouter.get("/orders/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const order = await OrderModel.findOne({ _id: id });
    if (!order) return res.status(404).json({ message: "order not found" });

    res.status(200).json({ order: order });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Something went wrong, please try again later" });
    console.log(error);
  }
});

orderRouter.patch("/orders/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const order = await OrderModel.findOne({ _id: id });
    if (!order) return res.status(404).json({ message: "order not found" });

    await OrderModel.findByIdAndUpdate(id, { status: status });
    res.status(204).json({ message: "successfully updated status" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Something went wrong, please try again later" });
    console.log(error);
  }
});

module.exports = { orderRouter };
