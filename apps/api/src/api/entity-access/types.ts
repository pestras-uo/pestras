/* eslint-disable @typescript-eslint/no-namespace */
import { Request, Response } from "express";
import { UserSession } from "../../auth";
import { EntityAccess } from "@pestras/shared/data-model";

export namespace EntityAccessApi {

  export type GetByEntityReq = Request<{ entity: string; }>;
  export type GetByEntityRes = Response<EntityAccess, UserSession>;

  export type allowGuestsReq = Request<{ entity: string; }, unknown, { allow: boolean; }>;
  export type allowGuestsRes = Response<boolean, UserSession>;

  export type AddOrgunitReq = Request<{ entity: string; orgunit: string }>;
  export type AddOrgunitRes = Response<boolean, UserSession>;

  export type RemoveOrgunitReq = Request<{ entity: string; orgunit: string }>;
  export type RemoveOrgunitRes = Response<boolean, UserSession>;

  export type AddUserReq = Request<{ entity: string; user: string }>;
  export type AddUserRes = Response<boolean, UserSession>;

  export type RemoveUserReq = Request<{ entity: string; user: string }>;
  export type RemoveUserRes = Response<boolean, UserSession>;

  export type AddGroupReq = Request<{ entity: string; group: string }>;
  export type AddGroupRes = Response<boolean, UserSession>;

  export type RemoveGroupReq = Request<{ entity: string; group: string }>;
  export type RemoveGroupRes = Response<boolean, UserSession>;
}