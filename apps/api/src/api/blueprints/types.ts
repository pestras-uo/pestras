/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-namespace */
import { Blueprint } from "@pestras/shared/data-model";
import { Request, Response } from "express";
import { UserSession } from "../../auth";

export namespace BlueprintsApi {

  export type GetAllReq = Request;
  export type GetAllRes = Response<Blueprint[], UserSession>;

  export type GetBySerialReq = Request<{ serial: string; }>;
  export type GetBySerialRes = Response<Blueprint | null, UserSession>;

  export type CreateReq = Request<any, any, { name: string; }>;
  export type CreateRes = Response<Blueprint, UserSession>;

  export type UpdateReq = Request<{ serial: string; }, any, { name: string; }>;
  export type UpdateRes = Response<Date, UserSession>;
  
  export type SetOwnerReq = Request<{ serial: string; owner: string; }>;
  export type SetOwnerRes = Response<Date, UserSession>;

  export type AddCollaboratorReq = Request<{ serial: string; collaborator: string; }>;
  export type AddCollaboratorRes = Response<Date, UserSession>;

  export type RemoveCollaboratorReq = Request<{ serial: string; collaborator: string; }>;
  export type RemoveCollaboratorRes = Response<Date, UserSession>;
}