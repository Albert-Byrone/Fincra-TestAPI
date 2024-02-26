import { Schema, model, Document } from 'mongoose';

interface IComment extends Document {
  content: string;
  createdBy: Schema.Types.ObjectId;
  ticket: Schema.Types.ObjectId;
  createdAt: Date;
}

const commentSchema = new Schema<IComment>({
  content: {
    type: String,
    required: true,
    trim: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  ticket: {
    type: Schema.Types.ObjectId,
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

const Comment = model<IComment>('Comment', commentSchema);

export default Comment;
