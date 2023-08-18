/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { RecordWorkflow, WorkflowState } from "@pestras/shared/data-model";
import { Request, Response } from "express";
import { UserSession } from "../../auth";

export namespace WorkflowApis {

  export type getByRecordReq = Request<{ ds: string; record: string }>
  export type getByRecordRes = Response<RecordWorkflow | null, UserSession>;

  export type publishReq = Request<{ ds: string; record: string; }>;
  export type publishRes = Response<Exclude<WorkflowState, WorkflowState.DRAFT>, UserSession>;

  export type approveReq = Request<{ ds: string; record: string; }>;
  export type approveRes = Response<boolean, UserSession>;

  export type cancelReq = Request<{ ds: string; record: string; }>;
  export type cancelRes = Response<boolean, UserSession>;
}