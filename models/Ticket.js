// import { Schema, model, Document } from 'mongoose';
const mongoose = require("mongoose");

const objectId = mongoose.Schema.Types.ObjectId;

const ticketSchema = new mongoose.Schema({
  _id: {
    type: objectId,
    auto: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  createdBy: {
    type: objectId,
    ref: 'User',
    required: true,
  },
  assignedTo: {
    type: objectId,
    ref: 'User',
    default: null,
  },
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'open',
  },
  comments: [{
    type: objectId,
    ref: 'Comment',
  }],
  closeDate: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
});


const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;

