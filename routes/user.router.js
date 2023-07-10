const express = require("express");
const userRouter = express.Router();
require("dotenv").config();
const { UserModel } = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

userRouter.post("/register", async (req, res) => {
  const payload = req.body;
  try {
    const userExists = await UserModel.findOne({ email: payload.email });
    if (userExists)
      return res.status(200).json({ message: "User Exists, please login" });

    bcrypt.hash(payload.password, 5, async (err, hash) => {
      if (err) {
        console.log(err);
        return res
          .status(400)
          .json({ error: "Something went wrong, please try again later" });
      }
      payload.password = hash;
      const storeUser = new UserModel(payload);
      await storeUser.save();
      res.status(201).json({ message: "Registration Success" });
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Something went wrong, please try again later" });
    console.log(error);
  }
});

userRouter.get("/getuser", async (req, res) => {
  const payload = req.body;
  try {
    const userExists = await UserModel.findOne({ email: payload.email });
    if (!userExists)
      return res.status(200).json({ message: "User Does not exists" });

    res.status(200).json({ user: userExists });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Something went wrong, please try again later" });
    console.log(error);
  }
});

userRouter.post("/login", async (req, res) => {
  const payload = req.body;
  try {
    const userExists = await UserModel.findOne({ email: payload.email });
    if (!userExists)
      return res
        .status(200)
        .json({ message: "User not found, please register" });

    bcrypt.compare(
      payload.password,
      userExists.password,
      async (err, result) => {
        if (err) {
          console.log(err);
          return res
            .status(400)
            .json({ error: "Something went wrong, please try again later" });
        }
        if (!result)
          return res.status(400).json({ message: "Incorrect email/password" });

        const token = jwt.sign(
          { userId: userExists._id },
          process.env.USER_SECRET,
          { expiresIn: "1H" }
        );

        res.status(201).json({ message: "Login Success", token: token });
      }
    );
  } catch (error) {
    res
      .status(500)
      .json({ error: "Something went wrong, please try again later" });
    console.log(error);
  }
});

userRouter.patch("/user/:id/reset", async (req, res) => {
  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;
  try {
    const userExists = await UserModel.findOne({ _id: id });
    if (!userExists)
      return res
        .status(200)
        .json({ message: "User not found, please register" });

    bcrypt.compare(
      currentPassword,
      userExists.password,
      async (err, result) => {
        if (err) {
          console.log(err);
          return res
            .status(400)
            .json({ error: "Something went wrong, please try again later" });
        }
        if (!result)
          return res.status(400).json({ message: "Incorrect password" });

        bcrypt.hash(newPassword, 5, async (err, hash) => {
          if (err) {
            console.log(err);
            return res
              .status(400)
              .json({ error: "Something went wrong, please try again later" });
          }
          await UserModel.findByIdAndUpdate(id, { password: hash });
          res.status(204).json({ message: "Password reset successfull" });
        });
      }
    );
  } catch (error) {
    res
      .status(500)
      .json({ error: "Something went wrong, please try again later" });
    console.log(error);
  }
});

module.exports = { userRouter };
