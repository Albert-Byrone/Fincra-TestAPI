
const mongoose = require('mongoose')

const objectId = mongoose.Schema.Types.ObjectId;


const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true,
  },
  createdBy: {
    type: objectId,
    ref: 'User',
    required: true,
  },
  ticket: {
    type: objectId,
    ref: 'Ticket',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});


const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;

