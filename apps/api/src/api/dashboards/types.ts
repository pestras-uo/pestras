/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-namespace */
import { ApiQuery, Dashboard, DashboardSlide, DashboardSlideView } from "@pestras/shared/data-model";
import { Request, Response } from "express";
import { UserSession } from "../../auth";
import {
  CreateDashboardInput,
  UpdateDashboardInput,
  AddDashboardSlideInput,
  UpdateDashboardSlideInput,
  UpdateDashbaordViewInput
} from "@pestras/backend/models";

export namespace DashboardsApi {

  // Read
  // -------------------------------------------------------------------------------
  export type SearchReq = Request<any, any, ApiQuery<Dashboard>>;
  export type SearchRes = Response<{ count: number; results: Dashboard[] }, UserSession>;

  export type GetByTopicReq = Request<{ topic: string }>;
  export type GetByTopicRes = Response<Dashboard[], UserSession>;

  export type GetBySerialReq = Request<{ serial: string }>;
  export type GetBySerialRes = Response<Dashboard | null, UserSession>;

  export type GetCountReq = Request;
  export type GetCountRes = Response<number, UserSession>;

  // Create
  // -------------------------------------------------------------------------------
  export type CreateReq = Request<any, any, CreateDashboardInput>;
  export type CreateRes = Response<Dashboard, UserSession>;

  // Update
  // -------------------------------------------------------------------------------
  export type UpdateReq = Request<{ serial: string }, any, UpdateDashboardInput>;
  export type UpdateRes = Response<Date, UserSession>;

  export type UpdateBannerReq = Request<{ serial: string }, any, { banner: File }>;
  export type UpdateBannerRes = Response<{ path: string | null; date: Date; }, UserSession>;

  // Slides
  // -------------------------------------------------------------------------------
  export type AddSlideReq = Request<{ serial: string; }, any, AddDashboardSlideInput>;
  export type AddSlideRes = Response<{ slide: DashboardSlide, date: Date }, UserSession>;

  export type UpdateSlidesOrderReq = Request<{ serial: string }, any, { slides: string[]; }>;
  export type UpdateSlidesOrderRes = Response<Date, UserSession>;

  export type UpdateSlideReq = Request<{ serial: string; slide: string; }, any, UpdateDashboardSlideInput>;
  export type UpdateSlideRes = Response<Date, UserSession>;

  export type RemoveSlideReq = Request<{ serial: string; slide: string; }>;
  export type RemoveSlideRes = Response<Date, UserSession>;

  // Views
  // -------------------------------------------------------------------------------
  export type AddViewReq = Request<{ serial: string; }, any, DashboardSlideView>;
  export type AddViewRes = Response<{ view: DashboardSlideView; date: Date; }, UserSession>;

  export type UpdateViewsOrderReq = Request<{ serial: string; slide: string; }, any, { views: string[]; }>;
  export type UpdateViewsOrderRes = Response<Date, UserSession>;

  export type UpdateViewReq = Request<{ serial: string; view: string; }, any, UpdateDashbaordViewInput>;
  export type UpdateViewRes = Response<Date, UserSession>;

  export type UpdateViewDataVizReq = Request<{ serial: string; view: string; dataViz: string; }, any, UpdateDashbaordViewInput>;
  export type UpdateViewDataVizRes = Response<Date, UserSession>;

  export type RemoveViewReq = Request<{ serial: string; view: string; }>;
  export type RemoveViewRes = Response<Date, UserSession>;

  // Delete
  // -------------------------------------------------------------------------------
  export type DeleteReq = Request<{ serial: string }>;
  export type DeleteRes = Response<boolean, UserSession>;

}