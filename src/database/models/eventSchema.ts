import mongoose, { Schema } from 'mongoose';

interface IEvent {
  ownerID: string;
  type: string;
  filter: string[];
  status: string;
  note: Number;
  feedback: String;
  date: Date;
  eventAt: Date;
}

const eventSchema = new Schema<IEvent>({
  ownerId: {
    type: String,
    required: false
  },
  type: {
    type: String,
    required: false
  },
  filter: {
    type: Array,
    required: false
  },
  status: {
    type: String,
    required: true
  },
  note: {
    type: Number,
    required: false
  },
  feedback: {
    type: String,
    required: false
  },
  date: {
    type: Date,
    required: false
  },
  eventAt: {
    type: Date,
    required: false
  },
}, { timestamps: {createdAt: 'createdAt', updatedAt: 'updatedAt'}});

const Event = mongoose.model<IEvent>('Event', eventSchema);

export default Event;