import mongoose, { Schema } from 'mongoose';

interface IReport {
  reportedUserId: string;
  ownerId: string;
  type: string;
  comment: string;
  roomId: string;
  status: string;
}

const reportSchema = new Schema<IReport>({
  reportedUserId: {
    type: String,
    required: false
  },
  ownerId: {
    type: String,
    required: false
  },
  type: {
    type: String,
    required: false
  },
  comment: {
    type: String,
    required: false
  },
  roomId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
}, { timestamps: {createdAt: 'createdAt', updatedAt: 'updatedAt'}});

const Report = mongoose.model<IReport>('Report', reportSchema);

export default Report;