/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-namespace */

import { Workflow, WorkflowStepOptions } from "@pestras/shared/data-model";
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
  
  export type UpdateStepsReq = Request<{ serial: string; }, any, { steps: WorkflowStepOptions[]; }>;
  export type UpdateStepsRes = Response<boolean, UserSession>;
}