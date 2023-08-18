/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-namespace */
import { Request, Response } from "express";
import { UserSession } from "../../auth";
import { BaseAnalysis } from "@pestras/shared/data-model";
import { UpdateAnalysisInput, CreateAnalysisInput } from "@pestras/backend/models";


export namespace AnalysisApi {
  export type GetBySerialReq = Request<{ serial: string; }>;
  export type GetBySerialRes = Response<BaseAnalysis | null, UserSession>;

  export interface CreateAnalysisApiInput {
    entity: { type: 'dashboard' | 'report', serial: string, slide: string; view: string; };
    data: CreateAnalysisInput;
  }
  export type CreateReq = Request<{ serial: string; }, any, CreateAnalysisApiInput>;
  export type CreateRes = Response<BaseAnalysis, UserSession>;

  export type UpdateReq = Request<{ serial: string; }, any, UpdateAnalysisInput>;
  export type UpdateRes = Response<Date, UserSession>;
}