/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-namespace */
import { ClientApi, ClientApiDataStoreParam } from "@pestras/shared/data-model";
import { Request, Response } from "express";
import { UserSession } from "../../auth";
import {
  CreateClientApiInput,
  AddClientApiDataStoreInput,
  UpdateClientApiDataStoreInput,
  AddClientApiParamInput,
  UpdateClientApiParamInput
} from "@pestras/backend/models";

export namespace ClientsApi {

  export type GetByBlueprintReq = Request<{ blueprint: string; }>;
  export type GetByBlueprintRes = Response<ClientApi[], UserSession>;

  export type GetBySerialReq = Request<{ serial: string; }>;
  export type GetBySerialRes = Response<ClientApi | null, UserSession>;

  export type CreateReq = Request<any, any, CreateClientApiInput>;
  export type CreateRes = Response<ClientApi, UserSession>;

  export type UpdateReq = Request<{ serial: string; }, any, { client_name: string; }>;
  export type UpdateRes = Response<Date, UserSession>;

  export type AddIPReq = Request<{ serial: string; }, any, { ip: string; }>;
  export type AddIPRes = Response<Date, UserSession>;

  export type RemoveIPReq = Request<{ serial: string; }, any, { ip: string; }>;
  export type RemoveIPRes = Response<Date, UserSession>;

  export type AddDataStoreReq = Request<{ serial: string; ds: string; }, any, AddClientApiDataStoreInput>;
  export type AddDataStoreRes = Response<Date, UserSession>;

  export type UpdateDataStoreReq = Request<{ serial: string; ds: string; }, any, UpdateClientApiDataStoreInput>;
  export type UpdateDataStoreRes = Response<Date, UserSession>;

  export type RemoveDataStoreReq = Request<{ serial: string; ds: string; }>;
  export type RemoveDataStoreRes = Response<Date, UserSession>;

  export type AddParamReq = Request<{ serial: string; ds: string; }, any, AddClientApiParamInput>;
  export type AddParamRes = Response<{ param: ClientApiDataStoreParam; date: Date }, UserSession>;

  export type UpdateParamReq = Request<{ serial: string; ds: string; param: string; }, any, UpdateClientApiParamInput>;
  export type UpdateParamRes = Response<Date, UserSession>;

  export type RemoveParamReq = Request<{ serial: string; ds: string; param: string; }>;
  export type RemoveParamRes = Response<Date, UserSession>;

  export type DeleteReq = Request<{ serial: string; }>;
  export type DeleteRes = Response<boolean, UserSession>;
}