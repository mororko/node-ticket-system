import express from "express";
import Ticket from "../models/Ticket.js";
import auth from "../middlewares/auth.js";
import admin from "../middlewares/admin.js";
import buildFilter from "../middlewares/filter.js";
import pagination from "../middlewares/pagination.js";
import ticketSchema from "../validations/ticketValidation.js";

const router = express.Router();

// Get all tickets
// GET /api/tickets
// GET /api/tickets?status=closed&priority=high
//GET /api/tickets?search=bug
//GET /api/tickets?pageSize=10&page=2
//Public
router.get("/", buildFilter, pagination(Ticket), async (req, res) => {
  res.status(200).json(req.paginatedResults);
});

// Get a single ticket by ID
// GET /api/tickets/:id
// Public
router.get("/:id", async (req, res) => {
  try {
    const ticket = await Ticket.findOne({ id: req.params.id });
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    res.status(200).json({ ticket: ticket });
  } catch (err) {
    res.status(500).json({ message: "Server Error:" + err.message });
  }
});

// Create a new ticket
// POST /api/tickets
// Private (must be logged in)
// Ticket schema: user, title, description, status, priority
router.post("/", auth, async (req, res) => {
  const { error } = ticketSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const ticket = new Ticket({
    user: req.user._id,
    title: req.body.title,
    description: req.body.description,
    status: req.body.status,
    priority: req.body.priority,
  });

  try {
    const savedTicket = await ticket.save();
    console.log("ticket saved", savedTicket);
    res.status(201).json({ ticket: savedTicket });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Server Error:" + err.message });
  }
});

// Update a ticket
// PUT /api/tickets/:id
// Private (must be logged in)
// Ticket schema: title, description, status, priority
router.put("/:id", auth, async (req, res) => {
  const update = req.body;
  try {
    const ticket = await Ticket.findByIdAndUpdate(req.params.id, update, {
      new: true,
    });
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    res.status(200).json({ ticket: ticket });
  } catch (err) {
    res.status(400).json({ message: "Server Error:" + err.message });
  }
});

// Delete a ticket
// DELETE /api/tickets/:id
// Private (must be logged in and admin)
// Ticket schema: id (must match the ticket being deleted)
router.delete("/:id", [auth, admin], async (req, res) => {
  try {
    const ticket = await Ticket.findOneAndDelete({ id: req.params.id });
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    res.status(200).json({ message: "Ticket deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error:" + err.message });
  }
});

export default router;
