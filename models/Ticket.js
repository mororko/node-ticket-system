import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const ticketSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    user: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "in-progress", "closed"],
      default: "open",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        delete ret._id;
        delete ret.__v;
      },
      virtuals: true,
    },
  }
);

ticketSchema.index({ id: 1, user: 1 });

const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket;
