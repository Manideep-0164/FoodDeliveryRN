const express = require("express");
const app = express();
const connection = require("./config/db");
const { userRouter } = require("./routes/user.router");
const { restaurantRouter } = require("./routes/restaurant.router");
const { orderRouter } = require("./routes/order.router");

require("dotenv").config();

app.use(express.json());
const port = process.env.PORT || 1000;

app.get("/", (req, res) => {
  res.status(200).send("Server working");
});

app.use("/api", userRouter);
app.use("/api", restaurantRouter);
app.use("/api", orderRouter);

app.listen(port, async () => {
  try {
    await connection;
    console.log(`Connected to DB`);
  } catch (error) {
    console.log(error);
  }
  console.log(`Server is running at the port: ${port}`);
});
