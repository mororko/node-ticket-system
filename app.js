import "dotenv/config";
import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";

const app = express();
const DB_URL = process.env.DB_URL || "mongodb://localhost:27017/ticket-system";

mongoose
  .connect(DB_URL)
  .then(() => console.log("Conected to DB:", DB_URL))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("Hello World!!!");
});

export default app;
