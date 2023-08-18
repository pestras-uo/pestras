/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-namespace */
import { Attachment } from "@pestras/shared/data-model";
import { Request, Response } from "express";
import { UserSession } from "../../auth";

export namespace AttachmentsApi {

  export type GetBySerialReq = Request<{ serial: string; }>;
  export type GetBySerialRes = Response<Attachment | null, UserSession>; 

  export type GetByEntityReq = Request<{ entity: string; }>;
  export type GetByEntityRes = Response<Attachment[], UserSession>; 

  export type CreateReq = Request<any, any, { entity: string; name: string; attachment: any; }>;
  export type CreateRes = Response<Attachment, UserSession>; 

  export type UpdateNameReq = Request<{ serial: string; }, any, { name: string; }>;
  export type UpdateNameRes = Response<boolean, UserSession>; 

  export type RemoveReq = Request<{ serial: string; }>;
  export type RemoveRes = Response<boolean, UserSession>; 

  export type RemoveByEntityReq = Request<{ entity: string; }>;
  export type RemoveByEntityRes = Response<boolean, UserSession>; 
}