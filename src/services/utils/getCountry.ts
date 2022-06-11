import fetch, { BodyInit } from 'node-fetch';
import { createClient } from 'redis';
var axios = require('axios');

export async function getCountry(city : String)
{

	const client = createClient();
	client.on('error', (err : any) => console.log('Redis Client Error', err));
	await client.connect();

	const value = await client.get('getCity-' + city);
	if (value) {
		console.log('getCity-' + city + " from cache.");
		console.log(value);
		return JSON.parse(value);
	}
	let res = {"getCity": null};
	var config = {
		method: 'post',
		url: 'https://countriesnow.space/api/v0.1/countries/population/cities',
		headers: {'Content-Type': 'application/json'},
		data : '{\n    "city": "' + city + '"\n}'
	  };
	axios(config)
	.then(async function (response: any) {
		let resp = response.data;
		res = {"getCity": resp.data.country};
		console.log(resp.data.country);
		await client.set('getCity-' + city, JSON.stringify(resp.data.country));
		await client.expire('getCity-' + city, 60 * 60);
		console.log('getCity-' + city + " from API Request.");
		return resp.data.country;
	}).catch(function (error : any) {
		console.log(error);
	});
	return res;
}