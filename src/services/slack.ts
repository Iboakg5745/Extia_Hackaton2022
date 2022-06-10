import https from 'https';
import { resolve } from 'path';
import { IUserValid } from '../database/models/userValidationSchema';

export function slackValidationBody(validation: IUserValid, isNew : boolean = true) {
	let message = isNew ? 'A new userValidation  is waiting to be moderated' : 'A userValidation has been updated and is waiting to be moderated';
	const messageBody = {
		"username": "Verification notifier",
		"text": message + " <!everyone> ",
		"icon_emoji": ":hourglass:",
		"attachments": [
		  {
			"color": "#2eb886",
			"fields": [
			  {
				"title": "Environment",
				"value": process.env.NODE_ENV,
				"short": true
			  },
			  {
				"title": "SIRET",
				"value": validation.siret,
				"short": true
			  },
			  {
				"title": "Website",
				"value": validation.website,
				"short": true
			  },
			  {
				"title": "Status",
				"value": validation.status,
				"short": true
			  },
			  {
				"title": "Description",
				"value": validation.comment,
				"short": false
			  }
			],
			"actions": [
			  {
				"type": "button",
				"text": "Show the validation",
				"url": "http://example.com"
			  },
			  {
				"type": "button",
				"text": "Approve it",
				"style": "primary",
				"url": "http://example.com"
			  },
			  {
				"type": "button",
				"text": "Cancel it",
				"style": "danger",
				"url": "http://example.com/order/1/cancel"
			  }
			]
		  }
		]
	  };
	return messageBody;
}

export function sendSlackMessage (messageBody: any) {
	const webhookURL = process.env.SLACK_WEBHOOK_URL;
	if (process.env.NODE_ENV !== 'production')
		return resolve(` Any notification will be sent to Slack in ${process.env.NODE_ENV}`);
  	try {
    	messageBody = JSON.stringify(messageBody);
  	} catch (e) {
    	throw new Error('Failed to stringify messageBody');
  	}

  	return new Promise((resolve, reject) => {
    	const requestOptions = {
      		method: 'POST',
      		header: {
        	'Content-Type': 'application/json'
      	}
    };

    const req = https.request(webhookURL as string, requestOptions, (res) => {
      let response = '';
      res.on('data', (d) => {
        response += d;
      });
      res.on('end', () => {
        resolve(response);
      })
    });
    req.on('error', (e) => {
      reject(e);
    });
    req.write(messageBody);
    req.end();
  });
}