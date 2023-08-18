/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-namespace */
import { ContentView, EntityContentViews } from "@pestras/shared/data-model";
import { Request, Response } from "express";
import { UserSession } from "../../auth";

export namespace ContentViewsApi {

  export type GetByEntityReq = Request<{ entity: string; }>;
  export type GetByEntityRes = Response<EntityContentViews | null, UserSession>;

  export type AddViewReq = Request<{ entity: string; }, any, Omit<ContentView, 'serial'>>;
  export type AddViewRes = Response<ContentView, UserSession>;

  export type UpdateViewsOrderReq = Request<{ entity: string; }, any, { views: string[] }>;
  export type UpdateViewsOrderRes = Response<boolean, UserSession>;

  export type UpdateViewReq = Request<{ entity: string; view: string; }, any, Pick<ContentView, 'title' | 'sub_title'>>
  export type UpdateViewRes = Response<boolean, UserSession>;

  export type UpdateViewContentReq = Request<{ entity: string; view: string; }, any, { content: string; }>
  export type UpdateViewContentRes = Response<string | null, UserSession>;

  export type RemoveViewReq = Request<{ entity: string; view: string; }>;
  export type RemoveViewRes = Response<boolean, UserSession>;
}