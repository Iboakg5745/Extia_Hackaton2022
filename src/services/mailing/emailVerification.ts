import sgMail from '@sendgrid/mail';
import crypto from 'crypto';
import Token from '../../database/models/tokenSchema';
import { IUser } from '../../database/models/userSchema';

export async function sendUserVerification(user: IUser): Promise<Object> {

	let token = await new Token({
		userId: user._id,
		token: crypto.randomBytes(32).toString("hex"),
	  }).save();
	if (process.env.NODE_ENV as string === 'dev')
		return {message: "Done"};
    sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
	const msg = {
		to: user.email,
		from: 'contact@togathr.io',
		templateId: 'd-53f3522ae58840f4a8a10c80df7e2428',
		dynamicTemplateData: {
		  token: token.token,
		  id: user._id
		},
	};
	sgMail
	.send(msg)
	.catch((error : any) => {
		console.error(error)
	})
	return {message: "Done"};
}