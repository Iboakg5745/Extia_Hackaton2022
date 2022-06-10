import express from 'express';
import { Request } from 'node-fetch';
import fetch from 'node-fetch';
import { createClient } from 'redis';
import { nextTick } from 'process';
export const TravelController = express.Router();

async function getWeather(city : String)
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

async function getPopulation(city : String)
{
	return {"population" : city + "/personnes"}
}

async function getPrices(city : String)
{
	return {"price" : city + "€"}
}

async function merger(json: any, from : String, to : String, cb : Function) {
	Object.assign(json["" + from], await cb(from));
	Object.assign(json["" + to], await cb(to));

	return json;
}

async function ComputeCalls(json: any, req : any)
{
	let widgets : String[] = ["price", "weather", "population"];
	let funcs : Function[] = [getPrices, getWeather, getPopulation];
	let resp = {};

	for (let i = 0; i < funcs.length; i++) {
		if (!req.body.widgets.includes(widgets[i]))
			continue;
		json = Object.assign (json, await merger(json, req.body.from, req.body.to, funcs[i]));
	}
	return json;
}

TravelController.post("/", async (req, res) => {
	var jsonArray = '{"' + req.body.from  + '": {}, "' + req.body.to + '": {}}'
	var json = JSON.parse(jsonArray);

	json = await ComputeCalls(json, req);
	return res.status(200).json(json);
  });