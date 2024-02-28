const mongoose = require('mongoose');
const fs = require('fs');
const bcrypt = require('bcrypt');

const logger = require('./utils/logger');

const User = require('./models/User');
const Ticket = require('./models/Ticket');
const Comment = require('./models/Comment');

mongoose.connect('mongodb://localhost:27017/ticket_test')
  .then(() => logger.info('MongoDB connected'))
  .catch(err => logger.error(err));

const users = [
  { username: 'admin', email: 'admin@example.com', password: 'password123', role: 'admin' },
  { username: 'support', email: 'support@example.com', password: 'password123', role: 'support' },
  // Add more users as needed
];

const tickets = [
  { title: 'Issue with account', description: 'I cannot access my account.', createdBy: null /* This will be filled later */ },
  // Add more tickets as needed
];

const comments = [
  { content: 'We are looking into this issue.', createdBy: null, ticket: null /* These will be filled later */ },
  // Add more comments as needed
];

async function hashPasswords(users) {
  for (const user of users) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
}

async function insertSeedData() {
  await hashPasswords(users);
  const insertedUsers = await User.insertMany(users);

  // Update tickets with createdBy using insertedUsers
  tickets.forEach(ticket => {
    ticket.createdBy = insertedUsers[0]._id; // Assuming the first user is the creator for simplicity
  });
  const insertedTickets = await Ticket.insertMany(tickets);

  // Update comments with createdBy and ticket
  comments.forEach(comment => {
    comment.createdBy = insertedUsers[1]._id; // Assuming the second user is the commenter for simplicity
    comment.ticket = insertedTickets[0]._id; // Assuming the comment is for the first ticket
  });
  const insertedComments = await Comment.insertMany(comments);

  // Export to JSON
  fs.writeFileSync('users.json', JSON.stringify(insertedUsers, null, 2));
  fs.writeFileSync('tickets.json', JSON.stringify(insertedTickets, null, 2));
  fs.writeFileSync('comments.json', JSON.stringify(insertedComments, null, 2));

  logger.debug('Seed data inserted and exported.');
  process.exit();
}

insertSeedData().catch(err => {
  logger.error(err);
  process.exit(1);
});