import express from 'express';
import mongoose, {ConnectionOptions} from 'mongoose';
import cors from 'cors';
import { logger } from './logs/logger';
import { travelController } from './controller/travelController';

const app = express();


app.use(cors());

app.use(function (req, res, next) {
  res.setHeader('X-Powered-By', 'Laravel')
  next()
})

app.use("/travel", travelController);

app.get('/', async (req, res) => {
  res.status(500).json({message: "API Ready"});
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