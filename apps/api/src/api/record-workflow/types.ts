/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataRecordState, RecordWorkflow, RecordWorkflowState, WorkflowTriggers } from "@pestras/shared/data-model";
import { Request, Response } from "express";
import { UserSession } from "../../auth";

export namespace RecordWorkflowApis {

  export type GetByRecordReq = Request<{ ds: string; record: string; }>
  export type GetByRecordRes = Response<RecordWorkflowState, UserSession>;

  export type GetRecordActiveWfReq = Request<{ ds: string; record: string; }>
  export type GetRecordActiveWfRes = Response<RecordWorkflow | null, UserSession>;

  export type PublishReq = Request<{ ds: string; record: string; trigger: WorkflowTriggers }, any, { message: string; }>;
  export type PublishRes = Response<boolean, UserSession>;

  export type ApproveReq = Request<{ ds: string; record: string; step: string; }, any, { message: string; }>;
  export type ApproveRes = Response<DataRecordState | null, UserSession>;

  export type RejectReq = Request<{ ds: string; record: string; step: string; }, any, { message: string; }>;
  export type RejectRes = Response<DataRecordState, UserSession>;
}