import { User } from "../database";
import * as Sentry from "@sentry/node";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { Model } from "mongoose";
import { getErrorMessage } from "./basics";

interface JwtPayload {
  _id: string
}

export async function insertOwner(req: Request, res: Response, next: NextFunction) {
	try {
		let data : typeof res.result.data = [];
		for (let i = 0; i < res.result.data.length; i++) {
			let result = JSON.parse(JSON.stringify(res.result.data[i]));
			let user = await User.findOne({_id: res.result.data[i].ownerId});
			if (user) {
				result.owner = user.fullName;
			}
			data.push(result);
		}
		res.result.data = data;
		next();
    } catch (e) {
        return res.status(500).json({ message: getErrorMessage(e) });
    }
}

export async function needToBeAdmin(req: Request, res: Response, next: NextFunction) {
    const usertoken = req.headers.authorization;
    
    if (usertoken) {
      const token = usertoken.split(' ');
      try {
        const { _id }= jwt.verify(token[1], process.env.PUBLIC_KEY!) as JwtPayload;
        let user = await User.findOne({_id: _id});
        if (user && user.role === "admin") {
            res.user = user;
            next();
        } else
            return res.status(403).json({error: 'You need to be logged as an admin.'});
      } catch (error) {
        return res.status(403).json({error: 'You need to be logged.'});
      }
    } else {
        return res.status(403).json({error: 'You need to be logged.'});
    }
}

export async function auth(req: Request, res: Response, next: NextFunction) {
    const usertoken = req.headers.authorization;
  
    if (usertoken) {
      const token = usertoken.split(' ');
      try {
        const { _id }= jwt.verify(token[1], process.env.PUBLIC_KEY!) as JwtPayload;
        let user = await User.findOne({_id: _id});
        if (!user)
          return res.status(403).json({error: 'User not found.'});
        res.user = user;
        Sentry.setUser({ email: user.email });
        next();
      } catch (error) {
        return res.status(403).json({message: getErrorMessage(error)});
      }
    } else {
        return res.status(403).json({error: 'You need to be logged.'});
    }
}