import mongoose, { Schema } from 'mongoose';

interface IEvent {
  ownerID: string;
  type: string;
}

const eventSchema = new Schema<IEvent>({
  ownerId: {
    type: String,
    required: false
  },
  type: {
    type: String,
    required: false
  }
}, { timestamps: {createdAt: 'createdAt', updatedAt: 'updatedAt'}});

const Event = mongoose.model<IEvent>('Event', eventSchema);

export default Event;