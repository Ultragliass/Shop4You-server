import express from "express";
import cors from "cors";
import expressJwt from "express-jwt";
import { connectDatabase } from "./database/database";
import { userRouter } from "./routers/user";

const PORT = 4201;

const { JWT_SECRET = "test" } = process.env;

const app = express();

app.use(express.json());

app.use(cors());

app.use(
  expressJwt({ secret: JWT_SECRET }).unless({
    path: ["/user/register", "/user/login"],
  })
);

app.use("/user", userRouter);

startServer();

async function startServer() {
  await connectDatabase();

  app.listen(PORT, () => console.log(`Server listening on port ${PORT}.`));
}
