const { createComment, getCommentsByTicket } = require('../controller/comment.comtroller');
const Ticket = require('../models/Ticket');
const Comment = require('../models/Comment');

jest.mock('../models/Ticket');
jest.mock('../models/Comment');

describe('Comment Controller', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockReq = {
      body: {},
      params: {},
      user: { _id: 'user_id', role: 'customer' },
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createComment', () => {
    it('should return 404 if ticket not found', async () => {
      Ticket.findById = jest.fn().mockResolvedValue(null);
      await createComment(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Ticket not found' });
    });

    it('should return 403 if a customer tries to comment before an agent', async () => {
      mockReq.body = { content: 'Test Comment', ticketId: 'ticket_id' };
      Ticket.findById = jest.fn().mockResolvedValue(true); // Simulate ticket exists
      Comment.findOne = jest.fn().mockResolvedValue(null); // Simulate no agent comment
      await createComment(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'A support agent must comment before a customer can comment' });
    });

    it('should create a comment successfully', async () => {
      mockReq.body = { content: 'Test Comment', ticketId: 'ticket_id' };
      Ticket.findById = jest.fn().mockResolvedValue(true); // Simulate ticket exists
      Comment.findOne = jest.fn().mockResolvedValue(true); // Simulate agent comment exists
      Comment.prototype.save = jest.fn().mockResolvedValue(true); // Simulate comment save
      await createComment(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Comment created successfully' }));
    });
  });

  describe('getCommentsByTicket', () => {
    it('should return 404 if ticket not found', async () => {
      mockReq.params.ticketId = 'ticket_id';
      Ticket.findById = jest.fn().mockResolvedValue(null);
      await getCommentsByTicket(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Ticket not found' });
    });
  });
});