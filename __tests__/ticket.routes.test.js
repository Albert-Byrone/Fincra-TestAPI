// Test for ticket.controller.js

const Ticket = require('../models/Ticket');
const User = require('../models/User');
const moment = require('moment');
const { createTicket, getTicketById, getTicketsByUser, updateTicketStatus, assignTicket, getClosedTicketReport } = require('../controller/ticket.controller');
const { AsyncParser } = require('@json2csv/node');

jest.mock('@json2csv/node', () => ({
  AsyncParser: jest.fn().mockImplementation(() => ({
    parse: () => ({ promise: () => Promise.resolve('id,title\n1,Test Ticket') }),
  })),
}));

describe('Ticket Controller', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockReq = {
      body: {},
      params: {},
      user: { _id: 'user_id' },
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
      header: jest.fn(),
    };

    // Mock Ticket.prototype.save for the "should create a new ticket" test
    Ticket.prototype.save = jest.fn().mockImplementation(function () {
      return Promise.resolve(this);
    });

    // Mock Ticket.find for the "should get closed ticket report" test
    Ticket.find = jest.fn().mockResolvedValue([
      { _id: 'ticket_id', title: 'Test Ticket', updatedAt: new Date(), comments: [{ text: 'Comment 1' }] }
    ]);

    // Mock moment.subtract for the "should get closed ticket report" test
    moment.subtract = jest.fn().mockReturnValue({ toDate: jest.fn().mockReturnValue(new Date()) });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new ticket', async () => {
    mockReq.body = { title: 'Test Ticket', description: 'Test Description' };
    await createTicket(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalled();
  });

  it('should get a ticket by ID', async () => {
    mockReq.params.id = 'ticket_id';
    await getTicketById(mockReq, mockRes);
    expect(mockRes.json).toHaveBeenCalled();
  });

  it('should get tickets by user', async () => {
    await getTicketsByUser(mockReq, mockRes);
    expect(mockRes.json).toHaveBeenCalled();
  });

  it('should update ticket status', async () => {
    mockReq.params.id = 'ticket_id';
    mockReq.body = { status: 'in_progress' };
    await updateTicketStatus(mockReq, mockRes);
    expect(mockRes.json).toHaveBeenCalled();
  });

  it('should assign a ticket to a support agent', async () => {
    mockReq.params.id = 'ticket_id';
    mockReq.body = { agentId: 'agent_id' };
    User.findById = jest.fn().mockResolvedValue({ _id: 'agent_id', role: 'support' });
    await assignTicket(mockReq, mockRes);
    expect(mockRes.json).toHaveBeenCalled();
  });

});