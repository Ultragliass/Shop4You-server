import { connect } from "mongoose";

const MONGODB_URL = "mongodb://localhost:27017"; // If using a remote server, paste the url here.
const DATABASE_NAME = "shop"; // Alter the database name if necessary.

export async function connectDatabase() {
  await connect(MONGODB_URL, {
    dbName: DATABASE_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}
