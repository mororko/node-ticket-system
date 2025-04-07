import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import User from "../models/User.js";
import Ticket from "../models/Ticket.js";

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/ticket-system")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const users = [
  {
    name: "John",
    role: "admin",
    email: "admin@example.com",
    password: "admin12345678",
  },
  {
    name: "Jane",
    role: "user",
    email: "user@example.com",
    password: "user12345678",
  },
];

const status = ["open", "in-progress", "closed"];

const priority = ["low", "medium", "high"];

async function delateCollection() {
  await User.deleteMany({});
  console.log("Users collection deleted");
  await Ticket.deleteMany({});
  console.log("Tickets collection deleted");
}

async function createUsers() {
  for (const userData of users) {
    const user = new User(userData);
    await user.save();
    console.log("User created:", user);
  }
  console.log("Users created successfully");
}

async function createTickets() {
  const users = await User.find();

  for (let i = 0; i < 15; i++) {
    const ticket = new Ticket({
      title: `Ticket ${i + 1}`,
      description: `Description for ticket ${i + 1}`,
      status: status[Math.floor(Math.random() * status.length)],
      priority: priority[Math.floor(Math.random() * priority.length)],
      user: users[Math.floor(Math.random() * users.length)].id,
    });
    await ticket.save();
    console.log("Ticket created:", ticket);
  }
  console.log("Tickets created successfully");
}

async function populateDB() {
  await delateCollection();
  await createUsers();
  await createTickets();
  console.log("Database populated successfully");
  mongoose.connection.close();
}

populateDB();
