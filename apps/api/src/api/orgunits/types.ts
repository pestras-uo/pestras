/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { UserSession } from "../../auth";
import { Orgunit } from "@pestras/shared/data-model";
import { CreateOrgunitInput, UpdateOrgunitInput } from "@pestras/backend/models";

export namespace OrgunitsApi {
  export type GetAllReq = Request;
  export type GetAllRes = Response<Orgunit[], UserSession>;

  export type GetReq = Request<{ serial: string }>;
  export type GetRes = Response<Orgunit | null, UserSession>;

  export type CreateReq = Request<any, any, CreateOrgunitInput>;
  export type CreateRes = Response<Orgunit, UserSession>;
  
  export type UpdateReq = Request<{ serial: string }, any, UpdateOrgunitInput>;
  export type UpdateRes = Response<Date, UserSession>;

  export type UpdateLogoReq = Request<{ serial: string }>;
  export type UpdateLogoRes = Response<{ path: string, date: Date; }, UserSession>;

  export type RemoveReq = Request<{ serial: string }>;
  export type RemoveRes = Response<Date, UserSession>;
}