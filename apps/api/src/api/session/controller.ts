import { UserState } from "@pestras/shared/data-model";
import { sign, TokenType } from "../../auth/token";
import config from "../../config";
import { HttpError, HttpCode } from "@pestras/backend/util";
import { SessionApi } from "./types";
import argon from 'argon2';
import { NextFunction } from 'express';
import { authModel, usersModel } from "@pestras/backend/models";

export const SessionController = {

  async login(req: SessionApi.LoginReq, res: SessionApi.LoginRes, next: NextFunction) {
    try {
      const user = await usersModel.getByUsername(req.body.username);

      if (!user)
        throw new HttpError(HttpCode.NOT_FOUND, "userNotFound");

      if (user.state === UserState.INACTIVE)
        throw new HttpError(HttpCode.UNAUTHORIZED, "userIsInactive")

      const auth = await authModel.getByUserSerial(user.serial, { password: 1 });

      if (!auth)
        throw new HttpError(HttpCode.INTERNAL_SERVER_ERROR, 'userAuthNotFound');

      if (!(await argon.verify(auth.password, req.body.password)))
        throw new HttpError(HttpCode.FORBIDDEN, "wrongPassword");

      const token = sign(
        user.serial,
        { type: TokenType.API, remember: req.body.remember },
        req.body.remember
      );
      const sseToken = sign(
        user.serial,
        { type: TokenType.SSE, remember: req.body.remember },
        req.body.remember
      );

      res.json({ token, sseToken, user });

    } catch (error) {
      next(error);
    }
  },


  verifySession(_: SessionApi.VerifySessionReq, res: SessionApi.VerifySessionRes, next: NextFunction) {
    try {
      const token = sign(
        res.locals.issuer.serial,
        { type: TokenType.API, remember: res.locals.remember },
        res.locals.remember
      );
      const sseToken = sign(
        res.locals.issuer.serial,
        { type: TokenType.SSE, remember: res.locals.remember },
        res.locals.remember
      );

      res.json({ token, sseToken, user: res.locals.issuer });

    } catch (error) {
      next(error);
    }
  },


  async logout(_: SessionApi.LogoutReq, res: SessionApi.LogoutRes, next: NextFunction) {
    try {
      res.clearCookie('session', { httpOnly: true, secure: config.prod });
      res.clearCookie("xsrf");
      res.json(true);

    } catch (error) {
      next(error);
    }
  }
}