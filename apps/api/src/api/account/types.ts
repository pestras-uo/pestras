/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-namespace */
import { Request, Response } from "express";
import { UserSession } from "../../auth";

export namespace AccountApi {
  
  export type UpdateUsernameReq = Request<any, any, { username: string }>;
  export type UpdateUsernameRes = Response<Date, UserSession>;
  
  export type UpdatePasswordReq = Request<any, any, { currentPassword: string; newPassword: string; }>;
  export type UpdatePasswordRes = Response<boolean, UserSession>;
  
  export type UpdateProfileReq = Request<any, any, { fullname: string; email: string; mobile: string; }>;
  export type UpdateProfileRes = Response<Date, UserSession>;
  
  export type UpdateAvatarReq = Request<any, any, { avatar: string; }>;
  export type UpdateAvatarRes = Response<{ path: string; date: Date }, UserSession>;
  
  export type RemoveAvatarReq = Request;
  export type RemoveAvatarRes = Response<Date, UserSession>;
  
  export type Req = Request;
  export type Res = Response<Date, UserSession>;
}