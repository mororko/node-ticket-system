import "dotenv/config";
import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import usersRouters from "./routes/usersRoutes.js";
import ticketsRouters from "./routes/ticketsRoutes.js";

const app = express();
const DB_URL = process.env.DB_URL || "mongodb://localhost:27017/ticket-system";

mongoose
  .connect(DB_URL)
  .then(() => console.log("Conected to DB:", DB_URL))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(morgan("dev"));
app.use(express.json());

app.get("/ping", (req, res) => {
  res.status(200).send("pong");
});

app.use("/api/users", usersRouters);
app.use("/api/tickets", ticketsRouters);

export default app;
