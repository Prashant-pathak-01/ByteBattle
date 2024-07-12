import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const MONGODB_USERNAME = process.env.MONGODB_USERNAME;
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;
const URL = `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@database.icx8y7w.mongodb.net/ByteBattle?retryWrites=true&w=majority&appName=database`;
async function db() {
  try {
    await mongoose.connect(URL);
    console.log("You successfully connected to MongoDB!");
  } catch (error) {
    console.log(error);
  }
}

export default db;
