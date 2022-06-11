import fetch from 'node-fetch';
import { createClient } from 'redis';
import { getCountry } from './utils/getCountry';
import { getCountryCode } from './utils/getCountryCode';

export async function getNews(city : String)
{

	const client = createClient();
	client.on('error', (err : any) => console.log('Redis Client Error', err));
	await client.connect();

	let country = await getCountry(city);
	let countryCode = await getCountryCode(country);
	const value = await client.get('news-' + countryCode);
	if (value) {
		console.log('news-' + countryCode + " from cache.");
		return JSON.parse(value);
	}
	let res = {"news": null};
	await fetch("https://newsapi.org/v2/top-headlines?country=" + countryCode + "&apiKey=8e465d1e374d4e3bb10140dfeaf216b2&pageSize=3",
	{
  		"headers": {
  	},
  	"body": undefined,
  	"method": "GET"
	})
	.then(async data => {
		let resp = await data.json();
		res = {"news": resp};
		await client.set('news-' + countryCode, JSON.stringify(res));
		await client.expire('news-' + countryCode, 60 * 60 * 24 * 3);
		console.log('news-' + countryCode + " from API Request.");
	}).catch(err => console.error(err));
	return res;
}