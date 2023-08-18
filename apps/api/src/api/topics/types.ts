/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Topic } from "@pestras/shared/data-model";
import { Request, Response } from "express";
import { UserSession } from "../../auth";
import { CreateTopicInput, UpdateTopicInput } from "@pestras/backend/models";

export namespace TopicsApi {

  export type GetByBpReq = Request<{ bp: string; }>;
  export type GetByBpRes = Response<Topic[], UserSession>;

  export type GetByParentReq = Request<{ parent: string; }>;
  export type GetByParentRes = Response<Topic[], UserSession>;

  export type GetBySerialReq = Request<{ serial: string; }>;
  export type GetBySerialRes = Response<Topic | null, UserSession>;

  export type CreateReq = Request<any, any, CreateTopicInput>;
  export type CreateRes = Response<Topic, UserSession>;

  export type UpdateReq = Request<{ serial: string }, any, UpdateTopicInput>;
  export type UpdateRes = Response<Date, UserSession>;

  // access
  // ----------------------------------------------------------------------------
  export type AddOrgunitReq = Request<{ serial: string; orgunit: string; }>;
  export type AddOrgunitRes = Response<boolean, UserSession>;

  export type RemoveOrgunitReq = Request<{ serial: string; orgunit: string; }>;
  export type RemoveOrgunitRes = Response<boolean, UserSession>;
  
  export type AddUserReq = Request<{ serial: string; user: string; }>;
  export type AddUserRes = Response<boolean, UserSession>;

  export type RemoveUserReq = Request<{ serial: string; user: string; }>;
  export type RemoveUserRes = Response<boolean, UserSession>;

  export type AddGroupReq = Request<{ serial: string; group: string; }>;
  export type AddGroupRes = Response<boolean, UserSession>;

  export type RemoveGroupReq = Request<{ serial: string; group: string; }>;
  export type RemoveGroupRes = Response<boolean, UserSession>;
}