/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-namespace */
import { UsersGroup } from "@pestras/shared/data-model";
import { Request, Response } from "express";
import { UserSession } from "../../auth";

export namespace UsersGroupsApi {

  export type GetAllReq = Request;
  export type GetAllRes = Response<UsersGroup[], UserSession>;

  export type GetBySerialReq = Request<{ serial: string; }>;
  export type GetBySerialRes = Response<UsersGroup | null, UserSession>;

  export type CreateReq = Request<any, any, { name: string }>;
  export type CreateRes = Response<UsersGroup, UserSession>;

  export type UpdateReq = Request<{ serial: string }, any, { name: string }>;
  export type UpdateRes = Response<Date, UserSession>;

  export type DeleteReq = Request<{ serial: string }>;
  export type DeleteRes = Response<boolean, UserSession>;

}