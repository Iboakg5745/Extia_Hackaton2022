import fetch from 'node-fetch';
import { createClient } from 'redis';

export async function getPrices(city : String)
{
	const encodedParams = new URLSearchParams();
	encodedParams.append("cities", "[{\"name\":\"Istanbul\",\"country\":\"Turkey\"},{\"name\":\"Paris\",\"country\":\"France\"}]");
	encodedParams.append("currencies", "[\"USD\"]");

	const client = createClient();
	client.on('error', (err : any) => console.log('Redis Client Error', err));
	await client.connect();

	const value = await client.get('price-' + city);
	if (value) {
		console.log('price-' + city + " from cache.");
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
		await client.set('price-' + city, JSON.stringify(res));
		await client.expire('price-' + city, 60 * 60 * 24 * 365);
		console.log('price-' + city + " from API Request.");
		return {"price" : resp}
	}).catch(err => console.error(err));
	return res;
}