import express from 'express';

export const travelController = express.Router();

travelController.post("/", async (req, res) => {
	console.log(req.body);
	let json = {
		message: "endpoint working",
		from: req.body,
	}
	return res.status(200).json(json);
  });