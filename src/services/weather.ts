import fetch from 'node-fetch';
import { createClient } from 'redis';

export async function getWeather(city : String)
{

	const client = createClient();
	client.on('error', (err : any) => console.log('Redis Client Error', err));
	await client.connect();

	const value = await client.get('weather-' + city);
	if (value) {
		console.log('weather-' + city + " from cache.");
		console.log(value);
		return JSON.parse(value);
	}
	let res = {"weather": null};
	await fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=a359a042fe918e1ad8eb21795b23e814&units=metric",
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
		res = {"weather": resp.main};
		await client.set('weather-' + city, JSON.stringify(res));
		await client.expire('weather-' + city, 60 * 60);
		console.log('weather-' + city + " from API Request.");
	}).catch(err => console.error(err));
	return res;
}