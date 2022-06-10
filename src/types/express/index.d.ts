import express from "express";

declare global {
    namespace Express {
        interface Result {
            data?: any;
            previous?: Object;
            error?: String;
            message?: string;
        }
        interface Response {
            user : IUser;
            result: Result;
            fillable: string[];
            paginatedResult: Object;
        }
    }
}