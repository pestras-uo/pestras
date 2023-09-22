/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { RecordWorkflow, WorkflowTriggers } from "@pestras/shared/data-model";
import { Request, Response } from "express";
import { UserSession } from "../../auth";

export namespace RecordWorkflowApis {

  export type GetByRecordReq = Request<{ ds: string; record: string }>
  export type GetByRecordRes = Response<RecordWorkflow[], UserSession>;

  export type GetRecordWfStateReq = Request<{ ds: string; record: string }>
  export type GetRecordWfStateRes = Response<RecordWorkflow | null, UserSession>;

  export type PublishReq = Request<{ ds: string; record: string; trigger: WorkflowTriggers }>;
  export type PublishRes = Response<boolean, UserSession>;

  export type ApproveReq = Request<{ ds: string; step: string; }, any, { message: string; }>;
  export type ApproveRes = Response<boolean, UserSession>;

  export type RejectReq = Request<{ ds: string; step: string; }, any, { message: string; }>;
  export type RejectRes = Response<boolean, UserSession>;

  export type CancelReq = Request<{ ds: string; record: string; }>;
  export type CancelRes = Response<boolean, UserSession>;
}