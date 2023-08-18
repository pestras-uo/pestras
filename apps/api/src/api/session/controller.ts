import { UserState } from "@pestras/shared/data-model";
import { sign, TokenType } from "../../auth/token";
import config from "../../config";
import { HttpError, HttpCode } from "@pestras/backend/util";
import { authModel, usersModel } from "../../models";
import { SessionApi } from "./types";
import argon from 'argon2';
import crypto from 'crypto';

export const SessionController = {

  async login(req: SessionApi.LoginReq, res: SessionApi.LoginRes) {
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
      { type: TokenType.SESSION, remember: req.body.remember },
      req.body.remember
    );

    res.cookie("session", token, { httpOnly: true, secure: config.prod });
    res.cookie("xsrf", crypto.randomBytes(32).toString('hex'));
    res.json(user);
  },


  verifySession(_: SessionApi.VerifySessionReq, res: SessionApi.VerifySessionRes) {
    const token = sign(
      res.locals.issuer.serial,
      { type: TokenType.SESSION, remember: res.locals.remember },
      res.locals.remember
    );

    res.cookie("session", token, { httpOnly: true, secure: config.prod });
    res.cookie("xsrf", crypto.randomBytes(32).toString('hex'));
    res.json(res.locals.issuer);
  },


  async logout(_: SessionApi.LogoutReq, res: SessionApi.LogoutRes) {
    res.clearCookie('session', { httpOnly: true, secure: config.prod });
    res.clearCookie("xsrf");
    res.json(true);
  }
}