import { Validall } from "@pestras/validall";
import { NextFunction, Request, Response } from "express";
import { HttpError, HttpCode } from "@pestras/backend/util";

export function validate(schema: string, source: 'body' | 'query' = 'body') {
  const validator = Validall.Get(schema);

  if (!validator)
    throw new Error(`schema '${schema}' not found`);

  return (req: Request, _: Response, next: NextFunction) => {
    const src = req[source];

    if (validator.validate(src))
      return next();

    console.log(validator.error);
    next(new HttpError(HttpCode.BAD_REQUEST, validator.error.message));
  }
}