import { Router } from "express";
import jwt from "jsonwebtoken";
import { User } from "../collections";
import { JWTRequest } from "../models/JWTRequest";

const { JWT_SECRET = "test" } = process.env;

const userRouter = Router();

userRouter.post("/register", async (req, res) => {
  const userData = req.body;

  try {
    const userId = await User.register(userData);

    const token = jwt.sign({ userId, role: "user" }, JWT_SECRET);

    res.send({ success: true, token, role: "user" });
  } catch (error) {
    res
      .status(403)
      .send({ success: false, error: error.message});
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);

    const userData = {
      role: user.role,
      name: user.name,
      lastname: user.lastname,
      id: user.id,
      city: user.city,
      street: user.street,
    };

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET);

    res.send({ success: true, token, userData });
  } catch (error) {
    res.status(403).send({ success: false, error: error.message });
  }
});

userRouter.get("/authenticate", async (req: JWTRequest, res) => {
  const { userId } = req.user;

  const user = await User.findById(userId).exec();

  if (!user) {
    return res.status(401).end();
  }

  res.send({ success: true, user });
});

export { userRouter };
