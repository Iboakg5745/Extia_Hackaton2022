import fetch from 'node-fetch';
import { createClient } from 'redis';
import { getCountry } from './utils/getCountry';

export async function getCovid(city : String)
{

	const client = createClient();
	client.on('error', (err : any) => console.log('Redis Client Error', err));
	await client.connect();

	let country = await getCountry(city);
	const value = await client.get('covid-' + country);
	if (value) {
		console.log('covid-' + country + " from cache.");
		return JSON.parse(value);
	}
	let res = {"covid": null};
	await fetch("https://covid-api.mmediagroup.fr/v1/vaccines?country=" + country,
	{
  		"headers": {
    	"accept": "*/*",
    	"accept-language": "en-US,en;q=0.9",
    	"sec-fetch-dest": "empty",
    	"sec-fetch-mode": "cors",
    	"sec-fetch-site": "cross-site",
    	"sec-gpc": "1"
  	},
  	"body": undefined,
  	"method": "GET"
	})
	.then(async data => {
		let resp = await data.json();
		res = {"covid": resp};
		await client.set('covid-' + country, JSON.stringify(res));
		await client.expire('covid-' + country, 60 * 60);
		console.log('covid-' + country + " from API Request.");
	}).catch(err => console.error(err));
	return res;
}