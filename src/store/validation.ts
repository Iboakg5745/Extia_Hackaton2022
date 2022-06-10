import { NextFunction, Request, Response } from "express";
import Joi from "joi";

interface ISchema {
  validator: Joi.ObjectSchema<any>;
  fillable?: string[];
}

export function validator(schema : ISchema) {
    return (req: Request, res: Response, next: NextFunction) => {
        const {error} = schema.validator.validate(req.body);

        if (error)
            return res.status(400).json( { error: error.details[0].message });
        if(schema && schema.fillable)
          res.fillable = schema.fillable;
        next();
    }
}

export const schemas = {
    register: {
      validator: Joi.object({
        fullName: Joi.string() .min(1) .max(50) .required(),
        email: Joi.string() .min(1) .max(255) .required() .email(),
        password: Joi.string() .min(1) .max(255) .required(),
        ref: Joi.string() .min(1)
      })
    },
    login: {
      validator: Joi.object({
        email: Joi.string() .min(1) .max(255) .required() .email(),
        password: Joi.string() .min(1) .max(255) .required()
      })
    },
    event: {
      validator: Joi.object({
        type: Joi.string() .required(),
        filter: Joi.array() .required()
      })
    },
    updateEvent: {
      validator: Joi.object({
        type: Joi.string(),
        status: Joi.string(),
        filter: Joi.array(),
		note: Joi.number(),
		feedback: Joi.string()
      }),
      fillable: ["type", "feedback", "note"]
    },
	updateUser: {
		validator: Joi.object({
		  fullName: Joi.string().min(3).max(50),
		  email: Joi.string().email(),
		  isChartSigned: Joi.boolean(),
		  password: Joi.string().min(6).max(255)
		}),
		fillable: ["name", "email", "isChartSigned", "password"]
	  },
    room: {
      validator: Joi.object({
        type: Joi.string().required(),
        filter: Joi.array().required(),
      })
    },
    report: {
      validator: Joi.object({
        type: Joi.string().required(),
        comment: Joi.string().required(),
        roomId: Joi.string().required(),
        reportedUserId: Joi.string().required(),
      })
    },
    updateReport: {
      validator: Joi.object({
        type: Joi.string(),
        comment: Joi.string(),
        status: Joi.string(),
      }),
      fillable: ["comment", "type"]
    },
    userValidation: {
      validator: Joi.object({
        website: Joi.string(),
        siret: Joi.string(),
        comment: Joi.string().required(),
      })
    },
    updateUserValidation: {
      validator: Joi.object({
        website: Joi.string(),
        siret: Joi.string(),
        comment: Joi.string(),
        status: Joi.string(),
      }),
      fillable: ["website", "siret", "comment"]
    }
};