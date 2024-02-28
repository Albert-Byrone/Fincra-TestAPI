const express = require('express');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const { createTicket, getTicketById, updateTicketStatus, assignTicket, getTicketsByUser, getClosedTicketReport } = require('../controller/ticket.controller');

const router = express.Router();

// Middleware to authenticate  all routes
router.use(authenticate)

// POST /tickets - Create  a new ticket
router.post('/', authorize('customer'), createTicket);

// GET /tickets/:id - Get a ticket by ID
router.get('/:id', authorize('customer', 'support', 'admin'), getTicketById);

// PATCH /tickets/:id/status - Update ticket status
router.patch('/:id/status', authorize('support', 'admin'), updateTicketStatus);

// PATCH /tickets/:id/assign - Assign ticket to a support agent
router.patch('/:id/assign', authorize('admin'), assignTicket);

router.get('/user/tickets', authenticate, authorize('customer'), getTicketsByUser);

// GET /tickets/report/closed - Report on closed tickets in the last month
router.get('/monthly/report', authenticate, authorize('support'), getClosedTicketReport);




module.exports = router;
