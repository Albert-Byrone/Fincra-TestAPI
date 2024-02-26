import { Schema, model, Document } from 'mongoose';

interface ITicket extends Document {
  title: string;
  description: string;
  createdBy: Schema.Types.ObjectId;
  assignedTo: Schema.Types.ObjectId | null;
  status: 'open' | 'closed';
  comments: Array<Schema.Types.ObjectId>;
  closeDate: Date | null;
}

const ticketSchema = new Schema<ITicket>({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'open',
  },
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment',
  }],
  closeDate: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
});

const Ticket = model<ITicket>('Ticket', ticketSchema);

export default Ticket;
