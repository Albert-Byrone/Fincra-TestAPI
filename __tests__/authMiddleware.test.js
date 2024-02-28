const jwt = require('jsonwebtoken');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const User = require('../models/User');
const httpMocks = require('node-mocks-http');

jest.mock('jsonwebtoken');
jest.mock('../models/User');

describe('Authentication Middleware', () => {
  it('should validate token and attach user to req object', async () => {
    const user = { id: '123', name: 'Test User', role: 'support' };
    const token = 'Bearer validtoken123';
    const req = httpMocks.createRequest({
      method: 'GET',
      url: '/test',
      headers: {
        Authorization: token,
      },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    jwt.verify.mockReturnValue({ userId: user.id });
    User.findById.mockResolvedValue(user);

    await authenticate(req, res, next);

    expect(req.user).toBeDefined();
    expect(req.user.id).toBe(user.id);
    expect(next).toHaveBeenCalled();
  });

  // Add more tests for failure scenarios...
});

describe('Authorization Middleware', () => {
  it('should allow access if user has correct role', async () => {
    const req = httpMocks.createRequest({
      user: { role: 'admin' },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    const middleware = authorize('admin');
    await middleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  // Add more tests for failure scenarios...
});