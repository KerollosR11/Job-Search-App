import { NextFunction, Request, Response } from "express"
import { BadRequestException } from "../Utils/Response/error.response";

/*
export const validation = (schema :joi.ObjectSchema) =>{

    return (req :Request, res :Response, next :NextFunction)=>{
        const validatingData = schema.validate(
            {
                body: req.body,
                params: req.params,
                query: req.query
            },
            {
                abortEarly: false
            }
        );

        if(validatingData.error){
            throw new BadRequestException("Validation Error", {cause: validatingData.error})
        }

        next();
    }
}
*/

import Joi from "joi";

type KeyReqType = keyof Request;

type SchemaType = Partial<Record<KeyReqType, Joi.Schema>>;

export const validation = (schema: SchemaType) => {
  return (req: Request, res: Response, next: NextFunction) => {

    const validationErrors: Array<{
      key: KeyReqType;
      issues: Array<{
        message: string;
        path: (string | number)[];
      }>;
    }> = [];

    for (const key of Object.keys(schema) as KeyReqType[]) {

      const keySchema = schema[key];

      if (!keySchema) continue;

      const { error } = keySchema.validate(req[key], {
        abortEarly: false
      });

      if (error) {
        validationErrors.push({
          key,

          issues: error.details.map((detail) => ({
            message: detail.message,
            path: detail.path
          }))
        });
      }
    }

    if (validationErrors.length > 0) {
      throw new BadRequestException(
        "Validation Error",
        {
          cause: validationErrors
        }
      );
    }

    next();
  };
};