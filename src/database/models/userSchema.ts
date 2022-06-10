import mongoose, { Schema } from 'mongoose';

export interface IUser {
	_id: Schema.Types.ObjectId | string;
    fullName: string;
    email: string;
    token: string;
    role: string;
    ref: string;
	isChartSigned: boolean;
	isValidated: boolean;
	IsEmailVerified: boolean;
	stripeCustomerId: string;
	subscription: string | null;
    password: string;
    stripeId: string;
	authMethod: string;
    eventAt: Date;
    meta: Object;
  }

const userSchema = new Schema<IUser>({
    fullName: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 255,
        unique: true
    },
    role: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 10
    },
	isChartSigned: {
        type: Boolean,
        required: false,
        default: false
    },
	isValidated: {
        type: Boolean,
        required: false,
        default: false
    },
	IsEmailVerified: {
        type: Boolean,
        required: false,
        default: false
    },
	ref: {
        type: String,
        required: false,
        minlength: 1
    },
	authMethod: {
        type: String,
        required: false,
		default: "email"
    },
    stripeCustomerId: {
        type: String,
        required: false,
        minlength: 1
    },
	subscription: {
        type: String,
        required: false,
        default: null
    },
    password: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 1024
    },
    stripeId: {
        type: String,
        required: false,
        minlength: 0,
        maxlength: 100
    },
    meta: {
        type: Object,
        required: false
    },
}, { timestamps: {createdAt: 'createdAt', updatedAt: 'updatedAt'}})

const User = mongoose.model<IUser>('User', userSchema);

export default User;