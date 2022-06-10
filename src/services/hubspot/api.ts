import * as hubspot from '@hubspot/api-client'
import { IUser } from '../../database/models/userSchema';
import { logger } from '../../logs/logger';

export async function createNewHubspotCustomer(user: IUser): Promise<Object> {

	if (process.env.NODE_ENV !== 'production')
		return {message: "Skipped in this environment."};
	const contactObj = {
		properties: {
			firstname: user.fullName.split(' ')[0],
			lastname: user.fullName.split(' ')[1],
			email: user.email,
			hs_lead_status: 'CONNECTED',
		},
	}
	const hubspotClient = new hubspot.Client({ apiKey: process.env.HUBSPOT_API_KEY as string });
	const createContactResponse = await hubspotClient.crm.contacts.basicApi.create(contactObj);
	if (createContactResponse && createContactResponse.properties.hs_lead_status === 'CONNECTED') {
		logger.info("Contact created successfully on hubspot.");
	} else {
		logger.error("Contact creation failed on hubspot.");
	}
	return {message: "Done"};
}