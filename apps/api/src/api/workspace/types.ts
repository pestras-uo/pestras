/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Workspace, WorkspaceDashboardSlide, WorkspacePin } from "@pestras/shared/data-model";
import { Request, Response } from "express";
import { UserSession } from "../../auth";

export namespace WorkspaceApi {

  export type GetByOwnerReq = Request;
  export type GetByOwnerRes = Response<Workspace | null, UserSession>;

  export type AddGroupReq = Request<any, any, { name: string; }>;
  export type AddGroupRes = Response<string, UserSession>;

  export type UpdateGroupReq = Request<{ group: string; }, any, { name: string; }>;
  export type UpdateGroupRes = Response<boolean, UserSession>;

  export type RemoveGroupReq = Request<{ group: string; }>;
  export type RemoveGroupRes = Response<boolean, UserSession>;

  export type AddPinReq = Request<any, any, WorkspacePin>;
  export type AddPinRes = Response<boolean, UserSession>;

  export type RemovePinReq = Request<{ pin: string; }>;
  export type RemovePinRes = Response<boolean, UserSession>;

  export type AddSlideReq = Request<any, any, WorkspaceDashboardSlide>;
  export type AddSlideRes = Response<boolean, UserSession>;

  export type RemoveSlideReq = Request<{ slide: string; }>;
  export type RemoveSlideRes = Response<boolean, UserSession>;
}