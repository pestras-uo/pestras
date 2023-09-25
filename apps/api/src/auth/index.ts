/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpError, HttpCode } from "@pestras/backend/util";
import { User, UserState } from "@pestras/shared/data-model";
import { TokenType, verify } from "./token";
import { usersModel } from "@pestras/backend/models";

export interface UserSession {
  issuer: User;
  remember: boolean;
}

export async function authenticate(
  token: string,
  tokenType: TokenType
) {
  const tokenData = verify(token);

  if (tokenData.type !== tokenType)
    throw new HttpError(HttpCode.INVALID_TOKEN, "invalidTokenType");

  const issuer = await usersModel.getBySerial(tokenData.sub);

  if (!issuer)
    throw new HttpError(HttpCode.UNAUTHORIZED, "tokenExpired");

  if (issuer.state === UserState.INACTIVE)
    throw new HttpError(HttpCode.UNAUTHORIZED, 'userIsInactive');

  return {
    issuer,
    remember: tokenData.remember
  } as UserSession;
}
