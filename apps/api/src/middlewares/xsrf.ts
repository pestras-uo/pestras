import { NextFunction, Request, Response } from "express";
import { HttpCode } from "@pestras/backend/util";

export function xsrfCheck(req: Request, res: Response, next: NextFunction) {
  const xsrf = req.cookies['xsrf'];
  const header = req.headers['x-xsrf-token'];

  if (!xsrf)
    return next();

  if (xsrf !== header)
    return res.status(HttpCode.FORBIDDEN).json({ messsage: 'forbidden' });

  next();
}