/* eslint-disable @typescript-eslint/no-explicit-any */
import * as jwt from 'jsonwebtoken';
import { HttpError, HttpCode } from '@pestras/backend/util';
import config from '../config';

export enum TokenType {
  SESSION,
  API
}

export interface TokenData extends jwt.JwtPayload {
  type: TokenType;
  remember: boolean;
}

export function sign(subject: string, data: TokenData, remember = false) {
  return jwt.sign(data, config.tokenSecret, { expiresIn: remember ? "7d" : "1d", subject });
}

export function verify(token: string) {
  let tokenData: TokenData;

  if (!token)
    throw new HttpError(HttpCode.TOKEN_REQUIRED, "tokenRequired");

  try {
    tokenData = jwt.verify(token, config.tokenSecret) as TokenData;
  } catch (error: any) {
    if (error instanceof jwt.TokenExpiredError)
      throw new HttpError(HttpCode.INVALID_TOKEN, "invalidExpired");

    throw new HttpError(HttpCode.INVALID_TOKEN, "invalidToken");
  }

  if (tokenData.type === TokenType.SESSION) {
    if (!tokenData.sub)
      throw new HttpError(HttpCode.INVALID_TOKEN, "invalidTokenData");
  }

  return tokenData;
}

