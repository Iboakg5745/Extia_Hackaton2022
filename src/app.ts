import express from 'express';
import mongoose, {ConnectionOptions} from 'mongoose';
import cors from 'cors';
import { logger } from './logs/logger';
import { TravelController } from './controller/travelController';
import { getPrices } from './services/price';
import { getNews } from './services/news';
import { getCountry } from './services/utils/getCountry';
const schedule = require('node-schedule');
import { getCovid } from './services/covid';
import { getWeather } from './services/weather';

const app = express();


app.use(express.json());
app.use(cors());

app.use(function (req, res, next) {
  res.setHeader('X-Powered-By', 'Laravel')
  next()
})

app.use("/travel", TravelController);

function randomNum(min: Number, max : Number) {
	return Math.floor(Math.random() * (max.valueOf() - min.valueOf())) + min.valueOf();
}

const sleep = (milliseconds : any) => {
	return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

app.get('/', async (req, res) => {
  	return res.status(500).json({message: "API Ready"});
});

async function startScheduling() {
	const ExtiaCountries = [
		'Aix-en-Provence', 'Bordeaux', 'Grenoble', 'Lausanne', 'Lille',
		'Montpellier', 'Nantes', 'Paris', 'Porto', 'Rennes', 'Strasbourg',
		'Toulon', 'Toulouse', 'Tours',
	]
	for (let i = 0; i < ExtiaCountries.length; i++) {
		let resp = await getPrices(ExtiaCountries[randomNum(0, ExtiaCountries.length - 1)], ExtiaCountries[randomNum(0, ExtiaCountries.length - 1)]);
		console.log(resp.data);
		let randomCity = ExtiaCountries[i];
		await getNews(randomCity);
		await getCovid(randomCity);
		await getWeather(randomCity);
		await sleep(60000);
	}
};

const job = schedule.scheduleJob('0 4 * * *', function(){
	startScheduling();	
});

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

app.listen(process.env.PORT, () => {
  logger.info(`Started successfully server at port ${process.env.PORT}`);
  const options: ConnectionOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
  mongoose
    .connect(process.env["MONGO_URL"]!, options)
    .then((res) => {
      logger.info(`Conneted to mongoDB at ${process.env.MONGO_URL}`);
    })
    .catch((error) => {
      logger.error(error);
    });
});