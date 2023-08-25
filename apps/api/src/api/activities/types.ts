/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-namespace */

import { Request, Response } from "express";
import { UserSession } from "../../auth";

export namespace ActivitiesApi {
  export type GetLastWeekActsReq = Request<{ serial: string; }>;
  export type GetLastWeekActsRes = Response<{ user: string; activities: [string, number][]; }, UserSession>;

  export type GetLastMonthActsReq = Request<{ serial: string; }>;
  export type GetLastMonthActsRes = Response<{ user: string; activities: [string, number][]; }, UserSession>;

  export type GetLastYearActsReq = Request<{ serial: string; }>;
  export type GetLastYearActsRes = Response<{ user: string; activities: [string, number][]; }, UserSession>;
}