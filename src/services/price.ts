import fetch from 'node-fetch';
import { createClient } from 'redis';
import { getCountry } from './utils/getCountry';

export async function getPrices(from : String, to : String)
{
	const encodedParams = new URLSearchParams();
	let fromCountry = await getCountry(from);
	let toCountry = await getCountry(to);
	encodedParams.append("cities", '[{"name":"' + from + '","country":"' + fromCountry + '"},{"name":"' + to + '","country":"' + toCountry + '"}]');
	encodedParams.append("currencies", "[\"USD\"]");

	const client = createClient();
	client.on('error', (err : any) => console.log('Redis Client Error', err));
	await client.connect();

	const value = await client.get('price-' + from + "-" + to);
	if (value) {
		console.log('price-' + from + "-" + to+ " from cache.");
		return JSON.parse(value);
	}
	let res = {"price": null};
	await fetch("https://cities-cost-of-living1.p.rapidapi.com/get_cities_details_by_name",
	{
  		"headers": {
    	"X-RapidAPI-Key": "4436e2f481msh26f5054b9868065p16f796jsneada7bd16ec2",
    	"X-RapidAPI-Host": "cities-cost-of-living1.p.rapidapi.com"
  	},
  	"body": encodedParams,
  	"method": "POST"
	})
	.then(async data => {
		let resp = await data.json();
		res = {"price": resp};
		await client.set('price-' + from + "-" + to, JSON.stringify(res));
		await client.expire('price-' + from + "-" + to, 60 * 60 * 24 * 365);
		console.log('price-' + from + "-" + to + " from API Request.");
		return {"price" : resp}
	}).catch(err => console.error(err));
	return res;
}