import { Router } from "express";
import jwt from "jsonwebtoken";
import { Cart, Order, User } from "../collections";
import { JWTRequest } from "../models/JWTRequest";

const { JWT_SECRET = "test" } = process.env;

const userRouter = Router();

userRouter.post("/check", async (req, res) => {
  const { id, email, password } = req.body;

  const isExist = await User.findOne({ $or: [{ email }, { id }] }).exec();

  if (!/^[0-9]{8,9}$/.test(id)) {
    return res.status(400).send({ success: false, error: "ID invalid." });
  }

  if (
    !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      email
    )
  ) {
    return res.status(400).send({ success: false, error: "Email invalid." });
  }

  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,30}$/.test(password)) {
    return res.status(400).send({ success: false, error: "Passowrd invalid" });
  }

  if (isExist) {
    res
      .status(400)
      .send({ success: false, error: "Email or ID already exist." });
  } else {
    res.send({ success: true });
  }
});

userRouter.post("/register", async (req, res) => {
  const userData = req.body;

  try {
    const userId = await User.register(userData);

    const token = jwt.sign({ userId, role: "user" }, JWT_SECRET);

    userData.role = "user";

    res.send({ success: true, userData, token });
  } catch (error) {
    res.status(400).send({ success: false, error: error.message });
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);

    const cart = await Cart.findById(user.currentCartId).exec();

    const order = await Order.findOne({ userId: user._id }).exec();

    const userData = {
      role: user.role,
      name: user.name,
      lastname: user.lastname,
      id: user.id,
      city: user.city,
      street: user.street,
      currecntCartId: user.currentCartId,
    };

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET);

    res.send({
      success: true,
      token,
      userData,
      currentCartDate: cart?.creationDate,
      lastOrderDate: order?.orderDate,
    });
  } catch (error) {
    res.status(401).send({ success: false, error: error.message });
  }
});

userRouter.get("/authenticate", async (req: JWTRequest, res) => {
  const { userId } = req.user;

  try {
    const user = await User.findById(userId).exec();

    if (!user) {
      return res.status(401).send({ success: false, error: "Invalid token." });
    }

    const cart = await Cart.findById(user.currentCartId).exec();

    const order = await Order.findOne({ userId: user._id }).exec();

    const userData = {
      role: user.role,
      name: user.name,
      lastname: user.lastname,
      id: user.id,
      city: user.city,
      street: user.street,
      currentCartId: user.currentCartId,
    };

    res.send({
      success: true,
      userData,
      currentCartDate: cart?.creationDate,
      lastOrderDate: order?.orderDate,
    });
  } catch {
    res.status(401).send({ success: false, error: "Invalid token" });
  }
});

userRouter.get("/ping", async (req: JWTRequest, res) => {
  const { userId } = req.user;

  if (!userId) {
    return res.status(401).send({ success: false });
  }

  const user = await User.findById(userId).exec();

  if (!user) {
    return res.status(404).send({ success: false });
  }

  res.send({ success: true });
});

export { userRouter };
