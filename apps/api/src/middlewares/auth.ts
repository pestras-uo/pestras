/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { authenticate } from "../auth";
import { Role } from "@pestras/shared/data-model";
import { TokenType } from "../auth/token";
import { HttpError, HttpCode } from "@pestras/backend/util";

export function apiAuth(roles?: Role[]): (req: Request, res: Response, next: NextFunction) => Promise<void>
export function apiAuth(token: string, roles?: Role[]): (req: Request, res: Response, next: NextFunction) => Promise<void> 
export function apiAuth(tokenOrRoles?: Role[] | string, roles?: Role[]): (req: Request, res: Response, next: NextFunction) => Promise<void> {
  roles = Array.isArray(tokenOrRoles) ? tokenOrRoles : roles;

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = typeof tokenOrRoles === 'string' ? req.params[tokenOrRoles] : req.headers['authorization']?.split(' ')[1];
      const session = await authenticate(token, typeof tokenOrRoles === 'string' ? TokenType.SSE : TokenType.API);
      
      res.locals = session;
  
      // validate role
      if (roles && roles.every(role => !session.issuer.roles.includes(role)))
        throw new HttpError(HttpCode.UNAUTHORIZED, "unauthorizedRole");
  
      next();
      
    } catch (error) {
      next(error);
    }
  }
}

