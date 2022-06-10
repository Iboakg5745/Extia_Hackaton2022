import mongoose, { Schema } from 'mongoose';

interface IRoom {
  type: string;
  users: string[];
  filter: string[];
  meetURL: string;
  status: string;
  eventAt: Date;
}

const roomSchema = new Schema<IRoom>({
  type: {
    type: String,
    required: false
  },
  filter: {
    type: Array,
    required: false
  },
  users: {
    type: Array,
    required: false
  },
  meetURL: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  eventAt: {
    type: Date,
    required: false
  },
}, { timestamps: {createdAt: 'createdAt', updatedAt: 'updatedAt'}});

const Room = mongoose.model<IRoom>('Room', roomSchema);

export default Room;