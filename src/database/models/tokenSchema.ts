import mongoose, { Schema } from 'mongoose';
import { IUser } from './userSchema';

export interface IToken {
  userId: Schema.Types.ObjectId;
  token: string;
}

const token = new Schema<IToken>({
	userId: {
		type: Schema.Types.ObjectId,
		ref: "user",
		required: true,
	},
	token: {
		type: String,
		required: true,
	},
}, { timestamps: {createdAt: 'createdAt', updatedAt: 'updatedAt'}});

const Token = mongoose.model<IToken>('Token', token);

export default Token;