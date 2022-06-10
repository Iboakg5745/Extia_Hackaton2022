import { Request } from "express";
import { Model } from "mongoose";

export async function preparePagination(model: Model<any>, req: Request)
{
    let page = 1;
    let limit = 10

    if (req.query.page)
        page = parseInt(req.query.page as string);
    if (req.query.limit)
        limit = parseInt(req.query.limit as string);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    const result = {next: {}, previous: {}, results: {}, data:{} };
    if (endIndex < (await model.countDocuments().exec())) {
        result.next = {
        page: page + 1,
        limit: limit,
        };
    }
    if (startIndex > 0) {
        result.previous = {
        page: page - 1,
        limit: limit,
        };
    }
    return {result: result, startIndex: startIndex, limit: limit};    
}

export function getErrorMessage(error: unknown) {
    if (error instanceof Error) return error.message
    return String(error)
}