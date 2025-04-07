import "dotenv/config";
import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import usersRoutes from "./routes/usersRoutes.js";
import ticketsRoutes from "./routes/ticketsRoutes.js";
import error from "./middlewares/error.js";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import rateLimit from "express-rate-limit";

const app = express();

const DB_URL =
  process.env.NODE_ENV === "test"
    ? "mongodb://localhost:27017/ticket-system-test"
    : process.env.DB_URL || "mongodb://localhost:27017/ticket-system";

mongoose
  .connect(DB_URL)
  .then(() => console.log("Conected to DB:", DB_URL))
  .catch((err) => console.error("MongoDB connection error:", err));

// Middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(compression);
app.use(express.json());
app.use(rateLimit);

app.get("/ping", (req, res) => {
  res.status(200).send("pong");
});

app.use("/api/users", usersRoutes);
app.use("/api/tickets", ticketsRoutes);
app.use(error);

export default app;
