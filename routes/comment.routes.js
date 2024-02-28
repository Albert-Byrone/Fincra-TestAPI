const express = require('express');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const { getCommentsByTicket, createComment } = require('../controller/comment.comtroller');
const { getTicketsByUser } = require('../controller/ticket.controller');

const router = express.Router();

// Route to create a comment on a  support request
// Authentication is required, and both customers and support agents can create comments
router.post('/create', authenticate, authorize('customer', 'support'), createComment);

//Route to get  a comment for a specific ticket
// Authentication is required, and this is accessible to customers, support agents and admins
router.get('/ticket/:ticketId', authenticate, authorize('customer', 'support', 'admin'), getCommentsByTicket);


module.exports = router;
