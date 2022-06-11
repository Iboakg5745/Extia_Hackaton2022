import express from 'express';
import { getPopulation } from '../services/population';
import { getWeather } from '../services/weather';
import { getPrices } from '../services/price';
import { getCovid } from '../services/covid';
import { getNews } from '../services/news';

export const TravelController = express.Router();

async function merger(json: any, from : String, to : String, cb : Function) {
	Object.assign(json["" + from], await cb(from));
	Object.assign(json["" + to], await cb(to));

	return json;
}

async function ComputeCalls(json: any, req : any)
{
	let widgets : String[] = ["price", "weather", "population", "covid", "news"];
	let funcs : Function[] = [getPrices, getWeather, getPopulation, getCovid, getNews];
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