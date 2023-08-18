/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { authenticate, UserSession } from "../auth";
import { Role } from "@pestras/shared/data-model";
import { TokenType } from "../auth/token";
import { HttpError, HttpCode } from "@pestras/backend/util";

export function apiAuth(roles?: Role[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies['session'];
    let session: UserSession;
    try {
      session = await authenticate(token, TokenType.SESSION);
      res.locals = session;
    } catch (error) {
      res.clearCookie('session');
      throw error;
    }

    // validate role
    if (roles && roles.every(role => !session.issuer.roles.includes(role)))
      throw new HttpError(HttpCode.UNAUTHORIZED, "unauthorizedRole");

    next();
  }
}

