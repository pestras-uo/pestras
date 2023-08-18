/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-namespace */
import { Request, Response } from "express";
import { UserSession } from "../../auth";
import { BaseDataViz } from "@pestras/shared/data-model";
import { UpdateDataVizInput, CreateDataVizInput } from "@pestras/backend/models";


export namespace DataVizApi {
  export type GetBySerialReq = Request<{ serial: string; }>;
  export type GetBySerialRes = Response<BaseDataViz | null, UserSession>;
  
  export type CreateReq = Request<any, any, CreateDataVizInput>;
  export type CreateRes = Response<BaseDataViz, UserSession>;

  export type UpdateReq = Request<{ serial: string; }, any, UpdateDataVizInput>;
  export type UpdateRes = Response<Date, UserSession>;
}