import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import expressJwt from "express-jwt";
import { connectDatabase } from "./database/database";
import { userRouter } from "./routers/user";
import { storeRouter } from "./routers/store";
import { cartRouter } from "./routers/cart";
import { orderRouter } from "./routers/order";
import { JWTError } from "./middleware/JWTError";

const PORT = 4201;

const { JWT_SECRET = "test" } = process.env;

const app = express();

app.use(express.json());

app.use(cors());

app.use(
  expressJwt({ secret: JWT_SECRET }).unless({
    path: ["/user/register", "/user/login", "/user/check", "/store"],
  })
);

app.use("/user", userRouter);

app.use("/store", storeRouter);

app.use("/cart", cartRouter);

app.use("/order", orderRouter);

app.use(JWTError());

startServer();

async function startServer() {
  await connectDatabase();

  app.listen(PORT, () => console.log(`Server listening on port ${PORT}.`));
}
