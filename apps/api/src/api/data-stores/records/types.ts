/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-namespace */
import { Request, Response } from "express";
import { UserSession } from "../../../auth";
import { TableDataRecord } from "@pestras/shared/data-model";

export namespace RecordsApi {
  
  // read
  // --------------------------------------------------------------------------------
  export type SearchReq = Request<{ serial: string; }>;
  export type SearchRes = Response<{ count: number; results: any[] }, UserSession>;

  export type GetBySerialReq = Request<{ serial: string; record: string; }>;
  export type GetBySerialRes = Response<any, UserSession>;

  export type GetHistoryReq = Request<{ serial: string; record: string; }>;
  export type GetHistoryRes = Response<any, UserSession>;

  // create
  // --------------------------------------------------------------------------------
  export type CreateReq = Request<{ serial: string; }>;
  export type CreateRes = Response<any, UserSession>;

  // update
  // --------------------------------------------------------------------------------
  export type UpdateReq = Request<{ serial: string; record: string; }>;
  export type UpdateRes = Response<any, UserSession>;

  // History
  // --------------------------------------------------------------------------------
  export type RevertHistoryReq = Request<{ serial: string; history: string; }>;
  export type RevertHistoryRes = Response<TableDataRecord, UserSession>;

  // delete
  // --------------------------------------------------------------------------------
  export type DeleteReq = Request<{ serial: string; record: string; }>;
  export type DeleteRes = Response<boolean, UserSession>;
}