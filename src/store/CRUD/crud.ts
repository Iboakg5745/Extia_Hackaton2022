import { NextFunction, Request, Response } from "express";
import { Model } from "mongoose";
import { getErrorMessage, preparePagination } from "../basics";

// Get all object of the model without any verification.
export function getAll(model: Model<any>) {
    return async (req: Request, res: Response, next: NextFunction) => {
        let {result, startIndex, limit} = await preparePagination(model, req);

        try {
            result.results = await model.find().limit(limit).skip(startIndex);
            res.paginatedResult = result;
            next();
        } catch (e) {
            res.status(500).json({ message:getErrorMessage(e) });
        }
    };
}

//Get one object without any protection.
export function get(model: Model<any>) {
    return async (req: Request, res: Response, next: NextFunction) => {
        let result: any = null;
        try {
            result = await model.find({ _id: req.params.id});
            res.result = result;
            next();
        } catch (e) {
            res.status(500).json({ message: getErrorMessage(e)});
        }
    };
}

//Delete one object without any protection.
export function deleteOne(model: Model<any>) {
    return async (req: Request, res: Response, next: NextFunction) => {
        let result: {deletedCount?: number};
        try {
            result = await model.deleteOne({ _id: req.params.id });
            if (result.deletedCount as number == 0)
                return res.status(500).json({ message: "No item found with this id." });
            res.result = {message: "Object deleted"}
            next();
        } catch (e) {
            return res.status(500).json({ message: getErrorMessage(e)});
        }
    };
}