/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Notification } from "@pestras/shared/data-model";
import { Request, Response } from "express";
import { UserSession } from "../../auth";

export namespace NotificationsApi {

  export type GetReq = Request;
  export type GetRes = Response<Notification[], UserSession>;
  
  export type GetByIdReq = Request<{ serial: string }>;
  export type GetByIdRes = Response<Notification | null, UserSession>;
  
  export type SetSeenReq = Request<{ serial: string }>;
  export type SetSeenRes = Response<Date, UserSession>;
  
}