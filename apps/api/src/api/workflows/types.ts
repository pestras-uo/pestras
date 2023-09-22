/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-namespace */

import { Workflow, WorkflowAction, WorkflowStepOptions } from "@pestras/shared/data-model";
import { Request, Response } from "express";
import { UserSession } from "../../auth";
import { CreateWorkflowInput } from "@pestras/backend/models";

export namespace WorkflowApi {
  
  export type GetBySerialReq = Request<{ serial: string; }>;
  export type GetBySerialRes = Response<Workflow | null, UserSession>;
  
  export type GetByBlueprintReq = Request<{ blueprint: string }>;
  export type GetByBlueprintRes = Response<Workflow[], UserSession>;
  
  export type CreateReq = Request<any, any, CreateWorkflowInput>;
  export type CreateRes = Response<Workflow, UserSession>;
  
  export type UpdateNameReq = Request<{ serial: string; }, any, { name: string; }>;
  export type UpdateNameRes = Response<boolean, UserSession>;
  
  export type UpdateMaxReviewDaysReq = Request<{ serial: string; }, any, { days: number; }>;
  export type UpdateMaxReviewDaysRes = Response<boolean, UserSession>;
  
  export type UpdateDefaultActionReq = Request<{ serial: string; }, any, { action: Exclude<WorkflowAction, WorkflowAction.REVIEW>; }>;
  export type UpdateDefaultActionRes = Response<boolean, UserSession>;
  
  export type UpdateCancelableReq = Request<{ serial: string; }, any, { cancelable: boolean; }>;
  export type UpdateCancelableRes = Response<boolean, UserSession>;
  
  export type UpdateStepsReq = Request<{ serial: string; }, any, { steps: WorkflowStepOptions[]; }>;
  export type UpdateStepsRes = Response<boolean, UserSession>;
}