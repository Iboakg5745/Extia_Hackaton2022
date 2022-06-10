import mongoose, { Schema } from 'mongoose';
import { IUser } from './userSchema';

export interface IUserValid {
  ownerId: string;
  website: string;
  siret: string;
  comment: string;
  status: string;
  eventAt: Date;
  owner: string;
}

const userValidationSchema = new Schema<IUserValid>({
  ownerId: {
    type: String,
    required: true
  },
  website: {
    type: String,
    required: false
  },
  siret: {
    type: String,
    required: false
  },
  comment: {
    type: String,
    required: false
  },
  status: {
    type: String,
    required: true
  },
}, { timestamps: {createdAt: 'createdAt', updatedAt: 'updatedAt'}});

const UserValidation = mongoose.model<IUserValid>('UserValidation', userValidationSchema);

export default UserValidation;