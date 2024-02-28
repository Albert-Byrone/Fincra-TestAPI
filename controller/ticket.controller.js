
const Ticket = require('../models/Ticket');
const moment = require('moment');
const { AsyncParser } = require('@json2csv/node');
// Create a new ticket
const createTicket = async (req, res) => {
  try {
    const { title, description } = req.body;
    const ticket = new Ticket({
      title,
      description,
      createdBy: req.user._id,
    });
    await ticket.save();
    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'Error creating ticket', error: error.message });
  }
};


const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate('createdBy', 'name').populate('comments');
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching ticket', error: error.message });
  }
}

// Function to get tickets by user, including the status of each ticket
const getTicketsByUser = async (req, res) => {
  try {
    const tickets = await Ticket.find({ createdBy: req.user._id })
      .select('title status createdAt')
      .sort({ createdAt: -1 }); // Sorting by creation date, newest first
    if (tickets.length === 0) {
      return res.status(404).json({ message: 'No tickets found for this user' });
    }
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tickets', error: error.message });
  }
};


// Update ticket status
const updateTicketStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const ticket = await Ticket.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'Error updating ticket', error: error.message });
  }
};



// Assign ticket to support agent
const assignTicket = async (req, res) => {
  try {
    const { agentId } = req.body;
    const agent = await User.findById(agentId);
    if (!agent || agent.role !== 'support') {
      return res.status(400).json({ message: 'Invalid agent' });
    }
    const ticket = await Ticket.findByIdAndUpdate(req.params.id, { assignedTo: agentId }, { new: true });
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'Error assigning ticket', error: error.message });
  }
};






const getClosedTicketReport = async (req, res) => {
  try {
    const oneMonthAgo = moment().subtract(1, 'months').toDate();
    const tickets = await Ticket.find({
      status: 'closed',
      updatedAt: { $gte: oneMonthAgo }
    }).populate('comments');

    console.log("tickets", tickets);

    const formattedData = tickets.map(ticket => ({
      TicketID: ticket._id.toString(),
      Title: ticket.title,
      ClosedAt: ticket.updatedAt.toISOString(),
      Comments: ticket.comments.map(comment => comment.text).join('; ') // Concatenate all comments
    }));

    const opts = {}; // CSV options
    const transformOpts = {}; // Stream transform options
    const asyncOpts = {}; // Async options
    const parser = new AsyncParser(opts, asyncOpts, transformOpts);

    // Using the promise method as per your reference
    const csv = await parser.parse(formattedData).promise();

    // Convert to CSV and download
    parser.parse(formattedData).promise()
      .then(csv => {
        res.header('Content-Type', 'text/csv');
        res.header('Content-Disposition', 'attachment; filename=closed-tickets-with-comments-last-month.csv');
        res.send(csv);
        res.status(200).json({ message: 'The data has been successfully exported' });
      })
      .catch(err => {
        res.status(500).json({ message: 'Error exporting data to CSV', error: err.message });
      });

  } catch (error) {
    res.status(500).json({ message: 'Error fetching closed tickets with comments', error: error.message });
  }
};
module.exports = { createTicket, getTicketById, getTicketsByUser, updateTicketStatus, assignTicket, getClosedTicketReport }
