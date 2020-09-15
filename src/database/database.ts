import { connect } from "mongoose";

const MONGODB_URL = "mongodb://localhost:27017";
const DATABASE_NAME = "shop";

export async function connectDatabase() {
  await connect(MONGODB_URL, {
    dbName: DATABASE_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}
