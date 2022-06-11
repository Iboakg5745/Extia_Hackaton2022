import fetch, { BodyInit } from 'node-fetch';
import { createClient } from 'redis';
var axios = require('axios');

export async function getCountryCode(country : String)
{

	const client = createClient();
	client.on('error', (err : any) => console.log('Redis Client Error', err));
	await client.connect();

	const value = await client.get('getcountryCode-' + country);
	if (value) {
		console.log('getcountryCode-' + country + " [" + value + "] from cache.");
		return value;
	}
	let res = {"getcountryCode": null};
	var config = {
		method: 'post',
		url: 'https://countriesnow.space/api/v0.1/countries/iso',
		headers: {'Content-Type': 'application/json'},
		data : '{\n    "country": "' + country + '"\n}'
	  };
	await axios(config)
	.then(async function (response: any) {
		let resp = response.data;
		res = resp.data.Iso2;
		await client.set('getcountryCode-' + country, resp.data.Iso2);
		console.log('getcountryCode-' + country + " from API Request.");
		return resp.data.Iso2;
	}).catch(function (error : any) {
		console.log(error);
	});
	return res;
}