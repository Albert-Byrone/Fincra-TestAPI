const Ticket = require("../models/Ticket")
const Comment = require("../models/Comment")



// Function to create a comment on a support request
const createComment = async (req, res) => {
  try {
    const { content, ticketId } = req.body;
    const userId = req.user._id;

    // Check if the ticket exists
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Check if a support agent has commented on the ticket before allowing a customer to comment
    if (req.user.role === 'customer') {
      const agentComment = await Comment.findOne({ ticket: ticketId, createdBy: { $ne: userId } });
      if (!agentComment) {
        return res.status(403).json({ message: 'A support agent must comment before a customer can comment' });
      }
    }

    // Create the comment
    const comment = new Comment({
      content,
      createdBy: userId,
      ticket: ticketId,
    });

    await comment.save();

    res.status(201).json({ message: 'Comment created successfully', comment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};




// Function to get comments for a ticket
const getCommentsByTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;

    // Check if the ticket exists
    const ticketExists = await Ticket.findById(ticketId);
    if (!ticketExists) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    const comments = await Comment.find({ ticket: ticketId }).populate('createdBy', 'name');

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
module.exports = { createComment, getCommentsByTicket }