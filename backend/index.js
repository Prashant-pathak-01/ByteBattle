import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import database from "./Database/db.js";
import Routes from "./Routes/Route.js";

const app = express();

app.use(cors());
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", Routes);

app.use(express.json());

database();

app.listen(8000, () => {
  console.log("Running on port 8000");
});
