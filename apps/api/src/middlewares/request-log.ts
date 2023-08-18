import { NextFunction, Request, Response } from "express";

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const date = new Date();

  console.log(`[${req.method}]: ${req.baseUrl}${req.path} - ${date.toLocaleString()}`);

  res.on('finish', () => console.log(`[RES: ${res.statusCode}][${req.method}]: ${req.baseUrl || ''}${req.path} - ${Date.now() - date.getTime()}ms`))
  
  next();
}