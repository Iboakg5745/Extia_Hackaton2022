import { NextFunction, Request, Response } from 'express';
import {createLogger, format, transports} from 'winston';

export const logger = createLogger({
    transports: [
      new transports.File({
        filename: 'logs/server.log',
        format:format.combine(
            format.timestamp({format: 'MMM-DD-YYYY HH:mm:ss'}),
            format.align(),
            format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`),
        )}),
        new transports.Stream({
          stream: process.stderr,
          level: 
          'info',
        })
      ]
  });

  const getActualRequestDurationInMilliseconds = (start: [number, number]) => {
    const NS_PER_SEC = 1e9; // convert to nanoseconds
    const NS_TO_MS = 1e6; // convert to milliseconds
    const diff = process.hrtime(start);
    return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
};

export const internalLogger = (req: Request, res: Response, next: NextFunction) => {
    let method = req.method;
    let url = req.url;
    let status = res.statusCode;
    const start = process.hrtime();
    const durationInMilliseconds = getActualRequestDurationInMilliseconds(start);
    let log = {meta: '', body: null};
    log.meta = `[${method}]:${url} ${status} ${req.socket.remoteAddress} ${durationInMilliseconds.toLocaleString()} ms`;
    if (process.env.NODE_ENV !== 'production')
      log.body = req.body;
    next();
  };