/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { RecordWorkflow, WorkflowTriggers } from "@pestras/shared/data-model";
import { Request, Response } from "express";
import { UserSession } from "../../auth";

export namespace RecordWorkflowApis {

  export type getByRecordReq = Request<{ ds: string; record: string }>
  export type getByRecordRes = Response<RecordWorkflow[], UserSession>;

  export type getRecordWfStateReq = Request<{ ds: string; record: string }>
  export type getRecordWfStateRes = Response<RecordWorkflow | null, UserSession>;

  export type publishReq = Request<{ ds: string; record: string; trigger: WorkflowTriggers }>;
  export type publishRes = Response<boolean, UserSession>;

  export type approveReq = Request<{ ds: string; record: string; }>;
  export type approveRes = Response<boolean, UserSession>;

  export type rejectReq = Request<{ ds: string; record: string; }>;
  export type rejectRes = Response<boolean, UserSession>;

  export type cancelReq = Request<{ ds: string; record: string; }>;
  export type cancelRes = Response<boolean, UserSession>;
}