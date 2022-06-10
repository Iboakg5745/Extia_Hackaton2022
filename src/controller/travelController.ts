import express from 'express';
import { Request } from 'node-fetch';

export const TravelController = express.Router();

async function getWeather(city : String)
{
	return {"weather" : city}
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
	let funcs : Function[] = [getPrices, getWeather, getPopulation];
	let resp = {};

	for (let i = 0; i < funcs.length; i++) {
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