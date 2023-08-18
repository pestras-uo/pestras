/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from "@pestras/shared/data-model";
import { Request, Response } from "express";
import { UserSession } from "../../auth";

export namespace SessionApi {

  export type LoginReq = Request<any, any, { username: string, password: string, remember: boolean; }>;
  export type LoginRes = Response<User>;

  export type VerifySessionReq = Request;
  export type VerifySessionRes = Response<User, UserSession>;

  export type LogoutReq = Request;
  export type LogoutRes = Response<boolean, UserSession>;
}