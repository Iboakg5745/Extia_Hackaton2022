import { NextFunction, Request, Response } from "express";
import { Model, UpdateWriteOpResult } from "mongoose";
import { getErrorMessage, preparePagination } from "../basics";

interface IUpdateOne {
    n: number;
    nModified: number;
    ok: number;
    deletedCount: number;
  }

//Get all objects if admin, only the owned objects else.
export function getAllProtected(model: Model<any>) {
    return async (req: Request, res: Response, next: NextFunction) => {
        let {result, startIndex, limit} = await preparePagination(model, req);

        try {
            if (res.user.role === "admin" && req.query.onlyMine != "true") {
				if (req.query.all == "true")
                	result.data = await model.find();
				else
					result.data = await model.find().limit(limit).skip(startIndex);
            } else {
                result.data = await model.find({
                    ownerId: res.user._id
                }).limit(limit).skip(startIndex);
            }
            res.result = result;
            next();
        } catch (e) {
            res.status(500).json({ message: getErrorMessage(e) });
        }
    };
}

//Get one object only if it's and admin or the object owner.
export function getProtected(model: Model<any>) {
    return async (req: Request, res: Response, next: NextFunction) => {
        let result = [];

        if (res.user.role === "admin") {
            result = await model.findOne({_id: req.params.id});
        } else {
            result = await model.findOne({
                _id: req.params.id,
                ownerId: res.user._id
            });
        }
        if (result) {
            res.result = result;
            return next();
        }
        return res.status(403).json({error: 'Any object found.'});
    };
}

//Update an object only if it's an admin or the owner.
export function putProtected(model: Model<any>) {
    return async (req: Request, res: Response, next: NextFunction) => {
        let safeBody: any = {};
        let result: UpdateWriteOpResult;

        if (Object.keys(req.body).length == 0)
            return res.status(403).json({error: 'Body is empty.'});
        res.fillable.forEach((item)=>{
            if (req.body[item])
                safeBody[item] = req.body[item]
        })

        if (res.user.role === "admin") {
            result = await model.updateOne({_id: req.params.id}, req.body);
        } else {
            result = await model.updateOne({
                _id: req.params.id,
                ownerId: res.user._id
            }, safeBody);
        }
        if (result && result.n) {
            res.result = {message: 'Object updated.'};
            return next();
        }
        return res.status(403).json({error: 'Any object found.'});
    };
}

//Delete one object without any protection.
export function deleteProtected(model: Model<any>) {
    return async (req: Request, res: Response, next: NextFunction) => {
        let result: {deletedCount?: number};
        try {
            if (res.user.role === "admin") {
                result = await model.deleteOne({_id: req.params.id});
            } else {
                result = await model.deleteOne({
                    _id: req.params.id,
                    ownerId: res.user._id
                });
            }
            if (result.deletedCount == 0)
                return res.status(500).json({ message: "No item found with this id." });
            res.result = {message: "Object deleted"}
            next();
        } catch (e) {
            return res.status(500).json({ message: getErrorMessage(e) });
        }
    };
}