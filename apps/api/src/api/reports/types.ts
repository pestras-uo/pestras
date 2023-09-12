/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiQuery, Report, ReportSlide, ReportView } from "@pestras/shared/data-model";
import { Request, Response } from "express";
import { UserSession } from "../../auth";
import { UpdateReportInput, UpdateReportViewInput, CreateReportInput } from "@pestras/backend/models";

export namespace ReportsApi {
  
  // Read
  // -------------------------------------------------------------------------------
  export type SearchReq = Request<any, any, ApiQuery<Report>>;
  export type SearchRes = Response<{ count: number; results: Report[] }, UserSession>;
  
  export type GetByTopicReq = Request<{ topic: string }>;
  export type GetByTopicRes = Response<Report[], UserSession>;

  export type GetBySerialReq = Request<{ serial: string }>;
  export type GetBySerialRes = Response<Report | null, UserSession>;
  
  // Create
  // -------------------------------------------------------------------------------
  export type CreateReq = Request<any, any, CreateReportInput>;
  export type CreateRes = Response<Report, UserSession>;

  // Update
  // -------------------------------------------------------------------------------
  export type UpdateReq = Request<{ serial: string }, any, UpdateReportInput>;
  export type UpdateRes = Response<Date, UserSession>;

  export type UpdateBannerReq = Request<{ serial: string }, any, { banner: File }>;
  export type UpdateBannerRes = Response<{ path: string | null; date: Date; }, UserSession>;

  // Slides
  // -------------------------------------------------------------------------------
  export type AddSlideReq = Request<{ serial: string; }, any, { title: string; }>;
  export type AddSlideRes = Response<{ slide: ReportSlide; date: Date }, UserSession>;

  export type UpdateSlidesOrderReq = Request<{ serial: string }, any, { slides: string[]; }>;
  export type UpdateSlidesOrderRes = Response<Date, UserSession>;

  export type UpdateSlideReq = Request<{ serial: string; slide: string; }, any, { title: string; }>;
  export type UpdateSlideRes = Response<Date, UserSession>;

  export type RemoveSlideReq = Request<{ serial: string; slide: string; }>;
  export type RemoveSlideRes = Response<Date, UserSession>;

  // Views
  // -------------------------------------------------------------------------------
  export type AddViewReq = Request<{ serial: string; }, any, ReportView>;
  export type AddViewRes = Response<{ view: ReportView, date: Date }, UserSession>;

  export type UpdateViewsOrderReq = Request<{ serial: string; slide: string; }, any, { views: string[]; }>;
  export type UpdateViewsOrderRes = Response<Date, UserSession>;
  
  export type UpdateViewReq = Request<{ serial: string; view: string }, any, UpdateReportViewInput>;
  export type UpdateViewRes = Response<Date, UserSession>;
  
  export type UpdateViewContentReq = Request<{ serial: string; view: string }, any, { content: string; }>;
  export type UpdateViewContentRes = Response<Date, UserSession>;
  
  export type UpdateViewImageContentReq = Request<{ serial: string; view: string }, any, { image: File; }>;
  export type UpdateViewImageContentRes = Response<{ path: string; date: Date; }, UserSession>;

  export type RemoveViewReq = Request<{ serial: string; view: string }>;
  export type RemoveViewRes = Response<Date, UserSession>;

  // Delete
  // -------------------------------------------------------------------------------
  export type DeleteReq = Request<{ serial: string }>;
  export type DeleteRes = Response<boolean, UserSession>;

}